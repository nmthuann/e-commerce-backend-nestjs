import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as dotenv from 'dotenv'
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  const config = new DocumentBuilder()
    .setTitle('Phone Ecommerce NestJS')
    .setDescription('The Phone Ecommerce API description')
    .setVersion('2.0')
    .addTag('phone')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  console.log('Server connect successfully .......  !!!')
  await app.listen(process.env.NESTJS_SERVER_PORT, () =>
    console.log(`http://localhost:${process.env.NESTJS_SERVER_PORT}`)
  )
}
bootstrap()
