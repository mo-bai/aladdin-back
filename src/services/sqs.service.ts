// src/services/sqs.service.ts
import { Injectable } from '@nestjs/common'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'

@Injectable()
export class SqsService {
  private client: SQSClient

  constructor() {
    this.client = new SQSClient({
      region: 'ap-northeast-1', // 例如 'ap-northeast-1'
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    })
  }

  async sendMessage(queueUrl: string, messageBody: any): Promise<void> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(messageBody),
      })
      await this.client.send(command)
    } catch (err: unknown) {
      const error = err as Error
      throw new Error(`发送SQS消息失败: ${error.message}`)
    }
  }
}
