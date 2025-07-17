import { IsString, IsBoolean, IsNumber, IsEnum, IsOptional, IsDateString, Min, IsArray, ArrayMinSize } from 'class-validator'
import { Transform } from 'class-transformer'
import { PaymentType, Priority, SkillLevel, JobStatus } from '@prisma/client'

export class CreateJobDto {
  @IsString()
  jobTitle: string

  @IsString()
  category: string

  @IsString()
  description: string

  @IsEnum(PaymentType)
  paymentType: PaymentType

  @IsDateString()
  deadline: string

  @IsEnum(Priority)
  priority: Priority

  @IsString()
  deliverables: string

  @IsEnum(SkillLevel)
  skillLevel: SkillLevel

  @IsOptional()
  @IsBoolean()
  autoAssign?: boolean

  @IsOptional()
  @IsBoolean()
  allowBidding?: boolean

  @IsOptional()
  @IsBoolean()
  escrowEnabled?: boolean

  @IsString()
  walletAddress: string

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean

  @IsString()
  createdBy: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxBudget?: number
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  jobTitle?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType

  @IsOptional()
  @IsDateString()
  deadline?: string

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority

  @IsOptional()
  @IsString()
  deliverables?: string

  @IsOptional()
  @IsEnum(SkillLevel)
  skillLevel?: SkillLevel

  @IsOptional()
  @IsBoolean()
  autoAssign?: boolean

  @IsOptional()
  @IsBoolean()
  allowBidding?: boolean

  @IsOptional()
  @IsBoolean()
  escrowEnabled?: boolean

  @IsOptional()
  @IsString()
  walletAddress?: string

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus

  @IsOptional()
  @IsString()
  updatedBy?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxBudget?: number
}

export class JobQueryDto {
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
  @IsString()
  category?: string

  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority

  @IsOptional()
  @IsEnum(SkillLevel)
  skillLevel?: SkillLevel

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus

  @IsOptional()
  @Transform(({ value }) => (value ? value === 'true' : undefined))
  @IsBoolean()
  isPublic?: boolean

  @IsOptional()
  @Transform(({ value }) => (value ? value === 'true' : undefined))
  @IsBoolean()
  autoAssign?: boolean
}

export class BatchDeleteJobDto {
  @IsArray()
  @ArrayMinSize(1, { message: '至少需要提供一个ID' })
  @IsNumber({}, { each: true, message: '所有ID必须是数字' })
  ids: number[]
}
