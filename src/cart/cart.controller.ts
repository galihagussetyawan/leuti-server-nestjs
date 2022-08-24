import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { PrincipalDecorator } from "src/commons/decorators/principal.decorator";
import { CartEntity } from "./cart.entity";
import { CartService } from "./cart.service";

@Controller('api')
export class CartController {

    constructor(
        private cartService: CartService,
    ) { }

    @Post('cart')
    @UseGuards(JwtAuthGuard)
    async createCart(@PrincipalDecorator() principal: any, @Req() req: Request, @Res() res: Response, @Body() cartBody: CartEntity) {

        try {

            const { productid } = req.query;

            res.status(HttpStatus.CREATED).send({
                status: HttpStatus.CREATED,
                message: 'produk berhasil ditambahkan ke keranjang',
                data: await this.cartService.createCart(principal.sub, productid.toString(), cartBody),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('cart')
    @UseGuards(JwtAuthGuard)
    async getCartByUser(@PrincipalDecorator() principal: any, @Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.cartService.getCartByUser(principal.sub),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Put('cart')
    async updateCartById(@Req() req: Request, @Res() res: Response, @Body() cartBody: CartEntity) {

        try {

            const { id } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'cart berhasil diupdate',
                data: await this.cartService.updateCartById(id.toString(), cartBody),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })


        }
    }

    @Delete('cart')
    async deleteCartById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'cart berhasil dihapus',
                data: await this.cartService.deleteCartById(id.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }
}