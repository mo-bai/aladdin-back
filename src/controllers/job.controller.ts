import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, HttpStatus, ValidationPipe, HttpCode } from '@nestjs/common'
import { JobService } from '../services/job.service'
import { CreateJobDto, UpdateJobDto, JobQueryDto, BatchDeleteJobDto } from '../dto/job.dto'
import { JobStatus } from '@prisma/client'

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('create')
  async create(@Body(ValidationPipe) createJobDto: CreateJobDto) {
    return {
      code: HttpStatus.CREATED,
      message: '任务创建成功',
      data: await this.jobService.create(createJobDto),
    }
  }

  @Get('list')
  async findAll(@Query(ValidationPipe) query: JobQueryDto) {
    const result = await this.jobService.findAll(query)
    return {
      code: HttpStatus.OK,
      message: '获取任务列表成功',
      ...result,
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      code: HttpStatus.OK,
      message: '获取任务详情成功',
      data: await this.jobService.findOne(id),
    }
  }

  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateJobDto: UpdateJobDto) {
    return {
      code: HttpStatus.OK,
      message: '任务更新成功',
      data: await this.jobService.update(id, updateJobDto),
    }
  }

  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.jobService.remove(id)
    return {
      code: HttpStatus.OK,
      message: '任务删除成功',
    }
  }

  @Post('batch-delete')
  @HttpCode(HttpStatus.OK)
  async batchRemove(@Body(ValidationPipe) batchDeleteDto: BatchDeleteJobDto) {
    await this.jobService.batchRemove(batchDeleteDto.ids)
    return {
      code: HttpStatus.OK,
      message: '批量删除任务成功',
    }
  }

  @Post('update/status/:id')
  @HttpCode(HttpStatus.OK)
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { status: JobStatus }) {
    return {
      code: HttpStatus.OK,
      message: '任务状态更新成功',
      data: await this.jobService.updateStatus(id, body.status),
    }
  }
}
