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
import { UserMessageBodyDto } from './messages.dto';
import { instrument } from '@socket.io/admin-ui';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: [
      'https://admin.socket.io',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    credentials: true,
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private clients: Map<string, Socket> = new Map(); // save connected clients
  private reverseClients: Map<string, string> = new Map(); //save connected clients ids
  constructor(private readonly messagesService: MessagesService) {}
  @WebSocketServer() private server: Server;

  afterInit() {
    instrument(this.server, {
      mode: 'production',
      auth: false,
    });
  }

  handleConnection(client: Socket) {
    const auth = client.handshake.auth;
    console.log(auth);
    if (auth.userId) {
      this.clients.set(auth.userId, client);
      this.reverseClients.set(client.id, auth.userId);
    }
  }

  handleDisconnect(client: Socket) {
    const userId: string = this.reverseClients.get(client.id);
    if (userId) {
      this.reverseClients.delete(client.id);
      this.clients.delete(userId);
    }
  }

  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() message: string) {
    console.log(message);
    this.server.sockets.emit('recieve_message', message);
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() message: string) {
    console.log(message);
  }

  @SubscribeMessage('admin_message')
  async handleAdminMessage(
    @MessageBody() messageBody: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const { userId, message }: UserMessageBodyDto = messageBody;

    // const userData = await this.firebaseService.getUserData(userId);
    // const timeStamp = Date.now();
    // const messageData: FirebaseMessageDto = {
    //   sender: 'admin',
    //   message,
    //   timeStamp,
    // };

    // const senderData: FirebaseUserNewMessageDto = {
    //   userId,
    //   timeStamp,
    //   firstName: userData.firstName,
    //   lastName: userData.firstName,
    //   picture: userData.picture,
    //   lastSentMessage: message,
    //   readByUser: false, //change to true when opened by user
    // };

    // await this.firebaseService.saveUserMessage(userId, senderData, messageData);
    const userSocket = this.clients.get(userId);
    // if (userSocket) userSocket.emit('new_message', messageData);
    socket.emit('new_user_message', '');
  }

  @SubscribeMessage('user_typing')
  handleUsertyping(@MessageBody() message: string) {
    // console.log(message);
  }

  @SubscribeMessage('user_message')
  async handleUserMessage(
    @MessageBody() messageBody: UserMessageBodyDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { userId } = messageBody;
    const messageData = {
      sender: 'user',
      content: messageBody.message,
      timestamp: Date.now(),
    };
    await this.messagesService.handleUserMessage(messageData, userId);

    // console.log(messageBody);

    socket.emit('new_message', messageData);

    // const adminSocket = this.clients.get('admin');
    // if (adminSocket) {
    //   // adminSocket.emit('new_user_message', messageData);
    // } else {
    //   console.log('Admin socket not found');
    // }
    // socket.emit('new_message', messageData);
    return;
  }
}
