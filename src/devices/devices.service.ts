import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Raspi } from 'src/schemas/raspi.schema';
import { User } from 'src/schemas/user.schema';
import { Socket } from 'socket.io';
import { AddNewDeviceInput } from './devices.input-types';
import { TimeTrigger } from 'src/schemas/timeTrigger.schema';
import moment from 'moment';
import * as Twilio from 'twilio';
import { ConfigService } from '@nestjs/config';
import { Status } from 'src/schemas/status.schema';

@Injectable()
export class DevicesService implements OnModuleInit {
  private readonly twilioClient: Twilio.Twilio;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Raspi.name) private readonly raspiModel: Model<Raspi>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(TimeTrigger.name)
    private readonly timeTriggerModel: Model<TimeTrigger>,
    @InjectModel(Status.name) private readonly statusModel: Model<Status>,
  ) {
    this.twilioClient = Twilio(
      this.configService.get('TWILIO_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async onModuleInit() {
    const checkTimeTriggers = async () => {
      await this.timeTriggerModel
        .find({
          time: {
            $lte: moment().add(20, 'seconds'),
            $gte: moment().subtract(20, 'seconds'),
          },
        })
        .then((triggers) => {
          for (let i = 0; i < triggers.length; i++) {
            let trigger = triggers[i];

            (async () =>
              await this.raspiModel.findById(trigger.raspi._id).then((val) => {
                let delayTime =
                  val.configuration[
                    trigger.sensorType + trigger.sensorID + 'triggerdelay'
                  ] || 15 * 60;
                console.log(delayTime);
                trigger.time = moment(trigger.time)
                  .add(delayTime, 'seconds')
                  .toDate();
                trigger.save();
              }))();

            if (trigger.sensorType === 'stove') {
              this.userModel.find(
                { raspis: { $in: [trigger.raspi] } },
                (err2, user) => {
                  for (let j = 0; j < user.length; j++) {
                    if (user[j].phone) {
                      this.twilioClient.messages
                        .create({
                          body: 'Stove ' + trigger.sensorID + ' is on.',
                          from: '+16479558302',
                          to: user[j].phone,
                        })
                        .then((message) => console.log(message))
                        .catch((reason) => {
                          console.log(reason);
                          console.log('for phone ' + user[j].phone);
                        });
                    }
                  }
                },
              );
            }
          }
        });

      checkTimeTriggers();
      setInterval(checkTimeTriggers, 20000);
    };
  }

  async addNewDevice(addNewDeviceInput: AddNewDeviceInput) {
    console.log(addNewDeviceInput);

    return '';
  }

  async newDeviceConnection(socket: Socket) {
    const { query, auth } = socket.handshake;
    // if (query && query['authType'] && query['secret']) {
    if (query['authType'] === 'raspi') {
      await this.raspiModel.findOne(
        { communicationSecret: query['secret'] },
        (err: any, obj: unknown) => {
          if (err || !obj) {
            socket.emit('unauthorized');
            socket.disconnect();
            return;
          }
          socket['raspi'] = obj;
          socket['connectionType'] = 'raspi';
          socket.emit('authenticated');
          return;
        },
      );
    }
    if (auth['authType'] === 'session') {
      if (!auth.userId) return;
      const user = await this.userModel.findById(auth.userId);
      if (!user) return;
      socket['user'] = user;
      socket['raspis'] = user.raspis;
      socket['connectionType'] = 'session';
      socket.emit('authenticated');
      return;
    }
    socket.emit('unauthorized');
    socket.disconnect();
    return;
  }

  async getRaspis(socket: Socket) {
    const values = await this.raspiModel
      .find({ userId: socket['user']._id })
      .exec();
    socket.emit('raspis', values);
  }

  async getRaspi(socket: Socket, raspiId: string) {
    const value = await this.raspiModel.findById(raspiId).exec();
    socket.emit('raspi:' + raspiId, value);
  }

  async newRaspi(socket: Socket, value: any) {
    await this.raspiModel.findOne(value, async (err, raspi) => {
      if (!raspi) {
        socket.emit('new raspi result', { result: 'not found' });
      } else {
        if (socket['user'].raspis.includes(raspi._id)) {
          socket.emit('new raspi result', { result: 'already paired' });
        } else {
          await this.userModel.findOne(socket['user']._id, async (err, u) => {
            u.raspis.push(raspi._id);
            await u.save();
            socket.emit('new raspi result', { result: 'added' });
            socket['user'] = u;
          });
        }
      }
    });
  }

  async changeRaspiIcon(socket: Socket, value: any) {
    await this.raspiModel.findById(value.id, async (err, theRaspi) => {
      theRaspi.icon = value.newIcon;
      await theRaspi.save();
      socket.emit('raspi icon changed', {
        id: value.id,
        icon: value.newIcon,
      });
    });
  }

  async renameSensor(socket: Socket, value: any) {
    await this.statusModel.findById(value.id, async (err, theSensor) => {
      theSensor.knownName = value.newName;
      await theSensor.save();
      socket.emit('sensor renamed');
    });
  }

  async renameRaspi(value: any) {
    await this.raspiModel.findById(value.id, async (err, theRaspi) => {
      theRaspi.knownName = value.newName;
      await theRaspi.save();
    });
  }

  async raspiConfig(socket: Socket, value: any) {
    await this.raspiModel.findById(value.raspi._id, async (err, theRaspi) => {
      theRaspi.configuration = value.configuration;
      await theRaspi.save();
      socket.emit('raspi configuration saved');
    });
  }
}
