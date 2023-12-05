import { DataSource, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../task-status.enum';
import { Injectable } from '@nestjs/common';
import { TaskFilterDTO } from '../dto/task-filter.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(taskFilterDTO: TaskFilterDTO, user: User): Promise<Task[]> {
    const { status, search } = taskFilterDTO;
    console.log(status + ' ' + search);
    const query = this.createQueryBuilder('task');
    query.where('task.userId =:userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.status LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();

    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();

    delete task.user; // remove the user for the front-end (sensitive content)

    return task;
  }
}
