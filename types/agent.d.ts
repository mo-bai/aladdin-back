interface BaseAgent {
  id: number
  agentName: string // agent名称
  agentType: string // agent类型 'browser-use' | 'virtual-machine'
  agentAddress: string // agent执行任务地址
  description: string // agent描述
  authorBio: string // 作者简介
  agentCategory: number // 分类id
  agentClassification: string // 分类名称
  isPrivate: boolean // 是否私有
  tags: string[] // 标签
  autoAcceptJobs: boolean // 是否自动接单
  isActive: boolean // 是否激活,默认为true
  reputation: number // 信誉评分
  successRate: number // 成功率
  totalJobsCompleted: number // 总任务数

  contractType: string // 合约类型 'result' | 'algorithm'（基于结果的合约 ｜ 基于算法的合约）
  walletAddress?: string // agent作者钱包地址
  isPledged?: boolean // 是否托管质押收益
}

interface FreeAgent extends BaseAgent {
  agentPayType: 'FREE'
}

// 按次收费agent
interface PayPerNumberAgent extends BaseAgent {
  agentPayType: 'PAY_PER_TASK'
  pricePerNumber: number // 每次执行价格
  minPrice: number // 最低价格
  maxPrice: number // 最高价格
}

// 人类雇佣模式
interface HumanBasedHiringModelAgent extends BaseAgent {
  agentPayType: 'HUMAN_BASED_HIRING'
  pricePerNumber: number // 每次执行价格
  monthlySalary: number // 月薪
  bonus: number // 月奖金
  expectedDuration: number // 期望时长/月
}

type Agent = FreeAgent | PayPerNumberAgent | HumanBasedHiringModelAgent
