import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task-dto';
import { TaskFilterDTO } from './dto/task-filter.dto';
import { stat } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskRepository } from './repository/task.repository';
@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}
  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id: id });
    if (!task) {
      new NotFoundException(`task with id: ${id} not found`);
    }
    return task;
  }

  async deleteTaskById(id: number): Promise<void> {
    const task = await this.taskRepository.delete({ id });
    if (!task) {
      throw new NotFoundException(`task with id: ${id} not found`);
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }
}
