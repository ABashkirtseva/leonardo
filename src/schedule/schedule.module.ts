import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ScheduleService } from './schedule.service';
import { ScheduleResolver } from './schedule.resolver';

@Module({
  providers: [ScheduleResolver, ScheduleService],
  imports: [PrismaModule],
})
export class ScheduleModule {}
