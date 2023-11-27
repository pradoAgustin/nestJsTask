import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task-dto';
import { TaskFilterDTO } from './dto/task-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTasks(@Query(ValidationPipe) taskFilterDTO: TaskFilterDTO): Task[] {
    if (Object.keys(taskFilterDTO).length) {
      return this.taskService.getTasksWithFilter(taskFilterDTO);
    } else {
      return this.taskService.getTasks();
    }
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string) {
    return this.taskService.deleteTaskById(id);
  }

  @Patch(':id/status')
  updateTaskStatusById(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTaskStatusDTO: UpdateTaskDTO,
  ) {
    return this.taskService.updateTaskStatusById(id, updateTaskStatusDTO);
  }
}
