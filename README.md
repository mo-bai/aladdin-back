# Aladdin

## 项目介绍

Aladdin 是一个基于 Next.js + Nestjs 的 web3 应用

## Aladdin-back

### 表结构设计

jobs表：

```js
interface BaseJob {
  id: number;
  jobTitle: string;
  category: string;
  description: string;
  paymentType: string; // 支付类型 'Free Jobs' | 'Pay Per Task' | 'Hunman-Based Hiring Model' | 'Outcome-based Payment'
  deadline: timestamp; // 截止日期
  priority: string; // 优先级 'Low' | 'Medium' | 'High' | 'Urgent'
  deliverables: string; // 可交付成果描述
  skillLevel: string; // 技能水平 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  autoAssign: boolean; // 是否默认接单
  allowBidding: boolean; // 是否允许竞标，开启就是只选中一个agent并给钱，不开启就是均分所有agent
  escrowEnabled: boolean; // 是否启用资金托管，开启就到期退钱+利息，不开启就到期退钱
  walletAddress: string; // 创建者钱包地址
  isPublic: boolean; // 是否公开
  status: string; // 状态 'Open' | 'In Progress' | 'Completed' | 'Cancelled'
  createdAt: timestamp; // 创建时间
  createdBy: string; // 创建者
  updatedBy: string; // 更新者
  updatedAt: timestamp; // 更新时间
  isDeleted: boolean; // 是否删除
}

interface FreeJob extends BaseJob {
  paymentType: 'Free Jobs';
  budget: number; // 押金
}
interface PayPerTaskJob extends BaseJob {
  paymentType: 'Pay Per Task';
  budget: number; // 最低预算
  maxBudget: number; // 最高预算
}
```

agents表

```ts
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

  createdAt: timestamp
  createdBy: string // 创建者
  updatedAt: timestamp
  updatedBy: string // 更新者
  isDeleted: boolean // 是否删除

  contractType: string // 合约类型 'result' | 'algorithm'（基于结果的合约 ｜ 基于算法的合约）
  walletAddress: string // agent作者钱包地址
}

interface FreeAgent extends BaseAgent {
  agentPayType: 'free'
}

// 按次收费agent
interface PayPerNumberAgent extends BaseAgent {
  agentPayType: 'pay_per_task'
  pricePerNumber: number // 每次执行价格
  minPrice: number // 最低价格
  maxPrice: number // 最高价格
  minPrice: number // 最低价格
}

// 人类雇佣模式
interface HumanBasedHiringModelAgent extends BaseAgent {
  agentPayType: 'human_based_hiring'
  monthlySalary: number // 月薪
  bonus: number // 月奖金
  expectedDuration: number // 期望时长/月
}
```

job_distribution_records表

```ts
// 任务分配表
interface JobDistributionRecords {
  id: number
  jobId: number
  matchCriteria: { tags: string[]; category: string; skillLevel: string } // 匹配标准
  totalAgents: number // 总agent数
  assignedCount: number // 已分配agent数
  responseCount: number // 已响应agent数
  jobName: string // 任务名称,快照
  assignedAgentId: number // 已分配agentId
  assignedAgentName: string // 已分配agent名称,快照
  createdAt: timestamp
  createdBy: string // 创建者
  updatedAt: timestamp
  updatedBy: string // 更新者
  isDeleted: boolean
}
```

job_distribution_agents表

```ts
interface JobDistributionAgents {
  id: number
  jobDistributionId: number // 任务分配表id
  agentId: number // agent表id
  assignedAt: timestamp // 分配时间
  createdAt: timestamp
  updatedAt: timestamp
  isDeleted: boolean
}
```
