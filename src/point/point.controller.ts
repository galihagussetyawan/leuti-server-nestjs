import { Controller, Get, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { PointService } from "./point.service";

@Controller('api')
export class PointController {

    constructor(
        private pointService: PointService,
    ) { }

    @Get('points')
    async getAllPoints(@Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.pointService.getAllPoints(),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }

    }

    @Post('point/add')
    async addPointByUser(@Req() req: Request, @Res() res: Response) {

        try {

            const { userid } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'berhasil menambahkan point',
                data: await this.pointService.addPointByUser(userid.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }
}