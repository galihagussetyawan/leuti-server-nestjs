import { Body, Controller, Delete, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { PrincipalDecorator } from "src/commons/decorators/principal.decorator";
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
    async getAllUser(@Req() req: Request, @Res() res: Response) {

        try {

            const { page } = req?.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.userService.getAllUser(Number(page)),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('user')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.AGENT)
    async getUserById(@PrincipalDecorator() principal: any, @Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.userService.getUserById(principal.sub),
            })

        } catch (error) {

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

    @Get('users/search')
    async searchUserByIdOrUsername(@Req() req: Request, @Res() res: Response) {

        try {

            const { search } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.userService.searchUserByIdOrUsername(search.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }
}
