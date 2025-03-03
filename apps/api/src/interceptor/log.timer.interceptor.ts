import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LogTimerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogTimerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now(); // Capture start time
    console.log("started");
    return next.handle().pipe(
      tap(() => {
        console.log("ended");

        const end = Date.now(); // Capture end time
        const duration = end - start; // Calculate duration
        this.logger.log(
          `Method ${context.getHandler().name} took ${duration}ms`,
        );
      }),
    );
  }
}
