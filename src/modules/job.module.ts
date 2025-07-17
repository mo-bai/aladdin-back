import { Module } from '@nestjs/common'
import { JobService } from '../services/job.service'
import { JobController } from '../controllers/job.controller'

@Module({
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
