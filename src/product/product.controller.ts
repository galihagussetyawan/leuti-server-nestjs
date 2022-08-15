import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { ProductEntity } from "./product.entity";
import { ProductService } from "./product.service";

@Controller('api')
export class ProductController {

    constructor(
        private productService: ProductService,
    ) { }

    @Post('product')
    async createProduct(@Req() req: Request, @Res() res: Response, @Body() productBody: ProductEntity) {

        try {

            res.status(HttpStatus.CREATED).send({
                status: HttpStatus.CREATED,
                message: 'produk berhasil ditambahkan',
                data: await this.productService.createProduct(productBody),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('products')
    async getAllProducts(@Req() req: Request, @Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.productService.getAllProducts(),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('product')
    async getProductById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.productService.getProductById(id.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Put('product')
    async updateProduct(@Req() req: Request, @Res() res: Response, @Body() productBody: ProductEntity) {

        try {

            const { id } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'product berhasil di update',
                data: await this.productService.updateProductById(id.toString(), productBody),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Delete('product')
    async deleteProductById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'product berhasil di hapus',
                data: await this.productService.deleteProductById(id.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }

    }
}