import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { CreateAgentCategoryDto, UpdateAgentCategoryDto, AgentCategoryQueryDto } from '../dto/agent-category.dto'
import { agentCategories, Prisma } from '@prisma/client'

@Injectable()
export class AgentCategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createAgentCategoryDto: CreateAgentCategoryDto): Promise<agentCategories> {
    try {
      const category = await this.databaseService.client.agentCategories.create({
        data: createAgentCategoryDto,
      })
      return category
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('分类名称已存在')
        }
      }
      throw error
    }
  }

  async findAll(query: AgentCategoryQueryDto) {
    const { page = 1, limit = 10, search } = query
    const skip = (page - 1) * limit

    const where: Prisma.agentCategoriesWhereInput = {
      isDeleted: false,
      ...(search && {
        OR: [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }],
      }),
    }

    const [categories, total] = await Promise.all([
      this.databaseService.client.agentCategories.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.databaseService.client.agentCategories.count({ where }),
    ])

    return {
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: number): Promise<agentCategories> {
    const category = await this.databaseService.client.agentCategories.findFirst({
      where: { id, isDeleted: false },
    })

    if (!category) {
      throw new NotFoundException(`Agent Category with ID ${id} not found`)
    }

    return category
  }

  async update(id: number, updateAgentCategoryDto: UpdateAgentCategoryDto): Promise<agentCategories> {
    await this.findOne(id) // 检查是否存在

    const updatedCategory = await this.databaseService.client.agentCategories.update({
      where: { id },
      data: {
        ...updateAgentCategoryDto,
        updatedAt: new Date(),
      },
    })

    return updatedCategory
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id) // 检查是否存在

    await this.databaseService.client.agentCategories.update({
      where: { id },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    })
  }

  async batchRemove(ids: number[]): Promise<void> {
    // 检查所有ID是否存在
    const categories = await this.databaseService.client.agentCategories.findMany({
      where: {
        id: { in: ids },
        isDeleted: false,
      },
    })

    if (categories.length !== ids.length) {
      const foundIds = categories.map(category => category.id)
      const missingIds = ids.filter(id => !foundIds.includes(id))
      throw new NotFoundException(`以下ID的分类不存在: ${missingIds.join(', ')}`)
    }

    // 批量软删除
    await this.databaseService.client.agentCategories.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    })
  }
}
