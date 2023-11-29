import { IsIn } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDTO {
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  status: TaskStatus;
}
