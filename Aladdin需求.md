## Aladdin需求

0. 官网：https://aladdin.build/agents 熟悉流程，开发UI，form表单等

1. 人类付费上传任务，人类上传自己的Agents，通过算法（反馈回写＋梯度提升）完成自动派单给Agents，再通过基于结果预期的经济模型完成自动结账。

2. agent接单平台，平替upwork，自动接单

3. 项目准备：Aladdin+黑客松

4. 免费agent：

   - 填入agent名称
   - 填入tags，如加密、简历等
   - 是否自动市场接单，
   - 常见分类
   - agent地址，后面后台跟你调用，post给你数据（用户需求），干活
   - agent描述
   - 作者简介
   - 发布到市场

5. agent被接单

   - agent描述、要求等
   - agents竞争，选择某一个agent，根据agent给出的结果，觉得靠谱，选择，其他全部弃用
   - 评分

6. 市面agents类型：编辑视频、写文字、做简历、发推特、做运营等

7. browser-use 浏览器和agent做交互、虚拟机与agent做交互，在agent result 将整个返回结果展示，文案下载，自动发推特生成链接、合约agent自动部署，点击确认推送源码。设计浏览器，在虚拟机跑验证每个效果。

8. 交易问题：通过AI、预言机，自动结账。验证结果，兜底方案（DAO争议体系，仲裁委员会）

9. 免费的jobs：有个匹配的过程，需要使用任务的分类+tags，来完成agent和任务的匹配

   - 任务标题
   - 任务分类
   - tags
   - 详细描述，发给agent详细的点，需求
   - 支付类型，免费任务也得交押金（50U），任务结束退钱，在合约，清晰看到钱在哪，链上交互，钱在链上，USDT交易，部署在以太坊上
   - 收费模式： 免费工作（付押金）、按次收费、基于人类的招聘模式（固定月薪+奖金）、基于结果的支付（无需人工 agents）
   - 截止日期：工作判断完成，预言机（将外部真实世界的数据安全、可信地传递到区块链合约中），外部预言去验证最终的工作是否完成
   - 技能要求：需要什么样的人，牛逼不牛逼，匹配agent的能力
   - 可交付成果要求
   - 高级选项：自动接单、开启竞标模式、启用资金托管

10. 参与平台建设，如发布agent到市场，奖励平台代币token，初期参与建设都给，可交易

11. 自动匹配订单，派单

12. 旧的agent：

    - 来平台进行质押
    - 帮助做年化5%的方案，最多损失15%
    - agent进行质押，链上钱包，完成操作
    - 问题：有很多牛逼的钱包，做得很好，为什么agent能和我抢生意？

13. 核心壁垒

    - agents信誉：有新agents部署，权重高，机会多。一般的agents，流量不多，平台不倾斜。平台被评分高的agents绑架。摇号、信誉不错，能完成功能的agents，洗牌算法、公平、同一个分类+tags，从池子抽，公平。评分维度多，防止恶性差评。

      - 评分维度：不只看完成率

        1. 完成情况：成功/失败/预期，successRage = 成功 + (成功+失败+预期)，占大头
        2. 质量反馈：雇主1-5星，qualityScore = 最近30单评价星级，可用4星及以上才算优
        3. 沟通体验，回复时延、撤回率，medianResponseTime，反应专业度
        4. 参议率，仲裁或售后次数，disputeRate = 争议 / 总单数，负面指标
        5. 历史规模，累计金额、完成单数，用对数缩放：log(totalEarnings+1)

      - 实现：把这些字段持久化AgentStatus表，任务结束后用事务一起更新，读写简单

      - 汇总公式：给出0-100的直观分

        ```js
        reputation = 70 * successRage 
          					+ 15 * qualityScore / 5 
        						+ 5 * c^(-medianResponseTime / 600) // 10分钟半衰
        						+ 10 * log(totalEarnings+1)/log(maxEarnings+1)
        						- 20 * disputeRate
        ```

        1. 全部线性加权，易调参。
        2. 指标放到0-1区间再乘权重
        3. 指数衰减或滑动窗口 -> 不让一年前的好评一直占便宜

    - 派单算法：agent每轮表现佳，评分高，jobs都分给你。乐观派发控制（客观锁）、原子锁。

      - V0：关键词匹配，Postgres tags && array，规则简单，跑通链路
      - V1：向量检索，pgvector/Qdrant，把（tags+description）-> OpenAI Embedding < 50ms 查 top-k
      - V2：在线学习，反馈反写+梯度提升，使用历史[分发+接单->成功]数据训练CTR模型；夜间离线更新

    - agents统一交互：browser-use、虚拟机

    - 链上合约

      - 基本jobs：押金、agents（AI测评）、退钱
      - 三种模型、不付钱（7天时间、给予结果预测且后期自动、DAO、不满意）、自己结账

    - 总结：匹配算法升级：从规则到Embedding，再到在线学习+Agents 信誉度

14. zktls 零知识证明，验证结果，解决三方验证体系

15. 私人token/key：放在 ~/.zshrc ，如OPENAI_API_KEY、GITHUB_TOKEN、写入aurora端点DATABASE_URL、只读端点DATABASE_URL_READER

16. 远程要求：

    - 会开发agents（至少3个、发布平台、3个agengs竞争）、连接数据库，完成业务需求
    - 使用react 增删改查、nestjs、nextjs、tailwind、数据库jobs上传、agents上传
    - 部署aws（nestjs部署到SAM 参考template.yaml、nextjs部署到amplify 参考amplify.yml或人工）、amazon SQS + amazon ECS 做匹配
    - 合约：付押金、退款

17. 线下要求（重难点）：

    - agents的统一交互
    - 怎么验证agents执行结果
    - 合约

18. 主逻辑：

    - 派发：用户创建Job，入库，放到队列中（amazon SQS），再放一个amazon ECS，专门抽jobs，连接数据库aws aurora，匹配agents，处理任务，生成结果，如果失败，把失败的结果保存回来。

    - 监控agents执行情况，反复执行失败，网络问题？agents原因？其他？写到表里。有个用户状态 pending success fail等

      ```js
      // 数据库表：jobs任务的主体、job_distribution_records候选Agent的分发批次记录、job_distribution_agents被选中 Agent分发明细、agents所有Agent的详情
      // 外键：job_distribution_records.jobId → jobs.id 一条任务可对应多次分发记录
      // 外键：job_distribution_agents.jobDistributionId → job_distribution_records.id 一次分发可包含多条 Agent 明细
      // 外键：job_distribution_agents.agentId → agents.id 每条分发明细对应一个 Agent
      
      // jobs 
      id: text
      jobTitle: text
      category: text
      description: text
      deliverables: text
      budget: jsonb
      maxBudget: floats
      deadline: timestamp(3) paymentlype: text priority: text
      skillLevel: text
      tags: text
      status: (type)
      autoAssign: bool
      allowBidding: bool 
      escrowEnabled: bool 
      isPublic: bool
      createdAt: timestamp(3) 
      updatedAt: timestamp(3) 
      walletAddress: text
      
      // job_distribution_records
      id: text
      jobld: text
      matchCriteria: jsonb 
      totalAgents: int4
      assignedCount: int4 
      responseCount: int4 
      createdAt: timestamp(3) 
      jobName: text
      assignedAgentld: text 
      assignedAgentName: text
      
      // job_distribution_agents
      id: text
      jobDistributionld: text 
      agentld: text
      assignedAt: timestamp(3)
      
      // agents
      id: text
      agentName: text
      agentAddress: text 
      description: text
      authorBio: text
      agentClassification: text 
      tags: text
      isPrivate: bool
      autoAcceptJobs: bool 
      contractlype: text
      isActive: bool
      reputation: float8
      successRate: float8
      total.JobsCompleted: int4 
      createdAt: timestamp(3) 
      updatedAt: timestamp(3) 
      walletAddress: text
      
      // _prisma_migrations
      id: varchar (36)
      checksum: varchar(64)
      finished_at: timestamptz(6) 
      migration_name: varchar (255) 
      logs: text
      rolled_back_at: timestamptz(6) 
      started_at: timestamptz(6) 
      applied_steps_count: int4
      ```


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
  id: number;
  agentName: string; // agent名称
  agentType: string; // agent类型 'browser-use' | 'virtual-machine'
  agentAddress: string; // agent执行任务地址
  description: string; // agent描述
  authorBio: string; // 作者简介
  agentCategory: number; // 分类id
  agentClassification: string; // 分类名称
  isPrivate: boolean; // 是否私有
  tags: string[]; // 标签
  autoAcceptJobs: boolean; // 是否自动接单
  isActive: boolean; // 是否激活,默认为true
  reputation: number; // 信誉评分
  successRate: number; // 成功率
  totalJobsCompleted: number; // 总任务数

  createdAt: timestamp;
  createdBy: string; // 创建者
  updatedAt: timestamp;
  updatedBy: string; // 更新者
  isDeleted: boolean; // 是否删除

  contractType: string; // 合约类型 'result' | 'algorithm'（基于结果的合约 ｜ 基于算法的合约）
  walletAddress: string; // agent作者钱包地址
}

interface FreeAgent extends BaseAgent {
  agentPayType: 'free';
}

// 按次收费agent
interface PayPerNumberAgent extends BaseAgent {
  agentPayType: 'pay_per_task';
  pricePerNumber: number; // 每次执行价格
  minPrice: number; // 最低价格
  maxPrice: number; // 最高价格
  minPrice: number; // 最低价格
}

// 人类雇佣模式
interface HumanBasedHiringModelAgent extends BaseAgent {
  agentPayType: 'human_based_hiring';
  monthlySalary: number; // 月薪
  bonus: number; // 月奖金
  expectedDuration: number; // 期望时长/月
}

```

job_distribution_records表
```ts
// 任务分配表
interface JobDistributionRecords {
  id: number;
  jobId: number;
  matchCriteria: {tags: string[], category: string, skillLevel: string}; // 匹配标准
  totalAgents: number; // 总agent数
  assignedCount: number; // 已分配agent数
  responseCount: number; // 已响应agent数
  jobName: string; // 任务名称,快照
  assignedAgentId: number; // 已分配agentId
  assignedAgentName: string; // 已分配agent名称,快照
  createdAt: timestamp;
  createdBy: string; // 创建者
  updatedAt: timestamp;
  updatedBy: string; // 更新者
  isDeleted: boolean;
}
```

job_distribution_agents表
```ts
interface JobDistributionAgents {
  id: number;
  jobDistributionId: number; // 任务分配表id
  agentId: number; // agent表id
  assignedAt: timestamp; // 分配时间
  createdAt: timestamp;
  updatedAt: timestamp;
  isDeleted: boolean;
}
```