import { Controller, Post, Param, ParseIntPipe, ValidationPipe, Body, Get, HttpStatus } from '@nestjs/common'
import { DistributeService } from '../services/distribute.service'

@Controller('distribute')
export class DistributeController {
  constructor(private readonly distributeService: DistributeService) {}

  @Post('create/job/:id')
  async create(@Param('id', ParseIntPipe) id: string) {
    // 任务入队列
    await this.distributeService.create(Number(id))
  }
  @Get('begin')
  begin() {
    this.distributeService.begin()
    return {
      code: HttpStatus.OK,
      message: '开始分配任务',
    }
  }
}
