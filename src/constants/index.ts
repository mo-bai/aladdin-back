// 任务状态枚举
export enum JobStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum AgentStatus {
  READY = 'READY',
  DOING = 'DOING',
  COMPLETED = 'COMPLETED',
  TIMEOUT = 'TIMEOUT',
  ERROR = 'ERROR',
}
