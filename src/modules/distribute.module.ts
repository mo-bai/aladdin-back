import { Module } from '@nestjs/common'
import { DistributeController } from '../controllers/distribute.controller'
import { DistributeService } from '../services/distribute.service'
import { DatabaseModule } from './database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [DistributeController],
  providers: [DistributeService],
  exports: [DistributeService],
})
export class DistributeModule {}
