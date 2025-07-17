import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { CreateAgentDto, UpdateAgentDto, AgentQueryDto } from '../dto/agent.dto'
import { agents, Prisma } from '@prisma/client'

@Injectable()
export class AgentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createAgentDto: CreateAgentDto): Promise<agents> {
    try {
      const agent = await this.databaseService.client.agents.create({
        data: {
          ...createAgentDto,
          totalJobsCompleted: 0,
        },
      })
      return agent
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Agent已存在')
        }
      }
      throw error
    }
  }

  async findAll(query: AgentQueryDto) {
    const { page = 1, limit = 10, search, agentType, agentPayType, agentCategory, isActive, isPrivate, autoAcceptJobs } = query
    const skip = (page - 1) * limit

    const where: Prisma.agentsWhereInput = {
      isDeleted: false,
      ...(search && {
        OR: [
          { agentName: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { agentClassification: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(agentType && { agentType }),
      ...(agentPayType && { agentPayType }),
      ...(agentCategory && { agentCategory }),
      ...(isActive !== undefined && { isActive }),
      ...(isPrivate !== undefined && { isPrivate }),
      ...(autoAcceptJobs !== undefined && { autoAcceptJobs }),
    }

    const [agents, total] = await Promise.all([
      this.databaseService.client.agents.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.databaseService.client.agents.count({ where }),
    ])

    return {
      data: agents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: number): Promise<agents> {
    const agent = await this.databaseService.client.agents.findFirst({
      where: { id, isDeleted: false },
      include: {
        jobDistributionAgents: {
          include: {
            jobDistribution: true,
          },
        },
      },
    })

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`)
    }

    return agent
  }

  async update(id: number, updateAgentDto: UpdateAgentDto): Promise<agents> {
    await this.findOne(id) // 检查是否存在

    const updatedAgent = await this.databaseService.client.agents.update({
      where: { id },
      data: {
        ...updateAgentDto,
        updatedAt: new Date(),
      },
    })

    return updatedAgent
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id) // 检查是否存在

    await this.databaseService.client.agents.update({
      where: { id },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    })
  }

  async batchRemove(ids: number[]): Promise<void> {
    // 检查所有ID是否存在
    const agents = await this.databaseService.client.agents.findMany({
      where: {
        id: { in: ids },
        isDeleted: false,
      },
    })

    if (agents.length !== ids.length) {
      const foundIds = agents.map(agent => agent.id)
      const missingIds = ids.filter(id => !foundIds.includes(id))
      throw new NotFoundException(`以下ID的Agent不存在: ${missingIds.join(', ')}`)
    }

    // 批量软删除
    await this.databaseService.client.agents.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    })
  }

  async updateReputation(id: number, reputation: number, successRate: number): Promise<agents> {
    await this.findOne(id) // 检查是否存在

    return this.databaseService.client.agents.update({
      where: { id },
      data: {
        reputation,
        successRate,
        totalJobsCompleted: { increment: 1 },
        updatedAt: new Date(),
      },
    })
  }
}
