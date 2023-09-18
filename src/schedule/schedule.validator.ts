import { NewSchedule, UpdateSchedule } from '../../src/graphql.schema';
import { GraphQLError } from 'graphql/error';

export class ScheduleValidator {
  static validateNewRequest(request: NewSchedule) {
    ScheduleValidator.validateDates(request.startTime, request.endTime);
  }

  static validateDates(startTime: Date, endTime: Date) {
    const now = new Date();

    if (+new Date(startTime) <= +now) {
      throw new GraphQLError('Start date should be in the future');
    }

    if (+new Date(endTime) <= +new Date(startTime)) {
      throw new GraphQLError('End date should be greater than start date');
    }
  }

  static validateUpdateRequest(request: UpdateSchedule) {
    ScheduleValidator.validateDates(request.startTime, request.endTime);
  }
}
