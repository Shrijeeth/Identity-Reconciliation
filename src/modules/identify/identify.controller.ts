import { Body, Controller, Post } from '@nestjs/common';
import { IdentifyService } from './services/identify/identify.service';
import { IdentifyRequestDto } from './dto/identify.dto';

@Controller('identify')
export class IdentifyController {
  constructor(private readonly identifyService: IdentifyService) {}

  @Post('/')
  async identify(@Body() params: IdentifyRequestDto) {
    return await this.identifyService.getIdentifyData(params);
  }
}
