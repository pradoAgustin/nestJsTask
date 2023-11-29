import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];
  transform(value: any) {
    console.log(value);
    value = value.toUpperCase();
    const indx = this.isStatusValid(value);
    if (indx == -1) {
      throw new BadRequestException(`${value} is not valid`);
    }
    return this.allowedStatuses[indx];
  }
  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx;
  }
}
