import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { RewardEntity } from "./reward.entity";
import { RewardService } from "./reward.service";

@Controller('api')
export class RewardController {

    constructor(
        private rewardService: RewardService
    ) { }

    @Post('reward')
    async createReward(@Res() res: Response, @Body() requestRewardBody: RewardEntity) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success create reward',
                data: await this.rewardService.createReward(requestRewardBody),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Put('reward')
    async updateRewardById(@Req() req: Request, @Res() res: Response, @Body() requestRewardBody: RewardEntity) {

        try {

            const { id } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success update reward',
                data: await this.rewardService.updateRewardById(id.toString(), requestRewardBody),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Delete('reward')
    async deleteRewardById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success delete reward',
                data: await this.rewardService.deleteRewardById(id.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('rewards')
    async getAllRewards(@Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.rewardService.getAllRewards(),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }
}