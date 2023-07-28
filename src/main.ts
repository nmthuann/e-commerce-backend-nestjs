import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,  { cors: true });
  console.log('Post Server connect successfully .......  !!!') 
  await app.listen(3000,() => (console.log('http://localhost:3000')));;
}
bootstrap();
