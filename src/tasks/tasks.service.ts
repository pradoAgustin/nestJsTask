import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task-dto';
import { TaskFilterDTO } from './dto/task-filter.dto';
import { stat } from 'fs';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(taskFilterDTO: TaskFilterDTO): Task[] {
    const { status, search } = taskFilterDTO;
    let tasksToFilter = this.getTasks();
    if (status) {
      tasksToFilter = tasksToFilter.filter((task) => task.status === status);
    }
    if (search) {
      tasksToFilter = tasksToFilter.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasksToFilter;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      new NotFoundException(`task with id: ${id} not found`);
    }
    return task;
  }

  deleteTaskById(id: string) {
    const foundedTask = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== foundedTask.id);
  }

  updateTaskStatusById(id: string, updateTaskStatusDTO: UpdateTaskDTO): Task {
    for (let task of this.tasks) {
      if (task.id === id) {
        task.status = updateTaskStatusDTO.status;
        console.log(updateTaskStatusDTO.status);
        console.log(task);
        return task;
      }
    }
    return null;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuidv4(),
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }
}
