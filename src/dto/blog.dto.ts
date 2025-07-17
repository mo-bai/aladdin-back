import { IsString, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateBlogDto {
  @IsString()
  title: string

  @IsString()
  content: string

  @IsString()
  author: string
}

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsString()
  author?: string
}

export class BlogQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  page?: number = 1

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  limit?: number = 10

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  author?: string
}
