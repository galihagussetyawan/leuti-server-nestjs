import { Controller, Delete, Get, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { SponsorService } from "./sponsor.service";

@Controller('api')
export class SponsorController {

    constructor(
        private readonly sponsorService: SponsorService,
    ) { }

    @Post('sponsor')
    async createSponsor(@Req() req: Request, @Res() res: Response) {

        const { userid, userdownlineid } = req.query;

        res.send({
            data: await this.sponsorService.createSponsorDownline(userid.toString(), userdownlineid.toString()),
        })
    }

    @Post('sponsor/add')
    async addSponsorDownlineById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id, userdownlineid } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success add downline agent',
                data: await this.sponsorService.addSponsorDownlineById(id.toString(), userdownlineid.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }

    @Delete('sponsor')
    async removeSponsorDownlineById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id, userdownlineid } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success remove downline agent',
                data: await this.sponsorService.removeSponsorDownlineById(id.toString(), userdownlineid.toString()),
            })


        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('sponsors')
    async getAllSponsors(@Res() res: Response) {

        res.send({
            data: await this.sponsorService.getAllSponsors(),
        })
    }

    @Get('sponsor/tracking')
    async getTestTractingUser(@Req() req: Request, @Res() res: Response) {

        const { userid } = req.query;

        res.send({
            data: await this.sponsorService.testTrackingUser(userid.toString()),
        })
    }
}