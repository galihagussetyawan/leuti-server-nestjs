import { Body, Controller, Delete, HttpStatus, Post, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { DiscountEntity } from "./discount.entity";
import { DiscountService } from "./discount.service";

@Controller('api')
export class DiscountController {

    constructor(
        private discountService: DiscountService,
    ) { }

    @Post('discount')
    async addDiscountToProduct(@Req() req: Request, @Res() res: Response, @Body() requestDiscountBody: DiscountEntity) {

        try {

            const { productid } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'discount success added to product',
                data: await this.discountService.addDiscountToProduct(productid.toString(), requestDiscountBody),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }

    @Put('discount')
    async updateDiscountById(@Req() req: Request, @Res() res: Response, @Body() requstDiscountBody: DiscountEntity) {

        try {

            const { id } = req?.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success updated discount',
                data: await this.discountService.updateDiscountById(id?.toString(), requstDiscountBody),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Delete('discount')
    async deleteDiscountById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id } = req?.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success remove discount',
                data: await this.discountService.deleteDiscountById(id?.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }
}