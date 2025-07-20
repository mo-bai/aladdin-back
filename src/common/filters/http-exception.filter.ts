import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common'
import { Response } from 'express'

interface ValidationErrorResponse {
  message: string | string[]
  error?: string
  statusCode?: number
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    // 处理验证错误
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as ValidationErrorResponse

      // 如果是 class-validator 的验证错误
      if (typeof exceptionResponse === 'object' && exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
        const errorResponse = {
          code: status,
          message: '数据验证失败',
          errors: exceptionResponse.message,
          timestamp: new Date().toISOString(),
        }
        return response.status(status).json(errorResponse)
      }
    }

    const errorResponse = {
      code: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    }

    response.status(status).json(errorResponse)
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    // 处理验证错误
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as ValidationErrorResponse

      if (typeof exceptionResponse === 'object' && exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
        const errorResponse = {
          code: status,
          message: '数据验证失败',
          errors: exceptionResponse.message,
          timestamp: new Date().toISOString(),
        }
        return response.status(status).json(errorResponse)
      }
    }

    const message = exception instanceof HttpException ? exception.message : '服务器内部错误'

    const errorResponse = {
      code: status,
      message,
      timestamp: new Date().toISOString(),
    }

    response.status(status).json(errorResponse)
  }
}
