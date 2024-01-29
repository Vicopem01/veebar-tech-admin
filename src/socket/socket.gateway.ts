import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserMessageBodyDto } from '../messages/messages.dto';
import { instrument } from '@socket.io/admin-ui';
import { MessagesService } from '../messages/messages.service';
import { UseGuards } from '@nestjs/common';
import { DevicesService } from 'src/devices/devices.service';

const mapHasUserId = (map: Map<string, string>, userId: string): boolean => {
  for (const val of map.values()) if (val === userId) return true;
  return false;
};

@WebSocketGateway({
  cors: {
    origin: [
      'https://admin.socket.io',
      'https://veebar-client.vercel.app',
      'http://localhost:3000',
    ],
    credentials: true,
  },
})
export default class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private clients: Map<string, Socket> = new Map(); // save connected clients
  private reverseClients: Map<string, string> = new Map(); //save connected clients ids
  constructor(
    private readonly messagesService: MessagesService,
    private readonly devicesService: DevicesService,
  ) {}
  @WebSocketServer() private server: Server;

  afterInit() {
    instrument(this.server, {
      mode: 'production',
      auth: false,
    });
  }

  async handleConnection(client: Socket) {
    console.log(client);
    const auth = client.handshake.auth;
    if (auth.userId) {
      this.clients.set(auth.userId, client);
      !mapHasUserId(this.reverseClients, auth.userId) &&
        this.reverseClients.set(client.id, auth.userId);
    }
    await this.devicesService.newDeviceConnection(client);
  }

  handleDisconnect(client: Socket) {
    const userId: string = this.reverseClients.get(client.id);
    if (userId) {
      this.reverseClients.delete(client.id);
      this.clients.delete(userId);
    }
  }

  @SubscribeMessage('user_message')
  async handleUserMessage(
    @MessageBody() messageBody: UserMessageBodyDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const { userId } = messageBody;
      const messageData = {
        sender: 'user',
        content: messageBody.message,
        timestamp: Date.now(),
      };
      await this.messagesService.handleUserMessage(messageData, userId);
      socket.emit('new_message', messageData);
      return;
    } catch (e) {
      throw e;
    }
  }

  @SubscribeMessage('get raspis')
  getRaspis(@ConnectedSocket() socket: Socket) {
    return this.devicesService.getRaspis(socket);
  }

  @SubscribeMessage('get raspi')
  getRaspi(
    @ConnectedSocket() socket: Socket,
    @MessageBody('raspiId') raspiId: string,
  ) {
    return this.devicesService.getRaspi(socket, raspiId);
  }

  @SubscribeMessage('get raspi status')
  getRaspiStatus(
    @ConnectedSocket() socket: Socket,
    @MessageBody('FCMToken') FCMToken: any,
  ) {
    return this.devicesService.getRaspiStatus(socket, FCMToken);
  }

  @SubscribeMessage('fcm_token')
  fcmToken(
    @ConnectedSocket() socket: Socket,
    @MessageBody('raspiId') raspiId: string,
  ) {
    return this.devicesService.fcmToken(socket, raspiId);
  }

  @SubscribeMessage('visit')
  visit(@ConnectedSocket() socket: Socket) {
    return this.devicesService.visit(socket);
  }

  @SubscribeMessage('new raspi')
  newRaspi(@MessageBody() messageBody: any, @ConnectedSocket() socket: Socket) {
    return this.devicesService.newRaspi(socket, messageBody);
  }

  @SubscribeMessage('change raspi icon')
  changeRaspiIcon(
    @MessageBody() messageBody: any,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.devicesService.changeRaspiIcon(socket, messageBody);
  }

  @SubscribeMessage('rename sensor')
  renameSensor(
    @MessageBody() messageBody: any,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.devicesService.renameSensor(socket, messageBody);
  }

  @SubscribeMessage('rename raspi')
  renameRaspi(@MessageBody() messageBody: any) {
    return this.devicesService.renameRaspi(messageBody);
  }

  @SubscribeMessage('raspi configuration')
  raspiConfig(
    @MessageBody() messageBody: any,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.devicesService.raspiConfig(socket, messageBody);
  }

  @SubscribeMessage('activity')
  async raspiActivity(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
  ) {
    switch (body.sensorType) {
      case 'stove':
        await this.devicesService.stoveActivity(socket, body);
        break;
      case 'fireAlarm':
        await this.devicesService.fireAlarmActivity(socket, body);
        break;
      case 'alarm':
        await this.devicesService.alarmActivity(socket, body);
        break;
      default:
        break;
    }
    await this.devicesService.raspiActivity(socket, body);
    return;
  }
}
