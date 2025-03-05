import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const PORT = 3333
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  console.log('Server connect successfully .......  !!!')
  await app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
}
bootstrap()
