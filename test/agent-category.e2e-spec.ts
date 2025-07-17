import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter'
import { TestDataFactory } from './test-data-factory'

describe('Agent Category E2E', () => {
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

  describe('Agent Category CRUD', () => {
    let categoryId: number

    it('应该成功创建Agent分类', async () => {
      const categoryData = TestDataFactory.createAgentCategory()

      const response = await request(app.getHttpServer()).post('/api/agent-category/create').send(categoryData).expect(201)

      expect(response.body?.code).toBe(201)
      expect(response.body?.data?.name).toBe(categoryData.name)
      expect(response.body?.data?.icon).toBe(categoryData.icon)
      expect(response.body?.data?.description).toBe(categoryData.description)
      expect(response.body?.data?.isDeleted).toBe(false)

      categoryId = response.body?.data?.id
    })

    it('应该能够获取Agent分类详情', async () => {
      const response = await request(app.getHttpServer()).get(`/api/agent-category/${categoryId}`).expect(200)

      expect(response.body?.data?.id).toBe(categoryId)
      expect(response.body?.data?.name).toBe('数据处理')
      expect(response.body?.data?.isDeleted).toBe(false)
    })

    it('应该能够更新Agent分类', async () => {
      const updateData = TestDataFactory.generateAgentCategoryUpdate()

      const response = await request(app.getHttpServer()).post(`/api/agent-category/update/${categoryId}`).send(updateData).expect(200)

      expect(response.body?.data?.name).toBe(updateData.name)
      expect(response.body?.data?.icon).toBe(updateData.icon)
      expect(response.body?.data?.description).toBe(updateData.description)
    })

    it('应该能够获取Agent分类列表', async () => {
      const response = await request(app.getHttpServer()).get('/api/agent-category/list').expect(200)

      expect(response.body?.data).toBeDefined()
      expect(Array.isArray(response.body?.data)).toBe(true)
      expect(response.body?.pagination).toBeDefined()
    })

    it('应该能够按关键词搜索Agent分类', async () => {
      const response = await request(app.getHttpServer()).get('/api/agent-category/list?search=更新').expect(200)

      expect(response.body?.data?.length).toBeGreaterThan(0)
      response.body?.data?.forEach((category: any) => {
        expect(category?.name?.includes('更新') || category?.description?.includes('更新')).toBe(true)
      })
    })

    it('应该能够删除Agent分类', async () => {
      await request(app.getHttpServer()).post(`/api/agent-category/delete/${categoryId}`).expect(200)

      // 验证软删除 - 应该返回404
      await request(app.getHttpServer()).get(`/api/agent-category/${categoryId}`).expect(404)
    })
  })

  describe('Agent Category 批量操作', () => {
    let categoryIds: number[] = []

    beforeAll(async () => {
      // 创建多个分类用于批量测试
      const categories = [
        TestDataFactory.createAgentCategoryAI(),
        TestDataFactory.createAgentCategoryAutomation(),
        TestDataFactory.createAgentCategory(),
      ]

      for (const categoryData of categories) {
        const response = await request(app.getHttpServer()).post('/api/agent-category/create').send(categoryData)

        categoryIds.push(response.body?.data?.id)
      }
    })

    it('应该能够批量删除Agent分类', async () => {
      const response = await request(app.getHttpServer()).post('/api/agent-category/batch-delete').send({ ids: categoryIds }).expect(200)

      expect(response.body?.code).toBe(200)
      expect(response.body?.message).toBe('批量删除Agent分类成功')

      // 验证所有分类都被软删除
      for (const id of categoryIds) {
        await request(app.getHttpServer()).get(`/api/agent-category/${id}`).expect(404)
      }
    })

    it('批量删除不存在的ID应该返回错误', async () => {
      const nonExistentIds = [999, 1000, 1001]

      await request(app.getHttpServer()).post('/api/agent-category/batch-delete').send({ ids: nonExistentIds }).expect(404)
    })

    it('批量删除空数组应该返回验证错误', async () => {
      await request(app.getHttpServer()).post('/api/agent-category/batch-delete').send({ ids: [] }).expect(400)
    })
  })

  describe('Agent Category 数据验证', () => {
    it('创建分类时缺少必需字段应该返回验证错误', async () => {
      const invalidData = {
        name: '测试分类',
        // 缺少 icon 和 description
      }

      await request(app.getHttpServer()).post('/api/agent-category/create').send(invalidData).expect(400)
    })

    it('更新不存在的分类应该返回404', async () => {
      const updateData = TestDataFactory.generateAgentCategoryUpdate()

      await request(app.getHttpServer()).post('/api/agent-category/update/999').send(updateData).expect(404)
    })

    it('获取不存在的分类应该返回404', async () => {
      await request(app.getHttpServer()).get('/api/agent-category/999').expect(404)
    })

    it('删除不存在的分类应该返回404', async () => {
      await request(app.getHttpServer()).post('/api/agent-category/delete/999').expect(404)
    })
  })

  describe('Agent Category 分页测试', () => {
    let testCategoryIds: number[] = []

    beforeAll(async () => {
      // 创建多个分类用于分页测试
      for (let i = 1; i <= 5; i++) {
        const categoryData = {
          name: `测试分类${i}`,
          icon: `test-icon-${i}.svg`,
          description: `测试分类${i}的描述`,
        }

        const response = await request(app.getHttpServer()).post('/api/agent-category/create').send(categoryData)

        testCategoryIds.push(response.body?.data?.id)
      }
    })

    it('应该能够正确分页', async () => {
      const response = await request(app.getHttpServer()).get('/api/agent-category/list?page=1&limit=3').expect(200)

      expect(response.body?.data?.length).toBeLessThanOrEqual(3)
      expect(response.body?.pagination?.page).toBe(1)
      expect(response.body?.pagination?.limit).toBe(3)
      expect(response.body?.pagination?.total).toBeGreaterThan(0)
    })

    afterAll(async () => {
      // 清理测试数据
      if (testCategoryIds.length > 0) {
        await request(app.getHttpServer()).post('/api/agent-category/batch-delete').send({ ids: testCategoryIds })
      }
    })
  })
})
