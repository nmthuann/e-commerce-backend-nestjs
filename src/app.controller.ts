import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from './common/decorators/public.decorator'

@ApiTags('Health')
@Controller('health')
export class AppController {
  @Public()
  @Get()
  check() {
    return { status: 'ok', uptime: Math.round(process.uptime()) }
  }
}
