// 测试数据工厂类
export class TestDataFactory {
  // ========== Agent 测试数据 ==========

  // 免费 Agent
  static createFreeAgent() {
    return {
      agentName: '免费测试Agent',
      agentType: 'BROWSER_USE',
      agentPayType: 'FREE',
      agentAddress: 'http://free-agent.com',
      description: '这是一个免费的测试Agent',
      authorBio: '免费Agent作者',
      agentCategory: 1,
      agentClassification: '免费工具',
      tags: ['free', 'test'],
      reputation: 4.0,
      successRate: 0.85,
      createdBy: 'free-user',
      contractType: 'ALGORITHM',
      walletAddress: '0xfree123456789',
      isPrivate: false,
      autoAcceptJobs: true,
      isActive: true,
    }
  }

  // 按次收费 Agent
  static createPayPerTaskAgent() {
    return {
      agentName: '按次收费Agent',
      agentType: 'VIRTUAL_MACHINE',
      agentPayType: 'PAY_PER_TASK',
      agentAddress: 'http://paid-agent.com',
      description: '这是一个按次收费的Agent',
      authorBio: '专业Agent开发者',
      agentCategory: 2,
      agentClassification: '付费工具',
      tags: ['paid', 'professional'],
      reputation: 4.8,
      successRate: 0.95,
      createdBy: 'pro-user',
      contractType: 'RESULT',
      walletAddress: '0xpaid987654321',
      pricePerNumber: 50,
      minPrice: 10,
      maxPrice: 100,
      isPrivate: false,
      autoAcceptJobs: false,
      isActive: true,
    }
  }

  // 人类雇佣模式 Agent
  static createHumanBasedAgent() {
    return {
      agentName: '人类雇佣Agent',
      agentType: 'TEXT_GENERATION',
      agentPayType: 'HUMAN_BASED_HIRING',
      agentAddress: 'http://human-agent.com',
      description: '这是一个人类雇佣模式的Agent',
      authorBio: '人类Agent专家',
      agentCategory: 3,
      agentClassification: '人工服务',
      tags: ['human', 'expert'],
      reputation: 5.0,
      successRate: 0.98,
      createdBy: 'expert-user',
      contractType: 'RESULT',
      walletAddress: '0xhuman456789123',
      monthlySalary: 5000,
      bonus: 1000,
      expectedDuration: 6,
      isPrivate: true,
      autoAcceptJobs: false,
      isActive: true,
    }
  }

  // ========== Job 测试数据 ==========

  // 免费任务 (需要押金)
  static createFreeJob() {
    return {
      jobTitle: '免费测试任务',
      category: '测试分类',
      description: '这是一个免费的测试任务，需要提供押金',
      paymentType: 'FREE_JOBS',
      deadline: '2024-12-31T23:59:59.000Z',
      priority: 'MEDIUM',
      deliverables: '完成测试报告',
      skillLevel: 'BEGINNER',
      walletAddress: '0xfree-job123',
      createdBy: 'job-creator',
      budget: 100, // 押金
      isPublic: true,
      autoAssign: true,
      allowBidding: false,
      escrowEnabled: false,
    }
  }

  // 按次付费任务
  static createPayPerTaskJob() {
    return {
      jobTitle: '按次付费任务',
      category: '软件开发',
      description: '这是一个按次付费的开发任务',
      paymentType: 'PAY_PER_TASK',
      deadline: '2024-12-31T23:59:59.000Z',
      priority: 'HIGH',
      deliverables: '完整的软件解决方案',
      skillLevel: 'ADVANCED',
      walletAddress: '0xpaid-job456',
      createdBy: 'client-user',
      budget: 500, // 最低预算
      maxBudget: 1500, // 最高预算
      isPublic: true,
      autoAssign: false,
      allowBidding: true,
      escrowEnabled: true,
    }
  }

  // 人工雇佣模式任务
  static createHumanBasedJob() {
    return {
      jobTitle: '人工雇佣任务',
      category: '咨询服务',
      description: '需要专业人工服务的长期项目',
      paymentType: 'HUMAN_BASED_HIRING',
      deadline: '2025-06-30T23:59:59.000Z',
      priority: 'URGENT',
      deliverables: '专业咨询报告和持续服务',
      skillLevel: 'EXPERT',
      walletAddress: '0xhuman-job789',
      createdBy: 'enterprise-client',
      budget: 10000, // 总预算
      isPublic: false,
      autoAssign: false,
      allowBidding: false,
      escrowEnabled: true,
    }
  }

  // 基于结果的支付任务
  static createOutcomeBasedJob() {
    return {
      jobTitle: '结果导向任务',
      category: 'AI训练',
      description: '基于最终结果质量进行支付的任务',
      paymentType: 'OUTCOME_BASED',
      deadline: '2024-11-30T23:59:59.000Z',
      priority: 'HIGH',
      deliverables: '达到指定准确率的AI模型',
      skillLevel: 'EXPERT',
      walletAddress: '0xoutcome-job000',
      createdBy: 'ai-company',
      budget: 2000,
      maxBudget: 5000,
      isPublic: true,
      autoAssign: false,
      allowBidding: true,
      escrowEnabled: true,
    }
  }

  // ========== 更新数据生成器 ==========

  static generateAgentUpdate(type: 'free' | 'paid' | 'human') {
    const baseUpdate = {
      description: '更新后的描述',
      reputation: 4.9,
      successRate: 0.98,
    }

    switch (type) {
      case 'free':
        return {
          ...baseUpdate,
          agentName: '更新的免费Agent',
          autoAcceptJobs: false,
        }
      case 'paid':
        return {
          ...baseUpdate,
          agentName: '更新的付费Agent',
          pricePerNumber: 75,
          maxPrice: 150,
        }
      case 'human':
        return {
          ...baseUpdate,
          agentName: '更新的人工Agent',
          monthlySalary: 6000,
          bonus: 1500,
        }
    }
  }

  static generateJobUpdate(type: 'free' | 'paid' | 'human' | 'outcome') {
    const baseUpdate = {
      description: '更新后的任务描述',
      priority: 'URGENT',
    }

    switch (type) {
      case 'free':
        return {
          ...baseUpdate,
          jobTitle: '更新的免费任务',
          budget: 150,
        }
      case 'paid':
        return {
          ...baseUpdate,
          jobTitle: '更新的付费任务',
          budget: 800,
          maxBudget: 2000,
        }
      case 'human':
        return {
          ...baseUpdate,
          jobTitle: '更新的人工任务',
          budget: 15000,
        }
      case 'outcome':
        return {
          ...baseUpdate,
          jobTitle: '更新的结果任务',
          budget: 3000,
          maxBudget: 8000,
        }
    }
  }

  // ========== Agent Category 测试数据 ==========

  static createAgentCategory() {
    return {
      name: '数据处理',
      icon: 'data-processing-icon.svg',
      description: '专门用于数据处理和分析的Agent分类',
    }
  }

  static createAgentCategoryAI() {
    return {
      name: 'AI助手',
      icon: 'ai-assistant-icon.svg',
      description: '基于人工智能的智能助手Agent分类',
    }
  }

  static createAgentCategoryAutomation() {
    return {
      name: '自动化工具',
      icon: 'automation-icon.svg',
      description: '用于业务流程自动化的Agent分类',
    }
  }

  static generateAgentCategoryUpdate() {
    return {
      name: '更新后的分类名称',
      icon: 'updated-icon.svg',
      description: '这是一个更新后的分类描述',
    }
  }
}
