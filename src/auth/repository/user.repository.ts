import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { AuthCredentialsDTO } from '../dto/auth-credentials.dto';
import { AuthErrorCodes } from '../auth-error-codes.enum';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    const { userName, password } = authCredentialsDTO;

    const user = new User();
    user.userName = userName;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      if (error.code === AuthErrorCodes.DUPLICATE_KEY) {
        throw new ConflictException('user name already exists, try another');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<string> {
    const { userName, password } = authCredentialsDTO;
    const user = await this.findOneBy({ userName: userName });
    if (user && (await user.validatePassword(password))) {
      return user.userName;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
