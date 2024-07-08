import { Module } from '@nestjs/common';
import { IdentifyController } from './identify.controller';
import { contactProviders } from './repository/contact/contact.providers';
import { IdentifyService } from './services/identify/identify.service';
import { DatabaseModule } from 'src/database/database.module';
import { ContactService } from './services/contact/contact.service';

@Module({
  imports: [DatabaseModule],
  controllers: [IdentifyController],
  providers: [IdentifyService, ...contactProviders, ContactService],
})
export class IdentifyModule {}
