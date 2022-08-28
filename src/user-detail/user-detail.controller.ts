import { Body, Controller, Get, HttpStatus, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { PrincipalDecorator } from "src/commons/decorators/principal.decorator";
import { UserDetailEntity } from "./user-detail.entity";
import { UserDetailService } from "./user-detail.service";

@Controller('api')
export class UserDetailController {

    constructor(private userDetailService: UserDetailService) { }

    @Put('user/detail')
    @UseGuards(JwtAuthGuard)
    async addUserDetailToUser(@PrincipalDecorator() principle: any, @Body() requestUserDetail: UserDetailEntity, @Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success add user detail',
                data: await this.userDetailService.addUserDetailToUSer(principle.sub, requestUserDetail),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Put('user/detail')
    async updateUserDetailByUser(@Req() req: Request, @Res() res: Response, @Body() requestUserDetail: UserDetailEntity) {

        try {

            const { id } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success updated detail user',
                data: await this.userDetailService.updateUserDetail(id.toString(), requestUserDetail),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }
}