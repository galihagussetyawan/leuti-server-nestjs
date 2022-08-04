import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Roles } from "src/role/decorator/roles.decorator";
import { RolesGuard } from "src/role/guard/roles.guard";
import { Role } from "src/role/role.enum";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Controller('api')
export class UserController {

    constructor(private userService: UserService) { }

    @Post('user')
    async registerUser(@Body() requestUser: UserEntity, @Res() res: Response) {

        try {

            res.status(HttpStatus.CREATED).send({
                status: HttpStatus.CREATED,
                data: await this.userService.registerUser(requestUser)
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }

    @Get('users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async getAllUser(@Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.userService.getAllUser(),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }
}
