# 测试文档

## 📋 测试文件说明

我已经为你创建了完整的分类测试套件：

### 1. 基础 CRUD 测试

- **`test/agent.e2e-spec.ts`** - Agent 基础 CRUD 测试
- **`test/job.e2e-spec.ts`** - Job 基础 CRUD 测试

### 2. 分类测试 (新增)

- **`test/agent-types.e2e-spec.ts`** - 按 Agent 类型分类测试
- **`test/job-types.e2e-spec.ts`** - 按 Job 类型分类测试
- **`test/test-data-factory.ts`** - 测试数据工厂

## 🎯 Agent 分类测试

### **免费 Agent (FREE)**

- ✅ 创建/更新/删除免费 Agent
- ✅ 验证 `contractType: ALGORITHM`
- ✅ 验证 `autoAcceptJobs: true`
- ✅ 验证不包含付费字段 (`pricePerNumber`, `monthlySalary`)

### **按次收费 Agent (PAY_PER_TASK)**

- ✅ 创建/更新/删除付费 Agent
- ✅ 验证价格字段 (`pricePerNumber`, `minPrice`, `maxPrice`)
- ✅ 验证 `contractType: RESULT`
- ✅ 验证不包含雇佣字段 (`monthlySalary`, `bonus`)

### **人类雇佣 Agent (HUMAN_BASED_HIRING)**

- ✅ 创建/更新/删除人类 Agent
- ✅ 验证薪资字段 (`monthlySalary`, `bonus`, `expectedDuration`)
- ✅ 验证 `isPrivate: true` 和 `autoAcceptJobs: false`
- ✅ 验证不包含按次付费字段

### **Agent 过滤测试**

- ✅ 按支付类型过滤 (`agentPayType`)
- ✅ 按 Agent 类型过滤 (`agentType`)
- ✅ 按私有状态过滤 (`isPrivate`)
- ✅ 按自动接单状态过滤 (`autoAcceptJobs`)

## 🎯 Job 分类测试

### **免费任务 (FREE_JOBS)**

- ✅ 创建/更新/删除免费任务
- ✅ 验证押金字段 (`budget`)
- ✅ 验证 `autoAssign: true` 和 `allowBidding: false`
- ✅ 验证 `escrowEnabled: false`

### **按次付费任务 (PAY_PER_TASK)**

- ✅ 创建/更新/删除付费任务
- ✅ 验证预算范围 (`budget`, `maxBudget`)
- ✅ 验证 `allowBidding: true` 和 `escrowEnabled: true`
- ✅ 验证 `skillLevel: ADVANCED`

### **人工雇佣任务 (HUMAN_BASED_HIRING)**

- ✅ 创建/更新/删除人工任务
- ✅ 验证 `isPublic: false` 和 `skillLevel: EXPERT`
- ✅ 验证 `allowBidding: false` 和 `escrowEnabled: true`
- ✅ 验证长期项目特性

### **结果导向任务 (OUTCOME_BASED)**

- ✅ 创建/更新/删除结果任务
- ✅ 验证预算范围和竞标功能
- ✅ 验证 `category: AI训练` 和专家级要求

### **Job 状态管理**

- ✅ 状态流转 (`OPEN` → `IN_PROGRESS` → `COMPLETED`)
- ✅ 按状态查询任务
- ✅ 状态更新验证

### **Job 过滤测试**

- ✅ 按支付类型过滤 (`paymentType`)
- ✅ 按优先级过滤 (`priority`)
- ✅ 按技能等级过滤 (`skillLevel`)
- ✅ 按公开状态过滤 (`isPublic`)
- ✅ 组合多条件过滤

## 🚀 运行测试

### 1. 运行所有测试

```bash
npm run test:e2e
```

### 2. 运行基础 CRUD 测试

```bash
# Agent 基础测试
npm run test:e2e -- agent.e2e-spec.ts

# Job 基础测试
npm run test:e2e -- job.e2e-spec.ts
```

### 3. 运行分类测试 (新增)

```bash
# Agent 分类测试
npm run test:e2e -- agent-types.e2e-spec.ts

# Job 分类测试
npm run test:e2e -- job-types.e2e-spec.ts
```

### 4. 运行特定类型测试

```bash
# 只测试免费 Agent
npm run test:e2e -- agent-types.e2e-spec.ts -t "免费 Agent"

# 只测试付费任务
npm run test:e2e -- job-types.e2e-spec.ts -t "按次付费任务"
```
