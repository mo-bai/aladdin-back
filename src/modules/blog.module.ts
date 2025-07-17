import { Module } from '@nestjs/common'
import { BlogService } from '../services/blog.service'
import { BlogController } from '../controllers/blog.controller'

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
