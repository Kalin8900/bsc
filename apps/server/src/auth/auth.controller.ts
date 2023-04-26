import type { UserEntity } from '@joinus/domain';
import { LogRequest, Monitor, PasswordDto, Respond } from '@joinus/server/core';
import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { AccessCookie } from './auth.constants';
import { AuthService } from './auth.service';
import type { RequestWithUser } from './auth.types';
import { AuthGuard, AuthUser, AuthUuid } from './decorators';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthTokenDto } from './dto/auth-token.dto';
import { AuthDto } from './dto/auth.dto';
import { GithubGuard, GoogleGuard } from './guards';

@Controller('auth')
@ApiTags('Auth')
@LogRequest()
@Monitor()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Respond(AuthDto)
  register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

  @Get('login/github/callback')
  @UseGuards(GithubGuard)
  async authGithub(@Req() req: RequestWithUser, @Res() res: Response) {
    const accessToken = await this.authService.login(req.user.uuid);

    return res.cookie(AccessCookie, accessToken, { httpOnly: true }).status(201).json({ accessToken, user: req.user });
  }

  @Get('login/github')
  @UseGuards(GithubGuard)
  loginGithub() {
    return 'github';
  }

  @Get('login/google/callback')
  @UseGuards(GoogleGuard)
  async authGoogle(@Req() req: RequestWithUser, @Res() res: Response) {
    const accessToken = await this.authService.login(req.user.uuid);

    return res.cookie(AccessCookie, accessToken, { httpOnly: true }).status(201).json({ accessToken, user: req.user });
  }

  @Get('login/google')
  @UseGuards(GoogleGuard)
  loginGoogle() {
    return 'github';
  }

  @Post('login')
  @AuthGuard('basic')
  @Respond(AuthLoginDto, { noValidate: true })
  async login(@AuthUser() user: UserEntity, @Res() res: Response) {
    const accessToken = await this.authService.login(user.uuid);

    return res
      .cookie(AccessCookie, accessToken, { httpOnly: true })
      .status(201)
      .json({
        accessToken,
        user: {
          ...user,
          auth: undefined
        }
      });
  }

  @Patch('password')
  @AuthGuard('jwt')
  @Respond(AuthDto)
  updatePassword(@AuthUuid() uuid: string, @Body() { password }: PasswordDto) {
    return this.authService.updatePassword(uuid, password);
  }
}
