import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
        private configService: ConfigService
    ) { }

    async register(dto: { email: string; password: string; role?: string }) {
        const candidate = await this.usersService.findByEmail(dto.email);
        if (candidate) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }

        const hashPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({ ...dto, password: hashPassword });

        const { password, ...result } = user;
        return result;
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }

    login(user: { id: number; email: string; role?: string }) {
        const payload = { sub: user.id, email: user.email, role: user.role };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });

        return { access_token: accessToken, refresh_token: refreshToken };
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.usersService.findOne(payload.sub);
            if (!user) throw new UnauthorizedException();
            return this.login(user);
        } catch {
            throw new UnauthorizedException('Refresh token недействителен или истёк');
        }
    }
}