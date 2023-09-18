import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { NewTask, Task, UpdateTask } from '../../src/graphql.schema';
import { TaskValidator } from './task.validator';

@Resolver((of) => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query((returns) => Task)
  async task(@Args('id') id: string): Promise<Task> {
    const task = await this.taskService.findOne(id);
    if (!task) {
      throw new NotFoundException(id);
    }
    return task;
  }

  @Query((returns) => [Task])
  tasks(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Mutation('createTask')
  async create(@Args('input') args: NewTask): Promise<Task> {
    TaskValidator.validateNewRequest(args);

    return await this.taskService.create(args);
  }

  @Mutation('updateTask')
  async update(@Args('input') args: UpdateTask): Promise<Task> {
    TaskValidator.validateUpdateRequest(args);
    return this.taskService.update(args);
  }

  @Mutation('deleteTask')
  async delete(@Args('id') args: string): Promise<Task> {
    return this.taskService.delete(args);
  }
}
