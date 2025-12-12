import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'src/app/users/users.constants';
import { UsersModule } from 'src/app/users/users.module';
import { ConfigurationModule } from 'src/libs/configuration/configuration.module';
import rabbitmqConfig from 'src/libs/configuration/rabbitmq.config';
import { DatabaseModule } from 'src/libs/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigurationModule,
    UsersModule,
    DatabaseModule,
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: AUTH_SERVICE,
          useFactory: (config: ConfigType<typeof rabbitmqConfig>) => ({
            transport: Transport.RMQ,
            options: {
              urls: [config.url],
              queue: config.authQueue,
              queueOptions: {
                durable: true,
                arguments: {
                  'x-dead-letter-exchange': 'auth_dlx',
                  'x-dead-letter-routing-key': 'auth_dlq_routing_key',
                },
              },
            },
          }),
          inject: [rabbitmqConfig.KEY],
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
