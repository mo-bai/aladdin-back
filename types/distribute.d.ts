// 枚举
export enum AgentStatus {
  READY = 'READY', // 准备就绪
  DOING = 'DOING', // 执行中
  COMPLETED = 'COMPLETED', // 已完成
  TIMEOUT = 'TIMEOUT', // 超时
  ERROR = 'ERROR', // 错误
}

// jobDistributionRecords 表
export interface JobDistributionRecord {
  id: number
  jobId: number
  jobName: string
  matchCriteria: any // 建议定义更具体的类型，如 { tags: string[]; category: string; skillLevel: string }
  totalAgents: number
  assignedCount: number
  responseCount: number
  assignedAgentId?: number
  assignedAgentName?: string
  jobDistributionAgents?: JobDistributionAgent[]
}

// jobDistributionAgents 表
export interface JobDistributionAgent {
  id: number
  jobDistributionId: number
  agentId: number
  agentStatus: AgentStatus
  result?: string
  assignedAt: Date
  createdAt: Date
  agent?: Agent // 可替换为 Agent 类型
  jobDistribution?: JobDistributionRecord
}
