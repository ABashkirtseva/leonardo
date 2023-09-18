import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import {
  createSchedule,
  deleteSchedule,
  getSchedule,
  getSchedules,
  updateSchedule,
} from './queries';
import { v4 as uuidv4 } from 'uuid';

const gql = '/graphql';

describe('GraphQL AppResolver (e2e) {Schedule}', () => {
  let app: INestApplication;
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
      it('should allow to add the schedule', () => {
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
            expect(res.body.data.createSchedule.id).toBeDefined();
            id = res.body.data.createSchedule.id;
            expect(res.body.data.createSchedule.accountId).toEqual(accountId);
            expect(res.body.data.createSchedule.startTime).toEqual(
              tomorrow.toISOString(),
            );
            expect(res.body.data.createSchedule.endTime).toEqual(
              theDayAfterTomorrow.toISOString(),
            );
          });
      });

      it('should get the schedules array', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({ query: getSchedules })
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body.data.schedules)).toBeTruthy();
            expect(res.body.data.schedules).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id,
                }),
              ]),
            );
          });
      });

      it('should get the schedule by id', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: { id },
            query: getSchedule,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.schedule.id).toEqual(id);
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
              agentId,
              startTime: tomorrow.toISOString(),
              endTime: theDayAfterTomorrow.toISOString(),
            },
            query: updateSchedule,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateSchedule.accountId).toEqual(
              newAccountId,
            );
          });
      });

      it('should allow to remove by id', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: { id },
            query: deleteSchedule,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.deleteSchedule.id).toEqual(id);
          });
      });
    });

    describe('Schedule failures', () => {
      const id = uuidv4();

      it('should return error if start date is in the past: create()', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: {
              accountId,
              agentId,
              startTime: yesterday.toISOString(),
              endTime: theDayAfterTomorrow.toISOString(),
            },
            query: createSchedule,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toContain(
              'Start date should be in the future',
            );
          });
      });

      it('should return error if end date is less than startTime: create()', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: {
              accountId,
              agentId,
              startTime: tomorrow.toISOString(),
              endTime: yesterday.toISOString(),
            },
            query: createSchedule,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toContain(
              'End date should be greater than start date',
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
              agentId,
              startTime: tomorrow.toISOString(),
              endTime: theDayAfterTomorrow.toISOString(),
            },
            query: updateSchedule,
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
              agentId,
              startTime: yesterday.toISOString(),
              endTime: theDayAfterTomorrow.toISOString(),
            },
            query: updateSchedule,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toContain(
              'Start date should be in the future',
            );
          });
      });

      it('should return error if end date is less than startTime: update()', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            variables: {
              id,
              accountId,
              agentId,
              startTime: tomorrow.toISOString(),
              endTime: yesterday.toISOString(),
            },
            query: updateSchedule,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.errors[0].message).toContain(
              'End date should be greater than start date',
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
            query: deleteSchedule,
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
