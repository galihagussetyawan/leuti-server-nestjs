import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { PrincipalDecorator } from "src/commons/decorators/principal.decorator";
import { RewardClaimService } from "./reward-claim.service";

@Controller('api')
export class RewardClaimController {

    constructor(
        private readonly rewardClaimService: RewardClaimService,
    ) { }

    @Post('reward/claim')
    @UseGuards(JwtAuthGuard)
    async createRewardClaim(@PrincipalDecorator() principal: any, @Req() req: Request, @Res() res: Response) {

        try {

            const { rewardid } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success claim reward',
                data: await this.rewardClaimService.createRewardClaim(principal.sub, rewardid.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }

    @Get('rewards/claim/all')
    async getAllRewardClaims(@Req() req: Request, @Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.rewardClaimService.getAllRewardClaims(),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('rewards/claim')
    async getRewardClaimsByUser(@Req() req: Request, @Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.rewardClaimService.getRewardClaimsByUser(),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }
}