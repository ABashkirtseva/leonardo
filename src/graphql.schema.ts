
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class NewSchedule {
    accountId: number;
    agentId: number;
    startTime: Date;
    endTime: Date;
}

export class UpdateSchedule {
    id: string;
    accountId: number;
    agentId: number;
    startTime: Date;
    endTime: Date;
}

export class NewTask {
    accountId: number;
    scheduleId: string;
    startTime: Date;
    duration: number;
    type: string;
}

export class UpdateTask {
    id: string;
    accountId: number;
    scheduleId: string;
    startTime: Date;
    duration: number;
    type: string;
}

export class Schedule {
    id: string;
    accountId: number;
    agentId: number;
    startTime: Date;
    endTime: Date;
}

export abstract class IQuery {
    abstract schedules(): Nullable<Schedule>[] | Promise<Nullable<Schedule>[]>;

    abstract schedule(id: string): Nullable<Schedule> | Promise<Nullable<Schedule>>;

    abstract tasks(): Nullable<Task>[] | Promise<Nullable<Task>[]>;

    abstract task(id: string): Nullable<Task> | Promise<Nullable<Task>>;
}

export abstract class IMutation {
    abstract createSchedule(input: NewSchedule): Schedule | Promise<Schedule>;

    abstract updateSchedule(input: UpdateSchedule): Nullable<Schedule> | Promise<Nullable<Schedule>>;

    abstract deleteSchedule(id: string): Nullable<Schedule> | Promise<Nullable<Schedule>>;

    abstract createTask(input: NewTask): Nullable<Task> | Promise<Nullable<Task>>;

    abstract updateTask(input: UpdateTask): Nullable<Task> | Promise<Nullable<Task>>;

    abstract deleteTask(id: string): Nullable<Task> | Promise<Nullable<Task>>;
}

export class Task {
    id?: Nullable<string>;
    accountId?: Nullable<number>;
    scheduleId?: Nullable<string>;
    startTime?: Nullable<Date>;
    duration?: Nullable<number>;
    type?: Nullable<string>;
}

type Nullable<T> = T | null;
