import { Module } from '@nestjs/common'
import { AgentService } from '../services/agent.service'
import { AgentController } from '../controllers/agent.controller'
import { AgentCategoryService } from '../services/agent-category.service'
import { AgentCategoryController } from '../controllers/agent-category.controller'

@Module({
  controllers: [AgentController, AgentCategoryController],
  providers: [AgentService, AgentCategoryService],
  exports: [AgentService, AgentCategoryService],
})
export class AgentModule {}
