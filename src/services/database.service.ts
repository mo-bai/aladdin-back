import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  // 读数据库连接（只读副本）
  private databaseClient: PrismaClient;

  async onModuleInit() {
    try {
      const databaseUrl = process.env.DATABASE_URL;
      const databaseUrlReplica = process.env.DATABASE_URL_REPLICA;
      if (!databaseUrl || !databaseUrlReplica) {
        throw new Error('数据库连接字符串获取失败');
      }
      this.databaseClient = new PrismaClient({
        datasourceUrl: databaseUrl,
      });
      this.databaseClient.$extends(
        readReplicas({
          url: databaseUrlReplica,
        }),
      );
      await this.databaseClient.$connect();
      console.log('数据库连接成功');
    } catch (error) {
      console.error('数据库连接失败', error);
      throw error;
    }
  }
  get client(): PrismaClient {
    if (!this.databaseClient) {
      throw new Error('数据库客户端尚未初始化');
    }
    return this.databaseClient;
  }

  async onModuleDestroy() {
    await this.databaseClient.$disconnect();
  }
}