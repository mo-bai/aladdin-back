import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, HttpStatus, ValidationPipe, HttpCode } from '@nestjs/common'
import { AgentService } from '../services/agent.service'
import { CreateAgentDto, UpdateAgentDto, AgentQueryDto, BatchDeleteAgentDto } from '../dto/agent.dto'

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('create')
  async create(@Body(ValidationPipe) createAgentDto: CreateAgentDto) {
    return {
      code: HttpStatus.CREATED,
      message: 'Agent创建成功',
      data: await this.agentService.create(createAgentDto),
    }
  }

  @Get('list')
  async findAll(@Query(ValidationPipe) query: AgentQueryDto) {
    const result = await this.agentService.findAll(query)
    return {
      code: HttpStatus.OK,
      message: '获取Agent列表成功',
      ...result,
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      code: HttpStatus.OK,
      message: '获取Agent详情成功',
      data: await this.agentService.findOne(id),
    }
  }

  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateAgentDto: UpdateAgentDto) {
    return {
      code: HttpStatus.OK,
      message: 'Agent更新成功',
      data: await this.agentService.update(id, updateAgentDto),
    }
  }

  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.agentService.remove(id)
    return {
      code: HttpStatus.OK,
      message: 'Agent删除成功',
    }
  }

  @Post('batch-delete')
  @HttpCode(HttpStatus.OK)
  async batchRemove(@Body(ValidationPipe) batchDeleteDto: BatchDeleteAgentDto) {
    await this.agentService.batchRemove(batchDeleteDto.ids)
    return {
      code: HttpStatus.OK,
      message: '批量删除Agent成功',
    }
  }

  @Post('update/reputation/:id')
  @HttpCode(HttpStatus.OK)
  async updateReputation(@Param('id', ParseIntPipe) id: number, @Body() body: { reputation: number; successRate: number }) {
    return {
      code: HttpStatus.OK,
      message: '信誉更新成功',
      data: await this.agentService.updateReputation(id, body.reputation, body.successRate),
    }
  }
}
