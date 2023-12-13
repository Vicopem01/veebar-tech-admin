import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { GraphQLError } from 'graphql';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 5050);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const normalizedErrors = errors.reduce((response, error) => {
          const objectName = error?.target?.constructor?.name || 'Other';
          const field = error?.property;

          if (!field) {
            return response;
          }

          if (!response[objectName]) {
            response[objectName] = {};
          }

          if (!response[objectName][error.property]) {
            response[objectName][error.property] = [];
          }

          const constraints = Object.keys(error.constraints).map(
            (constraint) => {
              let message = error.constraints[constraint].substring(
                field.length + 1,
              );
              return message.charAt(0).toUpperCase() + message.slice(1);
            },
          );

          response[objectName][error.property] = [
            ...response[objectName][error.property],
            ...constraints,
          ];

          return response;
        }, {});
        return new GraphQLError('Input Validation Error(s)', {
          extensions: {
            code: 'BAD_REQUEST',
            statusCode: HttpStatus.BAD_REQUEST,
            ...normalizedErrors,
          },
        });
      },
      forbidUnknownValues: false,
    }),
  );

  app.enableCors();
  await app.listen(port);
  const url = await app.getUrl();
  console.log(`app running on ${url}/graphql`);
}
bootstrap();
