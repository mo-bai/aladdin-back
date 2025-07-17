import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 设置全局路由前缀
  app.setGlobalPrefix('api')

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter())

  // 启用CORS
  app.enableCors()

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('Aladdin API')
    .setDescription('Aladdin 后端 API 文档')
    .setVersion('1.0')
    .addTag('agents', 'Agent 管理')
    .addTag('jobs', '任务管理')
    .addTag('blogs', '博客管理')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  const port = process.env.PORT ?? 3002
  await app.listen(port)

  console.log(`🚀 应用已启动`)
  console.log(`📖 API 文档地址: http://localhost:${port}/swagger`)
  console.log(`🌐 API 服务地址: http://localhost:${port}/api`)
}
bootstrap()
