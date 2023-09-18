import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ScheduleModule,
    TaskModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      includeStacktraceInErrorResponses: false,
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
    }),
  ],
})
export class AppModule {}
