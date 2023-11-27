import { IsIn, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task.model';

export class TaskFilterDTO {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  status: TaskStatus;

  @IsString()
  @IsOptional()
  search: string;
}
