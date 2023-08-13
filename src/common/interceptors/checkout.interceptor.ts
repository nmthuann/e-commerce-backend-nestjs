import { ExecutionContext, Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// };


@Injectable()
export class CorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    
    // Thêm các header CORS tại đây nếu cần
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    return next.handle().pipe(
      map((data) => {
        // Xử lý dữ liệu trước khi trả về
               if (data ) {
          const processedData = {
            url: data,
            headers: {
              // Thêm các header khác tùy theo yêu cầu của bạn
              // corsHeaders
             'Access-Control-Allow-Origin': '*',
            },
          };
          console.log("processedData", processedData)
          return processedData;
        }
        console.log("Data", data)
        return data;
      }),
    );
  }
}
