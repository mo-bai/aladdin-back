import { Global, Module } from '@nestjs/common'
import { DatabaseService } from '../services/database.service'

@Global() // 使DatabaseService在整个应用中全局可用
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
