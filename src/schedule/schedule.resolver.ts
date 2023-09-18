import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ScheduleService } from './schedule.service';
import {
  NewSchedule,
  Schedule,
  UpdateSchedule,
} from '../../src/graphql.schema';
import { ScheduleValidator } from './schedule.validator';

@Resolver((of) => Schedule)
export class ScheduleResolver {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Query((returns) => Schedule)
  async schedule(@Args('id') id: string): Promise<Schedule> {
    const schedule = await this.scheduleService.findOne(id);
    if (!schedule) {
      throw new NotFoundException(id);
    }
    return schedule;
  }

  @Query((returns) => [Schedule])
  schedules(): Promise<Schedule[]> {
    return this.scheduleService.findAll();
  }

  @Mutation('createSchedule')
  async create(@Args('input') args: NewSchedule): Promise<Schedule> {
    ScheduleValidator.validateNewRequest(args);

    return await this.scheduleService.create(args);
  }

  @Mutation('updateSchedule')
  async update(@Args('input') args: UpdateSchedule): Promise<Schedule> {
    ScheduleValidator.validateUpdateRequest(args);
    return this.scheduleService.update(args);
  }

  @Mutation('deleteSchedule')
  async delete(@Args('id') args: string): Promise<Schedule> {
    return this.scheduleService.delete(args);
  }
}
