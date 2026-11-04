import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const SWAGGER_PATH = 'docs'

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('E-commerce Backend API')
    .setDescription(
      'API cửa hàng điện thoại, đồng hồ thông minh, laptop — quản lý tồn kho theo serial.\n\n' +
        'Bấm **Authorize** và dán access token nhận được từ `POST /auth/login`.'
    )
    .setVersion('2.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    // Áp bearer cho mọi endpoint; endpoint @Public() vẫn gọi được khi chưa Authorize
    .addSecurityRequirements('access-token')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: { persistAuthorization: true, tagsSorter: 'alpha' }
  })
}
