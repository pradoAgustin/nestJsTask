import { IsIn, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class TaskFilterDTO {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  status: TaskStatus;

  @IsString()
  @IsOptional()
  search: string;
}
