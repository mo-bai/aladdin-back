-- AlterTable
ALTER TABLE "agentCategories" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "agents" ALTER COLUMN "walletAddress" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "jobDistributionAgents" ADD CONSTRAINT "jobDistributionAgents_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobDistributionAgents" ADD CONSTRAINT "jobDistributionAgents_jobDistributionId_fkey" FOREIGN KEY ("jobDistributionId") REFERENCES "jobDistributionRecords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
