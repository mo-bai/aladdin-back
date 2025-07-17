import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter'

export class TestSetup {
  static app: INestApplication | undefined

  static async createTestApp(): Promise<INestApplication> {
    if (!this.app) {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile()

      this.app = moduleFixture.createNestApplication()

      // 设置全局前缀和管道
      this.app.setGlobalPrefix('api')
      this.app.useGlobalPipes(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
        })
      )
      this.app.useGlobalFilters(new AllExceptionsFilter())

      await this.app.init()
    }

    return this.app
  }

  static async closeTestApp(): Promise<void> {
    if (this.app) {
      await this.app.close()
      this.app = undefined
    }
  }
}
