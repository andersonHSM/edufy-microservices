import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SupportService } from 'app/support/application/support.service';
import { SupportRepository } from 'app/support/domain/support.repository';
import { KyselySupportRepository } from 'app/support/infrastructure/persistence/kysely.support.repository';
import { SupportController } from 'app/support/presentation/controllers/support.controller';
import { ConfigurationModule } from 'libs/configuration/configuration.module';
import rabbitmqConfig from 'libs/configuration/rabbitmq.config';
import { DatabaseModule } from 'libs/database/database.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule, // Use the new DatabaseModule
    ClientsModule.registerAsync([
      {
        name: 'USERS_SERVICE',
        imports: [ConfigModule],
        useFactory: (config: ConfigType<typeof rabbitmqConfig>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.url],
            queue: config.supportQueue, // Use supportQueue from config
            noAck: false,
            queueOptions: {
              durable: true,
              arguments: {
                'x-dead-letter-exchange': 'support_dlx',
                'x-dead-letter-routing-key': 'support_dlq_routing_key',
              },
            },
          },
        }),
        inject: [rabbitmqConfig.KEY],
      },
    ]),
  ],
  controllers: [SupportController],
  providers: [
    SupportService,
    {
      provide: SupportRepository,
      useClass: KyselySupportRepository,
    },
  ],
})
export class AppModule {}
