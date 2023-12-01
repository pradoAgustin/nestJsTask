import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task-dto';
import { TaskFilterDTO } from './dto/task-filter.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTasks(
    @Query(ValidationPipe) taskFilterDTO: TaskFilterDTO,
  ): Promise<Task[]> {
    return this.taskService.getTasks(taskFilterDTO);
  }

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.deleteTaskById(id);
  }

  @Patch(':id/status')
  updateTaskStatusById(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTaskStatusDTO: UpdateTaskDTO,
  ) {
    return this.taskService.updateTaskStatusById(id, updateTaskStatusDTO);
  }
}
