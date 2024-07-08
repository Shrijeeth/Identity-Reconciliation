import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentifyModule } from './modules/identify/identify.module';
import { IdentifyService } from './modules/identify/services/identify/identify.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import configuration from './config/configuration';
import { contactProviders } from './modules/identify/repository/contact/contact.providers';
import { ContactService } from './modules/identify/services/contact/contact.service';

@Module({
  imports: [
    IdentifyModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, IdentifyService, ...contactProviders, ContactService],
})
export class AppModule {}
