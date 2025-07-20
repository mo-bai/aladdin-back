/*
  Warnings:

  - Added the required column `agentStatus` to the `jobDistributionAgents` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('READY', 'DOING', 'COMPLETED', 'TIMEOUT', 'ERROR');

-- AlterTable
ALTER TABLE "agents" ADD COLUMN     "isPledged" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "jobDistributionAgents" ADD COLUMN     "agentStatus" "AgentStatus" NOT NULL,
ADD COLUMN     "result" TEXT;
