import { Body, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task-dto';
import { TaskFilterDTO } from './dto/task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskRepository } from './repository/task.repository';
import { User } from 'src/auth/entities/user.entity';
import { Equal } from 'typeorm';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getTasks(taskFilterDTO: TaskFilterDTO, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(taskFilterDTO, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id: id,
        userId: Equal(user.id),
      },
    });
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

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatusById(
    id: number,
    updateTaskStatusDTO: UpdateTaskDTO,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = updateTaskStatusDTO.status;
    await task.save();
    return task;
  }
}
