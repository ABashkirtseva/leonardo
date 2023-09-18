import { Injectable } from '@nestjs/common';
import { NewSchedule, UpdateSchedule, Schedule } from 'src/graphql.schema';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<Schedule | null> {
    return this.prisma.schedule.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll(): Promise<Schedule[]> {
    const result = await this.prisma.schedule.findMany({});

    return result || [];
  }

  async create(input: NewSchedule): Promise<Schedule> {
    return this.prisma.schedule.create({
      data: {
        id: uuidv4(),
        ...input,
      },
    });
  }

  async update(params: UpdateSchedule): Promise<Schedule> {
    const { id, ...params_without_id } = params;

    return this.prisma.schedule.update({
      where: {
        id,
      },
      data: {
        ...params_without_id,
      },
    });
  }

  async delete(id: string): Promise<Schedule> {
    return this.prisma.schedule.delete({
      where: {
        id,
      },
    });
  }
}
