import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception-filter/filters/http-exception.filter';

const PORT = 3333;
async function bootstrap() {
  const app = await NestFactory.create(AppModule,  { cors: true });
  console.log('Server connect successfully .......  !!!') 
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(PORT,() => (console.log(`http://localhost:${PORT}`)));;
}
bootstrap();
