import { Body, Controller, Post } from '@nestjs/common';
import { IdentifyService } from './services/identify/identify.service';
import { IdentifyDto } from './dto/identify.dto';

@Controller('identify')
export class IdentifyController {
  constructor(private readonly identifyService: IdentifyService) {}

  @Post('/')
  async identify(@Body() params: IdentifyDto) {
    const data = await this.identifyService.identify(params);

    return await this.identifyService.formatIdentifyResponse(data);
  }
}
