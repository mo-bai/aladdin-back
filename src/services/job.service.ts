import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { CreateJobDto, UpdateJobDto, JobQueryDto } from '../dto/job.dto'
import { jobs, Prisma, JobStatus } from '@prisma/client'
import { DistributeService } from './distribute.service'

@Injectable()
export class JobService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly distributeService: DistributeService
  ) {}

  async create(createJobDto: CreateJobDto): Promise<jobs> {
    try {
      const job = await this.databaseService.client.jobs.create({
        data: {
          ...createJobDto,
          createdBy: createJobDto.createdBy || 'admin',
          deadline: new Date(createJobDto.deadline),
          status: JobStatus.OPEN,
        },
      })
      // todo:创建任务后，加入任务队列
      void this.distributeService.create(job.id)
      return job
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('创建任务失败')
      }
      throw error
    }
  }

  async findAll(query: JobQueryDto) {
    const { page = 1, limit = 10, search, category, paymentType, priority, skillLevel, status, isPublic, autoAssign } = query
    const skip = (page - 1) * limit

    const where: Prisma.jobsWhereInput = {
      isDeleted: false,
      ...(search && {
        OR: [{ jobTitle: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }],
      }),
      ...(category && { category }),
      ...(paymentType && { paymentType }),
      ...(priority && { priority }),
      ...(skillLevel && { skillLevel }),
      ...(status && { status }),
      ...(isPublic !== undefined && { isPublic }),
      ...(autoAssign !== undefined && { autoAssign }),
    }

    const [jobs, total] = await Promise.all([
      this.databaseService.client.jobs.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.databaseService.client.jobs.count({ where }),
    ])

    return {
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: number): Promise<jobs> {
    const job = await this.databaseService.client.jobs.findFirst({
      where: { id, isDeleted: false },
    })

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`)
    }

    return job
  }

  async update(id: number, updateJobDto: UpdateJobDto): Promise<jobs> {
    await this.findOne(id) // 检查是否存在

    const updateData: Prisma.jobsUpdateInput = {
      ...updateJobDto,
      updatedAt: new Date(),
    }

    if (updateJobDto.deadline) {
      updateData.deadline = new Date(updateJobDto.deadline)
    }

    const updatedJob = await this.databaseService.client.jobs.update({
      where: { id },
      data: updateData,
    })

    return updatedJob
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id) // 检查是否存在

    await this.databaseService.client.jobs.update({
      where: { id },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    })
  }

  async batchRemove(ids: number[]): Promise<void> {
    // 检查所有ID是否存在
    const jobs = await this.databaseService.client.jobs.findMany({
      where: {
        id: { in: ids },
        isDeleted: false,
      },
    })

    if (jobs.length !== ids.length) {
      const foundIds = jobs.map(job => job.id)
      const missingIds = ids.filter(id => !foundIds.includes(id))
      throw new NotFoundException(`以下ID的任务不存在: ${missingIds.join(', ')}`)
    }

    // 批量软删除
    await this.databaseService.client.jobs.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    })
  }

  async updateStatus(id: number, status: JobStatus): Promise<jobs> {
    await this.findOne(id) // 检查是否存在

    return this.databaseService.client.jobs.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    })
  }

  async findDistribute(id: number) {
    const job = await this.findOne(id)
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`)
    }
    const record = await this.databaseService.client.jobDistributionRecords.findFirst({
      where: { jobId: id }, // 或者 where: { id: recordId }
      include: {
        jobDistributionAgents: {
          include: {
            agent: true, // 这里 agent 是 jobDistributionAgents 里的外键关联
          },
        },
      },
    })
    return {
      record,
      job,
    }
  }
  async judgeResult(id: number, agentId: number, agentName: string) {
    const job = await this.findOne(id)
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`)
    }
    console.log('锁定获取任务奖励的 agent')
    const record = await this.databaseService.client.jobDistributionRecords.findFirst({
      where: {
        jobId: id,
      },
    })
    if (!record) {
      console.log('分配记录不存在')
      return
    }
    await this.databaseService.client.jobDistributionRecords.update({
      where: {
        id: record.id,
      },
      data: {
        assignedAgentId: agentId,
        assignedAgentName: agentName,
      },
    })
    console.log('分配记录更新成功')
  }
}
