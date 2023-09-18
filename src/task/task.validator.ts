import { NewTask, UpdateTask } from '../../src/graphql.schema';
import { GraphQLError } from 'graphql/error';

export class TaskValidator {
  static validateNewRequest(request: NewTask) {
    TaskValidator.validateDate(request.startTime);
  }

  static validateDate(startTime: Date) {
    const now = new Date();

    if (+new Date(startTime) <= +now) {
      throw new GraphQLError('Start date should be in the future');
    }
  }

  static validateUpdateRequest(request: UpdateTask) {
    TaskValidator.validateDate(request.startTime);
  }
}
