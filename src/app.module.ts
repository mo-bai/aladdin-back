import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './modules/database.module'
import { AgentModule } from './modules/agent.module'
import { JobModule } from './modules/job.module'
import { BlogModule } from './modules/blog.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使配置在整个应用中全局可用
      envFilePath: '.env', // 指定环境变量文件路径
    }),
    DatabaseModule, // 数据库模块，提供全局DatabaseService
    AgentModule,
    JobModule,
    BlogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
