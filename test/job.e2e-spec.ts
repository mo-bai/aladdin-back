import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { TestSetup } from './test-setup'
import { TestDataFactory } from './test-data-factory'

describe('Job Types E2E', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await TestSetup.createTestApp()
  })

  afterAll(async () => {
    await TestSetup.closeTestApp()
  })

  describe('免费任务 (FREE_JOBS)', () => {
    let freeJobId: number

    it('应该成功创建免费任务', async () => {
      const freeJobData = TestDataFactory.createFreeJob()

      const response = await request(app.getHttpServer()).post('/api/job/create').send(freeJobData).expect(201)

      expect(response.body?.code).toBe(201)
      expect(response.body?.data?.paymentType).toBe('FREE_JOBS')
      expect(response.body?.data?.jobTitle).toBe(freeJobData.jobTitle)
      expect(response.body?.data?.budget).toBe(freeJobData.budget) // 押金
      expect(response.body?.data?.autoAssign).toBe(true)
      expect(response.body?.data?.allowBidding).toBe(false)
      expect(response.body?.data?.escrowEnabled).toBe(false)
      expect(response.body?.data?.status).toBe('OPEN')

      freeJobId = response.body?.data?.id
    })

    it('应该验证免费任务的特有属性', async () => {
      const response = await request(app.getHttpServer()).get(`/api/job/${freeJobId}`).expect(200)

      expect(response.body?.data?.paymentType).toBe('FREE_JOBS')
      expect(response.body?.data?.budget).toBeDefined() // 押金
      expect(response.body?.data?.maxBudget).toBeNull() // 免费任务没有最高预算
      expect(response.body?.data?.autoAssign).toBe(true)
      expect(response.body?.data?.escrowEnabled).toBe(false)
    })

    it('应该能够更新免费任务', async () => {
      const updateData = TestDataFactory.generateJobUpdate('free')

      const response = await request(app.getHttpServer()).post(`/api/job/update/${freeJobId}`).send(updateData).expect(200)

      expect(response.body?.data?.jobTitle).toBe(updateData.jobTitle)
      expect(response.body?.data?.priority).toBe(updateData.priority)
      expect(response.body?.data?.budget).toBe(updateData.budget)
    })

    it('应该能够删除免费任务', async () => {
      await request(app.getHttpServer()).post(`/api/job/delete/${freeJobId}`).expect(200)

      // 验证软删除
      await request(app.getHttpServer()).get(`/api/job/${freeJobId}`).expect(404)
    })
  })

  describe('按次付费任务 (PAY_PER_TASK)', () => {
    let paidJobId: number

    it('应该成功创建按次付费任务', async () => {
      const paidJobData = TestDataFactory.createPayPerTaskJob()

      const response = await request(app.getHttpServer()).post('/api/job/create').send(paidJobData).expect(201)

      expect(response.body?.code).toBe(201)
      expect(response.body?.data?.paymentType).toBe('PAY_PER_TASK')
      expect(response.body?.data?.budget).toBe(paidJobData.budget) // 最低预算
      expect(response.body?.data?.maxBudget).toBe(paidJobData.maxBudget) // 最高预算
      expect(response.body?.data?.allowBidding).toBe(true)
      expect(response.body?.data?.escrowEnabled).toBe(true)
      expect(response.body?.data?.priority).toBe('HIGH')

      paidJobId = response.body?.data?.id
    })

    it('应该验证按次付费任务的特有属性', async () => {
      const response = await request(app.getHttpServer()).get(`/api/job/${paidJobId}`).expect(200)

      expect(response.body?.data?.paymentType).toBe('PAY_PER_TASK')
      expect(response.body?.data?.budget).toBeDefined() // 最低预算
      expect(response.body?.data?.maxBudget).toBeDefined() // 最高预算
      expect(response.body?.data?.allowBidding).toBe(true)
      expect(response.body?.data?.escrowEnabled).toBe(true)
      expect(response.body?.data?.skillLevel).toBe('ADVANCED')
    })

    it('应该能够更新付费任务的预算范围', async () => {
      const updateData = TestDataFactory.generateJobUpdate('paid') as {
        jobTitle: string
        budget: number
        maxBudget: number
        description: string
        priority: string
      }

      const response = await request(app.getHttpServer()).post(`/api/job/update/${paidJobId}`).send(updateData).expect(200)

      expect(response.body?.data?.budget).toBe(updateData.budget)
      expect(response.body?.data?.maxBudget).toBe(updateData.maxBudget)
      expect(response.body?.data?.priority).toBe(updateData.priority)
    })

    it('应该能够删除付费任务', async () => {
      await request(app.getHttpServer()).post(`/api/job/delete/${paidJobId}`).expect(200)
    })
  })

  describe('人工雇佣任务 (HUMAN_BASED_HIRING)', () => {
    let humanJobId: number

    it('应该成功创建人工雇佣任务', async () => {
      const humanJobData = TestDataFactory.createHumanBasedJob()

      const response = await request(app.getHttpServer()).post('/api/job/create').send(humanJobData).expect(201)

      expect(response.body?.code).toBe(201)
      expect(response.body?.data?.paymentType).toBe('HUMAN_BASED_HIRING')
      expect(response.body?.data?.budget).toBe(humanJobData.budget) // 总预算
      expect(response.body?.data?.isPublic).toBe(false) // 私有任务
      expect(response.body?.data?.allowBidding).toBe(false)
      expect(response.body?.data?.escrowEnabled).toBe(true)
      expect(response.body?.data?.priority).toBe('URGENT')
      expect(response.body?.data?.skillLevel).toBe('EXPERT')

      humanJobId = response.body?.data?.id
    })

    it('应该验证人工雇佣任务的特有属性', async () => {
      const response = await request(app.getHttpServer()).get(`/api/job/${humanJobId}`).expect(200)

      expect(response.body?.data?.paymentType).toBe('HUMAN_BASED_HIRING')
      expect(response.body?.data?.budget).toBeDefined()
      expect(response.body?.data?.isPublic).toBe(false)
      expect(response.body?.data?.autoAssign).toBe(false)
      expect(response.body?.data?.skillLevel).toBe('EXPERT')
      expect(response.body?.data?.category).toBe('咨询服务')
    })

    it('应该能够更新人工雇佣任务', async () => {
      const updateData = TestDataFactory.generateJobUpdate('human') as {
        jobTitle: string
        budget: number
        description: string
        priority: string
      }

      const response = await request(app.getHttpServer()).post(`/api/job/update/${humanJobId}`).send(updateData).expect(200)

      expect(response.body?.data?.jobTitle).toBe(updateData.jobTitle)
      expect(response.body?.data?.budget).toBe(updateData.budget)
      expect(response.body?.data?.priority).toBe(updateData.priority)
    })

    it('应该能够删除人工雇佣任务', async () => {
      await request(app.getHttpServer()).post(`/api/job/delete/${humanJobId}`).expect(200)
    })
  })

  describe('结果导向任务 (OUTCOME_BASED)', () => {
    let outcomeJobId: number

    it('应该成功创建结果导向任务', async () => {
      const outcomeJobData = TestDataFactory.createOutcomeBasedJob()

      const response = await request(app.getHttpServer()).post('/api/job/create').send(outcomeJobData).expect(201)

      expect(response.body?.code).toBe(201)
      expect(response.body?.data?.paymentType).toBe('OUTCOME_BASED')
      expect(response.body?.data?.budget).toBe(outcomeJobData.budget)
      expect(response.body?.data?.maxBudget).toBe(outcomeJobData.maxBudget)
      expect(response.body?.data?.allowBidding).toBe(true)
      expect(response.body?.data?.escrowEnabled).toBe(true)
      expect(response.body?.data?.category).toBe('AI训练')

      outcomeJobId = response.body?.data?.id
    })

    it('应该验证结果导向任务的特有属性', async () => {
      const response = await request(app.getHttpServer()).get(`/api/job/${outcomeJobId}`).expect(200)

      expect(response.body?.data?.paymentType).toBe('OUTCOME_BASED')
      expect(response.body?.data?.budget).toBeDefined()
      expect(response.body?.data?.maxBudget).toBeDefined()
      expect(response.body?.data?.allowBidding).toBe(true)
      expect(response.body?.data?.escrowEnabled).toBe(true)
      expect(response.body?.data?.skillLevel).toBe('EXPERT')
    })

    it('应该能够更新结果导向任务', async () => {
      const updateData = TestDataFactory.generateJobUpdate('outcome') as {
        jobTitle: string
        budget: number
        maxBudget: number
        description: string
        priority: string
      }

      const response = await request(app.getHttpServer()).post(`/api/job/update/${outcomeJobId}`).send(updateData).expect(200)

      expect(response.body?.data?.jobTitle).toBe(updateData.jobTitle)
      expect(response.body?.data?.budget).toBe(updateData.budget)
      expect(response.body?.data?.maxBudget).toBe(updateData.maxBudget)
    })

    it('应该能够删除结果导向任务', async () => {
      await request(app.getHttpServer()).post(`/api/job/delete/${outcomeJobId}`).expect(200)
    })
  })

  describe('Job 状态管理', () => {
    let testJobId: number

    beforeAll(async () => {
      const jobData = TestDataFactory.createPayPerTaskJob()
      const response = await request(app.getHttpServer()).post('/api/job/create').send(jobData)
      testJobId = response.body?.data?.id
    })

    it('应该能够将任务状态从 OPEN 更新为 IN_PROGRESS', async () => {
      const response = await request(app.getHttpServer()).post(`/api/job/update/status/${testJobId}`).send({ status: 'IN_PROGRESS' }).expect(200)

      expect(response.body?.data?.status).toBe('IN_PROGRESS')
    })

    it('应该能够将任务状态更新为 COMPLETED', async () => {
      const response = await request(app.getHttpServer()).post(`/api/job/update/status/${testJobId}`).send({ status: 'COMPLETED' }).expect(200)

      expect(response.body?.data?.status).toBe('COMPLETED')
    })

    afterAll(async () => {
      await request(app.getHttpServer()).post(`/api/job/delete/${testJobId}`)
    })
  })

  describe('Job 类型过滤查询', () => {
    let jobs: any[] = []

    beforeAll(async () => {
      // 创建不同类型的 Job 用于测试过滤
      const freeJob = await request(app.getHttpServer()).post('/api/job/create').send(TestDataFactory.createFreeJob())

      const paidJob = await request(app.getHttpServer()).post('/api/job/create').send(TestDataFactory.createPayPerTaskJob())

      const humanJob = await request(app.getHttpServer()).post('/api/job/create').send(TestDataFactory.createHumanBasedJob())

      const outcomeJob = await request(app.getHttpServer()).post('/api/job/create').send(TestDataFactory.createOutcomeBasedJob())

      jobs = [freeJob.body?.data, paidJob.body?.data, humanJob.body?.data, outcomeJob.body?.data]
    })

    it('应该能够按支付类型过滤任务', async () => {
      const response = await request(app.getHttpServer()).get('/api/job/list?paymentType=PAY_PER_TASK').expect(200)

      expect(response.body?.data?.length).toBeGreaterThan(0)
      response.body?.data?.forEach((job: any) => {
        expect(job?.paymentType).toBe('PAY_PER_TASK')
      })
    })

    it('应该能够按优先级过滤任务', async () => {
      const response = await request(app.getHttpServer()).get('/api/job/list?priority=URGENT').expect(200)

      response.body?.data?.forEach((job: any) => {
        expect(job?.priority).toBe('URGENT')
      })
    })

    it('应该能够按技能等级过滤任务', async () => {
      const response = await request(app.getHttpServer()).get('/api/job/list?skillLevel=EXPERT').expect(200)

      response.body?.data?.forEach((job: any) => {
        expect(job?.skillLevel).toBe('EXPERT')
      })
    })

    it('应该能够按公开状态过滤任务', async () => {
      const response = await request(app.getHttpServer()).get('/api/job/list?isPublic=false').expect(200)

      response.body?.data?.forEach((job: any) => {
        expect(job?.isPublic).toBe(false)
      })
    })

    it('应该能够组合多个过滤条件', async () => {
      const response = await request(app.getHttpServer()).get('/api/job/list?paymentType=OUTCOME_BASED&skillLevel=EXPERT&isPublic=true').expect(200)

      response.body?.data?.forEach((job: any) => {
        expect(job?.paymentType).toBe('OUTCOME_BASED')
        expect(job?.skillLevel).toBe('EXPERT')
        expect(job?.isPublic).toBe(true)
      })
    })

    afterAll(async () => {
      // 批量删除测试数据
      const jobIds = jobs.filter(job => job?.id).map(job => job.id)
      if (jobIds.length > 0) {
        await request(app.getHttpServer()).post('/api/job/batch-delete').send({ ids: jobIds })
      }
    })
  })
})
