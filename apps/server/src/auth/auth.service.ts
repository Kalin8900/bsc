import { faker } from '@faker-js/faker';
import { AuthCreationException, PasswordNotMatchException, UserNotFoundException } from '@joinus/server/base';
import { LogError } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

import { UserCreateDto } from '../user';
import { User } from '../user/entities/user.entity';
import { UserEvents } from '../user/events/user.events';
import { UserService } from '../user/user.service';
import { TokenPayload } from './auth.types';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { Auth } from './entities/auth.entity';
import { AuthEvents } from './events/auth.events';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  public async validateOAuth(email: string, dto?: Partial<UserCreateDto>) {
    let user: User | null = null;

    try {
      user = await this.userService.getOneByEmail(email, ['auth']);
    } catch {
      user = await this.userService.create({
        firstName: faker.word.adjective(),
        lastName: faker.word.noun(),
        phone: faker.phone.number('+484########'),
        ...dto,
        email
      });
    }

    return user;
  }

  public async validateUser(emailOrPhone: string, password: string) {
    let user: User | null = null;

    if (emailOrPhone.includes('@')) {
      try {
        user = await this.userService.getOneByEmail(emailOrPhone, ['auth']);
      } catch {
        throw new UserNotFoundException([`User with email ${emailOrPhone} not found`]);
      }
    } else {
      try {
        user = await this.userService.getOneByPhone(emailOrPhone, ['auth']);
      } catch {
        throw new UserNotFoundException([`User with phone ${emailOrPhone} not found`]);
      }
    }

    const isMatch = compareSync(password, user.auth?.passwordHash ?? '');

    if (!isMatch) throw new PasswordNotMatchException(['Password is incorrect']);

    return user;
  }

  @LogError('Failed to register user')
  public async register(dto: AuthRegisterDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.save(this.userService.createInstance(dto.user));
      const auth = await queryRunner.manager.save(
        this.authRepository.create({
          uuid: user.uuid,
          passwordHash: hashSync(dto.password, 16),
          role: {
            id: 1,
            name: 'user'
          }
        })
      );

      await queryRunner.commitTransaction();

      this.eventEmitter.emit(UserEvents.Created, user);
      this.eventEmitter.emit(AuthEvents.Created, auth);

      return auth.clear();
    } catch (e: any) {
      await queryRunner.rollbackTransaction();
      throw new AuthCreationException(['Failed to insert user or auth', e?.message]);
    } finally {
      await queryRunner.release();
    }
  }

  public async login(uuid: string) {
    return this.accessToken({ uuid });
  }

  private accessToken(user: TokenPayload) {
    const payload: TokenPayload = {
      uuid: user.uuid
    };

    return this.jwtService.sign(payload, {
      expiresIn: '1h'
    });
  }

  public async getOne(uuid: string) {
    return this.authRepository.findOneByOrFail({ uuid });
  }

  public async updatePassword(uuid: string, password: string) {
    const auth = await this.getOne(uuid);
    auth.passwordHash = hashSync(password, 16);
    const saved = await this.authRepository.save(auth);

    this.eventEmitter.emit(AuthEvents.PasswordChanged, saved);

    return saved.clear();
  }

  public async delete(uuid: string) {
    const result = await this.authRepository.delete({ uuid });

    this.eventEmitter.emit(AuthEvents.Deleted, { uuid, delete: result });

    return result;
  }
}
