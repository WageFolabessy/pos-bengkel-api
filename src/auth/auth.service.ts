import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if(user && (await bcrypt.compare(pass, user.password))){
        const {password, ...result} = user;
        return result;
    }

    return null;
  }

  async login(user: any){
    const payload = {username: user.username, sub: user.id, role: user.role};
    return {
        access_token: this.jwtService.sign(payload),
    };
  }
}
