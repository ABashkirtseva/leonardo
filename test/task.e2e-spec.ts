import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import {
  createSchedule,
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from './queries';
import { v4 as uuidv4 } from 'uuid';

const gql = '/graphql';

describe('GraphQL AppResolver (e2e) {Task}', () => {
  let app: INestApplication;
  let scheduleId;
  let id;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(gql, () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const theDayAfterTomorrow = new Date();
    theDayAfterTomorrow.setDate(theDayAfterTomorrow.getDate() + 2);

    const accountId = 123;
    const agentId = 223;

    describe('Happy Path schedule', () => {
      beforeAll(() => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: {
              accountId,
              agentId,
              startTime: tomorrow.toISOString(),
              endTime: theDayAfterTomorrow.toISOString(),
            },
            query: createSchedule,
          })
          .expect(200)
          .expect((res) => {
            scheduleId = res.body.data.createSchedule.id;
          });
      });

      it('should allow to add the task', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: {
              accountId,
              scheduleId,
              startTime: tomorrow.toISOString(),
              duration: 10,
              type: 'WORK',
            },
            query: createTask,
          })
          .expect(200)
          .expect((res) => {
            id = res.body.data.createTask.id;
            expect(res.body.data.createTask.accountId).toEqual(accountId);
            expect(res.body.data.createTask.scheduleId).toEqual(scheduleId);
            expect(res.body.data.createTask.startTime).toEqual(
              tomorrow.toISOString(),
            );
            expect(res.body.data.createTask.duration).toEqual(10);
            expect(res.body.data.createTask.type).toEqual('WORK');
          });
      });

      it('should get the tasks array', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({ query: getTasks })
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body.data.tasks)).toBeTruthy();
            expect(res.body.data.tasks).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id,
                }),
              ]),
            );
          });
      });

      it('should get the task by id', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: { id },
            query: getTask,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.task.id).toEqual(id);
          });
      });

      it('should allow to update schedule', () => {
        const newAccountId = 999;

        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: {
              id,
              accountId: newAccountId,
              scheduleId,
              startTime: tomorrow.toISOString(),
              duration: 10,
              type: 'WORK',
            },
            query: updateTask,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateTask.accountId).toEqual(newAccountId);
          });
      });

      it('should allow to remove by id', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: { id },
            query: deleteTask,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.deleteTask.id).toEqual(id);
          });
      });
    });

    describe('Task failures', () => {
      const id = uuidv4();

      it('should return error if start date is in the past: create()', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: {
              accountId,
              scheduleId,
              startTime: yesterday.toISOString(),
              duration: 10,
              type: 'WORK',
            },
            query: createTask,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toContain(
              'Start date should be in the future',
            );
          });
      });

      it('should return error if schedule id is unknown', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: {
              id,
              accountId,
              scheduleId: id,
              startTime: tomorrow.toISOString(),
              duration: 10,
              type: 'WORK',
            },
            query: updateTask,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toContain(
              "No 'Schedule' record(s)",
            );
          });
      });

      it('should return error if id is unknown', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: {
              id,
              accountId,
              scheduleId,
              startTime: tomorrow.toISOString(),
              duration: 10,
              type: 'WORK',
            },
            query: updateTask,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toContain(
              'Record to update not found.',
            );
          });
      });

      it('should return error if start date is in the past: (update)', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: {
              id,
              accountId,
              scheduleId,
              startTime: yesterday.toISOString(),
              duration: 10,
              type: 'WORK',
            },
            query: updateTask,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toContain(
              'Start date should be in the future',
            );
          });
      });

      it('should return error if id is unknown', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: {
              id,
            },
            query: deleteTask,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toContain(
              'Record to delete does not exist',
            );
          });
      });
    });
  });
});
