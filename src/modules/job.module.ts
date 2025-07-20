import { Module } from '@nestjs/common'
import { JobService } from '../services/job.service'
import { JobController } from '../controllers/job.controller'
import { DistributeService } from 'src/services/distribute.service'

@Module({
  controllers: [JobController],
  providers: [JobService, DistributeService],
  exports: [JobService],
})
export class JobModule {}
