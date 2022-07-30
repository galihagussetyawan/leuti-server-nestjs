import { Controller, Get, HttpStatus, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";

@Controller('api')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Get('auth/signin')
    async signin(@Req() req: Request, @Res() res: Response) {
        const { username, password } = req.query;

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.authService.signin(username.toString(), password.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }
}