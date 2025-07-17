import { IsString, IsBoolean, IsNumber, IsEnum, IsOptional, IsArray, Min, Max, ArrayMinSize } from 'class-validator'
import { Transform } from 'class-transformer'
import { AgentType, AgentPayType, ContractType } from '@prisma/client'

export class CreateAgentDto {
  @IsString()
  agentName: string

  @IsEnum(AgentType)
  agentType: AgentType

  @IsEnum(AgentPayType)
  agentPayType: AgentPayType

  @IsString()
  agentAddress: string

  @IsString()
  description: string

  @IsString()
  authorBio: string

  @IsNumber()
  agentCategory: number

  @IsString()
  agentClassification: string

  @IsArray()
  @IsString({ each: true })
  tags: string[]

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean

  @IsOptional()
  @IsBoolean()
  autoAcceptJobs?: boolean

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsNumber()
  @Min(0)
  @Max(5)
  reputation: number

  @IsNumber()
  @Min(0)
  @Max(1)
  successRate: number

  @IsString()
  createdBy: string

  @IsEnum(ContractType)
  contractType: ContractType

  @IsString()
  walletAddress: string

  // 按次收费agent特有字段
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerNumber?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number

  // 人类雇佣模式特有字段
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlySalary?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  bonus?: number

  @IsOptional()
  @IsNumber()
  @Min(1)
  expectedDuration?: number
}

export class UpdateAgentDto {
  @IsOptional()
  @IsString()
  agentName?: string

  @IsOptional()
  @IsEnum(AgentType)
  agentType?: AgentType

  @IsOptional()
  @IsEnum(AgentPayType)
  agentPayType?: AgentPayType

  @IsOptional()
  @IsString()
  agentAddress?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  authorBio?: string

  @IsOptional()
  @IsNumber()
  agentCategory?: number

  @IsOptional()
  @IsString()
  agentClassification?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean

  @IsOptional()
  @IsBoolean()
  autoAcceptJobs?: boolean

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  reputation?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  successRate?: number

  @IsOptional()
  @IsString()
  updatedBy?: string

  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType

  @IsOptional()
  @IsString()
  walletAddress?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerNumber?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlySalary?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  bonus?: number

  @IsOptional()
  @IsNumber()
  @Min(1)
  expectedDuration?: number
}

export class AgentQueryDto {
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

  @IsOptional()
  @IsEnum(AgentType)
  agentType?: AgentType

  @IsOptional()
  @IsEnum(AgentPayType)
  agentPayType?: AgentPayType

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsNumber({}, { message: 'agentCategory must be a number' })
  agentCategory?: number

  @IsOptional()
  @Transform(({ value }) => (value ? value === 'true' : undefined))
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @Transform(({ value }) => (value ? value === 'true' : undefined))
  @IsBoolean()
  isPrivate?: boolean

  @IsOptional()
  @Transform(({ value }) => (value ? value === 'true' : undefined))
  @IsBoolean()
  autoAcceptJobs?: boolean
}

export class BatchDeleteAgentDto {
  @IsArray()
  @ArrayMinSize(1, { message: '至少需要提供一个ID' })
  @IsNumber({}, { each: true, message: '所有ID必须是数字' })
  ids: number[]
}
