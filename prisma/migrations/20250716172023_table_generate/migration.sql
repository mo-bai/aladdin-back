-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('text-generation', 'browser-use', 'virtual-machine');

-- CreateEnum
CREATE TYPE "AgentPayType" AS ENUM ('free', 'pay_per_task', 'human_based_hiring');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('result', 'algorithm');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('Free Jobs', 'Pay Per Task', 'Hunman-Based Hiring Model', 'Outcome-based Payment');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'In Progress', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "agents" (
    "id" SERIAL NOT NULL,
    "agentName" TEXT NOT NULL,
    "agentType" "AgentType" NOT NULL,
    "agentPayType" "AgentPayType" NOT NULL,
    "agentAddress" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorBio" TEXT NOT NULL,
    "agentCategory" INTEGER NOT NULL,
    "agentClassification" TEXT NOT NULL,
    "tags" TEXT[],
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "autoAcceptJobs" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "reputation" DOUBLE PRECISION NOT NULL,
    "successRate" DOUBLE PRECISION NOT NULL,
    "totalJobsCompleted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "contractType" "ContractType" NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "pricePerNumber" DOUBLE PRECISION,
    "minPrice" DOUBLE PRECISION,
    "maxPrice" DOUBLE PRECISION,
    "monthlySalary" DOUBLE PRECISION,
    "bonus" DOUBLE PRECISION,
    "expectedDuration" INTEGER,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agentCategories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "agentCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "priority" "Priority" NOT NULL,
    "deliverables" TEXT NOT NULL,
    "skillLevel" "SkillLevel" NOT NULL,
    "autoAssign" BOOLEAN NOT NULL DEFAULT false,
    "allowBidding" BOOLEAN NOT NULL DEFAULT false,
    "escrowEnabled" BOOLEAN NOT NULL DEFAULT false,
    "walletAddress" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "status" "JobStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "budget" DOUBLE PRECISION,
    "maxBudget" DOUBLE PRECISION,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobDistributionRecords" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "jobName" TEXT NOT NULL,
    "matchCriteria" JSONB NOT NULL,
    "totalAgents" INTEGER NOT NULL,
    "assignedCount" INTEGER NOT NULL,
    "responseCount" INTEGER NOT NULL,
    "assignedAgentId" INTEGER NOT NULL,
    "assignedAgentName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "jobDistributionRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobDistributionAgents" (
    "id" SERIAL NOT NULL,
    "jobDistributionId" INTEGER NOT NULL,
    "agentId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "jobDistributionAgents_pkey" PRIMARY KEY ("id")
);
