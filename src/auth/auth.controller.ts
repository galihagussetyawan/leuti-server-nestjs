import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { PrincipalDecorator } from "src/commons/decorators/principal.decorator";
import { Roles } from "src/role/decorator/roles.decorator";
import { RolesGuard } from "src/role/guard/roles.guard";
import { Role } from "src/role/role.enum";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";

class RequestSignin {
    username: string;
    password: string;
}

@Controller('api')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('auth/signin')
    async signin(@Body() requestSignin: RequestSignin, @Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'logged in successfully',
                data: await this.authService.signin(requestSignin.username, requestSignin.password),
            })

        } catch (error) {

            res.status(error.response.statusCode).send({
                status: error.response.statusCode,
                error_message: error.message,
            })

        }
    }

    @Get('/auth/agent')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.AGENT)
    async isAgent(@PrincipalDecorator() principal: any, @Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.authService.isAgent((principal.sub))
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message
            })
        }
    }

    @Get('/auth/admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async isAdmin(@Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: 'admin'
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message
            })
        }
    }
}