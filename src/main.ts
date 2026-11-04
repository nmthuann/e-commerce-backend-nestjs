import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvironmentVariables } from './config/env.validation'
import { setupSwagger, SWAGGER_PATH } from './config/swagger.config'

async function bootstrap() {
  // rawBody: cần cho việc verify chữ ký webhook Stripe (P5.4)
  const app = await NestFactory.create(AppModule, { rawBody: true })
  const config = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService)

  app.enableCors({ origin: config.get('PUBLIC_API_FRONTEND_URL', { infer: true }), credentials: true })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các field không có trong DTO
      forbidNonWhitelisted: true, // Chặn field không hợp lệ
      transform: true // Tự động chuyển đổi kiểu dữ liệu
    })
  )
  app.enableShutdownHooks()
  setupSwagger(app)

  const port = config.get('NESTJS_SERVER_PORT', { infer: true })
  await app.listen(port)

  const logger = new Logger('Bootstrap')
  logger.log(`Server: http://localhost:${port}`)
  logger.log(`Swagger: http://localhost:${port}/${SWAGGER_PATH}`)
}
bootstrap()
