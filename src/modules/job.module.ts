import { Module } from '@nestjs/common'
import { JobService } from '../services/job.service'
import { JobController } from '../controllers/job.controller'
import { DistributeModule } from './distribute.module'
import { DatabaseModule } from './database.module'

@Module({
  imports: [DistributeModule, DatabaseModule],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
