import { Body, Controller, Delete, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
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

    @Get('user')
    async getUserById(@Req() req: Request, @Res() res: Response) {

        let { id } = req.query;

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.userService.getUserById(id.toString()),
            })

        } catch (error) {

            if (!id) {
                res.status(HttpStatus.BAD_REQUEST).send({
                    status: HttpStatus.BAD_REQUEST,
                    error_message: 'user id kosong'
                })
            }

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }

    @Delete('user')
    async deleteUserById(@Req() req: Request, @Res() res: Response) {

        const { id } = req.query;

        try {
            await this.userService.deleteUserById(id.toString());

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: 'success deleted',
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }
}
