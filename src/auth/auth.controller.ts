import { Controller, Post, UseGuards, Request, Body } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() dto: { email: string; password: string; role?: string }) {
        return this.authService.register(dto);
    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    login(@Request() req: any) {
        return this.authService.login(req.user);
    }
}