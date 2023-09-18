import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';

@Module({
  providers: [TaskResolver, TaskService],
  imports: [PrismaModule],
})
export class TaskModule {}
