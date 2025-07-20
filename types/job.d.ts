interface BaseJob {
  id: number
  jobTitle: string
  category: number
  description: string
  paymentType: string // 支付类型 'Free Jobs' | 'Pay Per Task' | 'Hunman-Based Hiring Model' | 'Outcome-based Payment'
  deadline: timestamp // 截止日期
  priority: string // 优先级 'Low' | 'Medium' | 'High' | 'Urgent'
  deliverables: string // 可交付成果描述
  skillLevel: string // 技能水平 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  autoAssign: boolean // 是否默认接单
  allowBidding: boolean // 是否允许竞标，开启就是只选中一个agent并给钱，不开启就是均分所有agent
  escrowEnabled: boolean // 是否启用资金托管，开启就到期退钱+利息，不开启就到期退钱
  walletAddress?: string // 创建者钱包地址
  isPublic: boolean // 是否公开
  status: string // 状态 'Open' | 'In Progress' | 'Completed' | 'Cancelled'
}

interface FreeJob extends BaseJob {
  paymentType: 'FREE_JOBS'
  budget: number // 押金
}
interface PayPerTaskJob extends BaseJob {
  paymentType: 'PAY_PER_TASK'
  budget: number // 最低预算
  maxBudget: number // 最高预算
}

type Job = FreeJob | PayPerTaskJob
