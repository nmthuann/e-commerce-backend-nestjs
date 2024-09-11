import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3333;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  console.log('Server connect successfully .......  !!!');
  await app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
}
bootstrap();
