import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.userRepository.signUp(authCredentialsDTO);
  }

  async sigIn(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    const userName = await this.userRepository.validateUserPassword(
      authCredentialsDTO,
    );
    if (!userName) {
      throw new UnauthorizedException('invalid credentials');
    }
  }
}
