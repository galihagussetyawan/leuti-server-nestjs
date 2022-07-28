import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Controller('api')
export class UserController {

    constructor(private userService: UserService) { }

    @Post('user')
    async createUser(@Body() requestUser: UserEntity, @Res() res: Response) {

        try {

            res.status(HttpStatus.CREATED).send({
                status: HttpStatus.CREATED,
                data: await this.userService.createUser(requestUser)
            })

        } catch (error) {

            res.status(error?.response?.statusCode).send({
                status: error?.response?.statusCode,
                error_message: error?.message,
            })
        }
    }
}
