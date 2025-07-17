import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter'
import { TestDataFactory } from './test-data-factory'

describe('Agent Types E2E', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()

    app.setGlobalPrefix('api')
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    )
    app.useGlobalFilters(new AllExceptionsFilter())

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('免费 Agent (FREE)', () => {
    let freeAgentId: number

    it('应该成功创建免费 Agent', async () => {
      const freeAgentData = TestDataFactory.createFreeAgent()

      const response = await request(app.getHttpServer()).post('/api/agent/create').send(freeAgentData).expect(201)

      expect(response.body?.code).toBe(201)
      expect(response.body?.data?.agentPayType).toBe('FREE')
      expect(response.body?.data?.agentName).toBe(freeAgentData.agentName)
      expect(response.body?.data?.autoAcceptJobs).toBe(true)
      expect(response.body?.data?.isPrivate).toBe(false)

      freeAgentId = response.body?.data?.id
    })

    it('应该能够获取免费 Agent 详情', async () => {
      const response = await request(app.getHttpServer()).get(`/api/agent/${freeAgentId}`).expect(200)

      expect(response.body?.data?.agentPayType).toBe('FREE')
      expect(response.body?.data?.contractType).toBe('ALGORITHM')
      expect(response.body?.data?.pricePerNumber).toBeNull()
      expect(response.body?.data?.monthlySalary).toBeNull()
    })

    it('应该能够更新免费 Agent', async () => {
      const updateData = TestDataFactory.generateAgentUpdate('free')

      const response = await request(app.getHttpServer()).post(`/api/agent/update/${freeAgentId}`).send(updateData).expect(200)

      expect(response.body?.data?.agentName).toBe(updateData.agentName)
      expect(response.body?.data?.autoAcceptJobs).toBe((updateData as any).autoAcceptJobs)
      expect(response.body?.data?.reputation).toBe(updateData.reputation)
    })

    it('应该能够删除免费 Agent', async () => {
      await request(app.getHttpServer()).post(`/api/agent/delete/${freeAgentId}`).expect(200)

      // 验证软删除 - 应该返回404
      await request(app.getHttpServer()).get(`/api/agent/${freeAgentId}`).expect(404)
    })
  })

  describe('按次收费 Agent (PAY_PER_TASK)', () => {
    let paidAgentId: number

    it('应该成功创建按次收费 Agent', async () => {
      const paidAgentData = TestDataFactory.createPayPerTaskAgent()

      const response = await request(app.getHttpServer()).post('/api/agent/create').send(paidAgentData).expect(201)

      expect(response.body?.code).toBe(201)
      expect(response.body?.data?.agentPayType).toBe('PAY_PER_TASK')
      expect(response.body?.data?.pricePerNumber).toBe(paidAgentData.pricePerNumber)
      expect(response.body?.data?.minPrice).toBe(paidAgentData.minPrice)
      expect(response.body?.data?.maxPrice).toBe(paidAgentData.maxPrice)
      expect(response.body?.data?.contractType).toBe('RESULT')

      paidAgentId = response.body?.data?.id
    })

    it('应该验证付费 Agent 的特有字段', async () => {
      const response = await request(app.getHttpServer()).get(`/api/agent/${paidAgentId}`).expect(200)

      expect(response.body?.data?.agentPayType).toBe('PAY_PER_TASK')
      expect(response.body?.data?.pricePerNumber).toBeDefined()
      expect(response.body?.data?.minPrice).toBeDefined()
      expect(response.body?.data?.maxPrice).toBeDefined()
      expect(response.body?.data?.monthlySalary).toBeNull()
      expect(response.body?.data?.bonus).toBeNull()
    })

    it('应该能够更新付费 Agent 的价格', async () => {
      const updateData = TestDataFactory.generateAgentUpdate('paid') as {
        agentName: string
        pricePerNumber: number
        maxPrice: number
        description: string
        reputation: number
        successRate: number
      }

      const response = await request(app.getHttpServer()).post(`/api/agent/update/${paidAgentId}`).send(updateData).expect(200)

      expect(response.body?.data?.pricePerNumber).toBe(updateData.pricePerNumber)
      expect(response.body?.data?.maxPrice).toBe(updateData.maxPrice)
      expect(response.body?.data?.reputation).toBe(updateData.reputation)
    })

    it('应该能够删除付费 Agent', async () => {
      await request(app.getHttpServer()).post(`/api/agent/delete/${paidAgentId}`).expect(200)
    })
  })

  describe('人类雇佣 Agent (HUMAN_BASED_HIRING)', () => {
    let humanAgentId: number

    it('应该成功创建人类雇佣 Agent', async () => {
      const humanAgentData = TestDataFactory.createHumanBasedAgent()

      const response = await request(app.getHttpServer()).post('/api/agent/create').send(humanAgentData).expect(201)

      expect(response.body?.code).toBe(201)
      expect(response.body?.data?.agentPayType).toBe('HUMAN_BASED_HIRING')
      expect(response.body?.data?.monthlySalary).toBe(humanAgentData.monthlySalary)
      expect(response.body?.data?.bonus).toBe(humanAgentData.bonus)
      expect(response.body?.data?.expectedDuration).toBe(humanAgentData.expectedDuration)
      expect(response.body?.data?.isPrivate).toBe(true)
      expect(response.body?.data?.autoAcceptJobs).toBe(false)

      humanAgentId = response.body?.data?.id
    })

    it('应该验证人类雇佣 Agent 的特有字段', async () => {
      const response = await request(app.getHttpServer()).get(`/api/agent/${humanAgentId}`).expect(200)

      expect(response.body?.data?.agentPayType).toBe('HUMAN_BASED_HIRING')
      expect(response.body?.data?.monthlySalary).toBeDefined()
      expect(response.body?.data?.bonus).toBeDefined()
      expect(response.body?.data?.expectedDuration).toBeDefined()
      expect(response.body?.data?.pricePerNumber).toBeNull()
      expect(response.body?.data?.minPrice).toBeNull()
    })

    it('应该能够更新人类雇佣 Agent 的薪资', async () => {
      const updateData = TestDataFactory.generateAgentUpdate('human') as {
        agentName: string
        monthlySalary: number
        bonus: number
        description: string
        reputation: number
        successRate: number
      }

      const response = await request(app.getHttpServer()).post(`/api/agent/update/${humanAgentId}`).send(updateData).expect(200)

      expect(response.body?.data?.monthlySalary).toBe(updateData.monthlySalary)
      expect(response.body?.data?.bonus).toBe(updateData.bonus)
      expect(response.body?.data?.agentName).toBe(updateData.agentName)
    })

    it('应该能够删除人类雇佣 Agent', async () => {
      await request(app.getHttpServer()).post(`/api/agent/delete/${humanAgentId}`).expect(200)
    })
  })

  describe('Agent 类型过滤查询', () => {
    let agents: any[] = []

    beforeAll(async () => {
      // 创建不同类型的 Agent 用于测试过滤
      const freeAgent = await request(app.getHttpServer()).post('/api/agent/create').send(TestDataFactory.createFreeAgent())

      const paidAgent = await request(app.getHttpServer()).post('/api/agent/create').send(TestDataFactory.createPayPerTaskAgent())

      const humanAgent = await request(app.getHttpServer()).post('/api/agent/create').send(TestDataFactory.createHumanBasedAgent())

      agents = [freeAgent.body?.data, paidAgent.body?.data, humanAgent.body?.data]
    })

    it('应该能够按支付类型过滤 Agent', async () => {
      const response = await request(app.getHttpServer()).get('/api/agent/list?agentPayType=PAY_PER_TASK').expect(200)

      expect(response.body?.data?.length).toBeGreaterThan(0)
      response.body?.data?.forEach((agent: any) => {
        expect(agent?.agentPayType).toBe('PAY_PER_TASK')
      })
    })

    it('应该能够按 Agent 类型过滤', async () => {
      const response = await request(app.getHttpServer()).get('/api/agent/list?agentType=VIRTUAL_MACHINE').expect(200)

      expect(response.body?.data?.length).toBeGreaterThan(0)
      response.body?.data?.forEach((agent: any) => {
        expect(agent?.agentType).toBe('VIRTUAL_MACHINE')
      })
    })

    it('应该能够按私有状态过滤', async () => {
      const response = await request(app.getHttpServer()).get('/api/agent/list?isPrivate=true').expect(200)

      response.body?.data?.forEach((agent: any) => {
        expect(agent?.isPrivate).toBe(true)
      })
    })

    it('应该能够按自动接单状态过滤', async () => {
      const response = await request(app.getHttpServer()).get('/api/agent/list?isActive=true&autoAcceptJobs=true').expect(200)

      response.body?.data?.forEach((agent: any) => {
        expect(agent?.isActive).toBe(true)
        expect(agent?.autoAcceptJobs).toBe(true)
      })
    })

    afterAll(async () => {
      // 批量删除测试数据
      const agentIds = agents.filter(agent => agent?.id).map(agent => agent.id)
      if (agentIds.length > 0) {
        await request(app.getHttpServer()).post('/api/agent/batch-delete').send({ ids: agentIds })
      }
    })
  })
})
