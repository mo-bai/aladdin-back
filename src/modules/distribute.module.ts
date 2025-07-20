import { Module } from '@nestjs/common'
import { DistributeController } from '../controllers/distribute.controller'
import { DistributeService } from '../services/distribute.service'
import { DatabaseService } from 'src/services/database.service'

@Module({
  controllers: [DistributeController],
  providers: [DistributeService, DatabaseService],
  exports: [DistributeService],
})
export class DistributeModule {}
