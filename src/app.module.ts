import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DevicesModule } from './devices/devices.module';
import { Raspi, RaspiSchema } from './schemas/raspi.schema';
import MessagesModule from './messages/messages.module';
import SocketModule from './socket/socket.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Add this line
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    // applying the schema-first approach
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: true, // remove from prod
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: Raspi.name, schema: RaspiSchema }]),

    UsersModule,
    AuthModule,
    MessagesModule,
    SocketModule,
    DevicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
