import { Injectable, BadRequestException } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { Prisma } from '@prisma/client'
import { AgentStatus, JobStatus } from 'src/constants'
import { AgentPayType } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'

type AgentResponse = {
  success: boolean
  data: {
    type: 'text'
    result: string
  }
}

@Injectable()
export class DistributeService {
  private queue: Job[]
  constructor(private readonly databaseService: DatabaseService) {}

  async init() {
    this.queue = []
    try {
      console.log('查询jobs')
      const jobs = await this.databaseService.client.jobs.findMany({
        where: {
          status: JobStatus.OPEN,
        },
      })
      console.log(`初始化任务数${jobs.length}`)
      this.queue = [...jobs] as Job[]
    } catch (error) {
      console.log('error', error)
    }
  }

  async create(id: number) {
    try {
      const job = await this.databaseService.client.jobs.findUnique({
        where: {
          id,
        },
      })
      if (job && job.status === JobStatus.OPEN) {
        console.log(`${job.jobTitle}任务入队`)
        // 任务入队列
        this.queue.push(job as Job)
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Agent已存在')
        }
      }
      throw error
    }
  }

  // todo:根据优先级 + 模式安排队列顺序
  // sort(job: Job) {}

  // todo:分配任务
  async distribute(job: Job) {
    console.log(`开始给${job.jobTitle}分配agent`)
    // 1. 先找符合要求的 agents，标签 or 向量匹配 or 机器学习
    let agentPayType: AgentPayType = AgentPayType.FREE
    if (job.paymentType === 'PAY_PER_TASK') {
      agentPayType = AgentPayType.PAY_PER_TASK
    }
    const agents = await this.databaseService.client.agents.findMany({
      where: {
        agentCategory: job.category,
        agentPayType: agentPayType,
      },
    })
    if (!agents) {
      console.log(`没有符合要求的agent`)
      return
    }
    console.log(`找到${agents.length}个符合要求的agent`)
    const allowBidding = job.allowBidding
    if (allowBidding) {
      console.log('job 是绑定一个agent 模式')
      // 2. 再使用洗牌算法，根据权重：评分分配agent的数值范围
      const agent = agents[Math.floor(Math.random() * agents.length)]
      console.log(`分配给${agent.agentName}`)
      // 3. 分配agent，入库

      await this.execute(job, [agent] as Agent[])
    } else {
      console.log('job 是竞标模式')
      await this.execute(job, agents as Agent[])
    }
  }

  // 执行任务
  async execute(job: Job, agents: Agent[]) {
    // 先判断是否已经分配
    const distributeRecord = await this.databaseService.client.jobDistributionRecords.findFirst({
      where: {
        jobId: job.id,
      },
    })
    if (distributeRecord) {
      console.log(`任务${job.jobTitle}已分配`)
      const distributeInstances = await this.databaseService.client.jobDistributionAgents.findMany({
        where: {
          jobDistributionId: distributeRecord.id,
        },
      })
      if (distributeInstances.length > 0) {
        for (const instance of distributeInstances) {
          await this.judgeResult(instance.id)
        }
      }
      return
    }
    // 1. 调用agent，传入job的任务描述和结果要求
    console.log('创建一个分配记录')
    const record = await this.databaseService.client.jobDistributionRecords.create({
      data: {
        jobId: job.id,
        jobName: job.jobTitle,
        matchCriteria: {
          category: job.category,
          skillLevel: job.skillLevel,
        },
        totalAgents: agents.length,
        assignedCount: 0,
        responseCount: 0,
        assignedAgentId: null,
        assignedAgentName: null,
        createdBy: 'admin',
      },
    })
    console.log(`分配记录创建成功: ${record.id}`)
    // 2. 根据agent的返回结果，更新job的状态
    console.log(`需要创建${agents.length}个agent分配实例`)
    const agentDistribution = await this.databaseService.client.jobDistributionAgents.createManyAndReturn({
      data: agents.map(agent => ({
        jobDistributionId: record.id,
        agentId: agent.id,
        agentStatus: AgentStatus.READY,
      })),
    })
    console.log(`创建agent分配实例成功: ${agentDistribution.length}`)
    if (agentDistribution.length > 0) {
      for (const record of agentDistribution) {
        void this.judgeResult(record.id)
      }
    }
  }

  // 调用合约
  async callContract(
    job: Job,
    agent: Agent
  ): Promise<{
    result: 'completed' | 'failed' | 'timeout'
    data?: {
      type: 'text'
      result: string
    }
  }> {
    const query = job.description
    const url = agent.agentAddress
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('请求超时')), 180000))
      const fetchPromise = axios.post(
        url,
        {
          type: 'text',
          query,
        },
        {
          timeout: 180000,
        }
      )
      const response = (await Promise.race([fetchPromise, timeoutPromise])) as AxiosResponse<AgentResponse>
      const data = response.data
      if (!data.success) {
        return {
          result: 'failed',
        }
      }
      return {
        result: 'completed',
        data: data.data,
      }
    } catch (error) {
      if (error instanceof Error && error.message === '请求超时') {
        console.log(`agent调用合约超时: ${url}`)
        return {
          result: 'timeout',
        }
      }
      console.log(`agent调用合约失败: ${error}`)
      return {
        result: 'failed',
      }
    }
  }

  async judgeResult(distributeInstanceId: number) {
    // 1. 获取指定的匹配关系
    const distributeInstance = await this.databaseService.client.jobDistributionAgents.findUnique({
      where: {
        id: distributeInstanceId,
      },
    })
    if (!distributeInstance) {
      console.log(`分配实例不存在: ${distributeInstanceId}`)
      return
    }
    const agent = await this.databaseService.client.agents.findUnique({
      where: {
        id: distributeInstance.agentId,
      },
    })
    if (!agent) {
      console.log(`agent不存在: ${distributeInstance.agentId}`)
      return
    }
    const distributeRecord = await this.databaseService.client.jobDistributionRecords.findUnique({
      where: {
        id: distributeInstance.jobDistributionId,
      },
    })
    if (!distributeRecord) {
      console.log(`分配记录不存在: ${distributeInstance.jobDistributionId}`)
      return
    }
    const job = await this.databaseService.client.jobs.findUnique({
      where: {
        id: distributeRecord.jobId,
      },
    })
    if (!job) {
      console.log(`job不存在: ${distributeRecord.jobId}`)
      return
    }
    // 修改分配实例的状态
    await this.databaseService.client.jobDistributionAgents.update({
      where: {
        id: distributeInstanceId,
      },
      data: {
        agentStatus: AgentStatus.DOING,
      },
    })
    console.log(`任务${job.jobTitle}调用代理: ${agent.agentName}`)
    const response = await this.callContract(job as Job, agent as Agent)
    console.log(`任务执行结果: ${response.result}`)
    if (response.result == 'timeout') {
      await this.databaseService.client.jobDistributionAgents.update({
        where: {
          id: distributeInstanceId,
        },
        data: {
          agentStatus: AgentStatus.TIMEOUT,
        },
      })
      return
    }
    if (response.result == 'failed') {
      await this.databaseService.client.jobDistributionAgents.update({
        where: {
          id: distributeInstanceId,
        },
        data: {
          agentStatus: AgentStatus.ERROR,
        },
      })
      return
    }
    if (response.result == 'completed') {
      await this.databaseService.client.jobDistributionAgents.update({
        where: {
          id: distributeInstanceId,
        },
        data: {
          agentStatus: AgentStatus.COMPLETED,
          result: response.data?.result,
        },
      })
      await this.databaseService.client.jobs.update({
        where: {
          id: distributeRecord.jobId,
        },
        data: {
          status: JobStatus.COMPLETED,
        },
      })
    }
  }

  begin() {
    console.log('当前任务数', this.queue.length)
    while (this.queue.length > 0) {
      const job = this.queue.shift()
      if (job) {
        void this.distribute(job)
      }
    }
  }
}
