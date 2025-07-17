import { IsString, IsNumber, IsOptional, IsArray, ArrayMinSize } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateAgentCategoryDto {
  @IsString()
  name: string

  @IsString()
  icon: string

  @IsString()
  description: string
}

export class UpdateAgentCategoryDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  icon?: string

  @IsOptional()
  @IsString()
  description?: string
}

export class AgentCategoryQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsNumber({}, { message: 'page must be a number' })
  page?: number = 1

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsNumber({}, { message: 'limit must be a number' })
  limit?: number = 10

  @IsOptional()
  @IsString()
  search?: string
}

export class BatchDeleteAgentCategoryDto {
  @IsArray()
  @ArrayMinSize(1, { message: '至少需要提供一个ID' })
  @IsNumber({}, { each: true, message: '所有ID必须是数字' })
  ids: number[]
}
