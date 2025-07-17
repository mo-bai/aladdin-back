import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, HttpStatus, ValidationPipe, HttpCode } from '@nestjs/common'
import { AgentCategoryService } from '../services/agent-category.service'
import { CreateAgentCategoryDto, UpdateAgentCategoryDto, AgentCategoryQueryDto, BatchDeleteAgentCategoryDto } from '../dto/agent-category.dto'

@Controller('agent-category')
export class AgentCategoryController {
  constructor(private readonly agentCategoryService: AgentCategoryService) {}

  @Post('create')
  async create(@Body(ValidationPipe) createAgentCategoryDto: CreateAgentCategoryDto) {
    return {
      code: HttpStatus.CREATED,
      message: 'Agent分类创建成功',
      data: await this.agentCategoryService.create(createAgentCategoryDto),
    }
  }

  @Get('list')
  async findAll(@Query(ValidationPipe) query: AgentCategoryQueryDto) {
    const result = await this.agentCategoryService.findAll(query)
    return {
      code: HttpStatus.OK,
      message: '获取Agent分类列表成功',
      ...result,
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      code: HttpStatus.OK,
      message: '获取Agent分类详情成功',
      data: await this.agentCategoryService.findOne(id),
    }
  }

  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateAgentCategoryDto: UpdateAgentCategoryDto) {
    return {
      code: HttpStatus.OK,
      message: 'Agent分类更新成功',
      data: await this.agentCategoryService.update(id, updateAgentCategoryDto),
    }
  }

  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.agentCategoryService.remove(id)
    return {
      code: HttpStatus.OK,
      message: 'Agent分类删除成功',
    }
  }

  @Post('batch-delete')
  @HttpCode(HttpStatus.OK)
  async batchRemove(@Body(ValidationPipe) batchDeleteDto: BatchDeleteAgentCategoryDto) {
    await this.agentCategoryService.batchRemove(batchDeleteDto.ids)
    return {
      code: HttpStatus.OK,
      message: '批量删除Agent分类成功',
    }
  }
}
