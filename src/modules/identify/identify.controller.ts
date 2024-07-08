import { Controller, Post } from '@nestjs/common';
import { IdentifyService } from './services/identify/identify.service';

@Controller('identify')
export class IdentifyController {
  constructor(private readonly identifyService: IdentifyService) {}

  @Post('/')
  async identify() {}
}
