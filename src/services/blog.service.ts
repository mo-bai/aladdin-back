import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { CreateBlogDto, UpdateBlogDto, BlogQueryDto } from '../dto/blog.dto'
import { blogs, Prisma } from '@prisma/client'

@Injectable()
export class BlogService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBlogDto: CreateBlogDto): Promise<blogs> {
    return this.databaseService.client.blogs.create({
      data: createBlogDto,
    })
  }

  async findAll(query: BlogQueryDto) {
    const { page = 1, limit = 10, search, author } = query
    const skip = (page - 1) * limit

    const where: Prisma.blogsWhereInput = {
      ...(search && {
        OR: [{ title: { contains: search, mode: 'insensitive' } }, { content: { contains: search, mode: 'insensitive' } }],
      }),
      ...(author && { author: { contains: author, mode: 'insensitive' } }),
    }

    const [blogs, total] = await Promise.all([
      this.databaseService.client.blogs.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.databaseService.client.blogs.count({ where }),
    ])

    return {
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: number): Promise<blogs> {
    const blog = await this.databaseService.client.blogs.findUnique({
      where: { id },
    })

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`)
    }

    return blog
  }

  async update(id: number, updateBlogDto: UpdateBlogDto): Promise<blogs> {
    await this.findOne(id) // 检查是否存在

    return this.databaseService.client.blogs.update({
      where: { id },
      data: {
        ...updateBlogDto,
        updated_at: new Date(),
      },
    })
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id) // 检查是否存在

    await this.databaseService.client.blogs.delete({
      where: { id },
    })
  }

  async findByAuthor(author: string): Promise<blogs[]> {
    return this.databaseService.client.blogs.findMany({
      where: { author },
      orderBy: { created_at: 'desc' },
    })
  }
}
