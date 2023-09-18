import { Injectable } from '@nestjs/common';
import { NewTask, Task, UpdateTask } from 'src/graphql.schema';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { TaskType } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll(): Promise<Task[]> {
    const result = await this.prisma.task.findMany({});

    return result || [];
  }

  async create(input: NewTask): Promise<Task> {
    const { scheduleId, ...paramWithoutScheduleId } = input;

    return await this.prisma.task.create({
      data: {
        id: uuidv4(),
        ...paramWithoutScheduleId,
        type: paramWithoutScheduleId.type as unknown as TaskType,
        schedule: {
          connect: {
            id: scheduleId,
          },
        },
      },
    });
  }

  async update(params: UpdateTask): Promise<Task> {
    const { id, scheduleId, ...paramsWithoutId } = params;

    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        ...paramsWithoutId,
        type: paramsWithoutId.type as unknown,
        schedule: {
          connect: {
            id: scheduleId,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Task> {
    return await this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
