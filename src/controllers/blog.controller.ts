import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, HttpStatus, ValidationPipe } from '@nestjs/common'
import { BlogService } from '../services/blog.service'
import { CreateBlogDto, UpdateBlogDto, BlogQueryDto } from '../dto/blog.dto'

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body(ValidationPipe) createBlogDto: CreateBlogDto) {
    return {
      code: HttpStatus.CREATED,
      message: '博客创建成功',
      data: await this.blogService.create(createBlogDto),
    }
  }

  @Get()
  async findAll(@Query(ValidationPipe) query: BlogQueryDto) {
    const result = await this.blogService.findAll(query)
    return {
      code: HttpStatus.OK,
      message: '获取博客列表成功',
      ...result,
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      code: HttpStatus.OK,
      message: '获取博客详情成功',
      data: await this.blogService.findOne(id),
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateBlogDto: UpdateBlogDto) {
    return {
      code: HttpStatus.OK,
      message: '博客更新成功',
      data: await this.blogService.update(id, updateBlogDto),
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.blogService.remove(id)
    return {
      code: HttpStatus.OK,
      message: '博客删除成功',
    }
  }

  @Get('author/:author')
  async findByAuthor(@Param('author') author: string) {
    return {
      code: HttpStatus.OK,
      message: '获取作者博客成功',
      data: await this.blogService.findByAuthor(author),
    }
  }
}
