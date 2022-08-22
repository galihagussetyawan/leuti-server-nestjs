import { BadRequestException, Controller, Delete, Get, HttpStatus, NotFoundException, Post, Req, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { existsSync } from "fs";
import { diskStorage } from "multer";
import * as path from "path";
import { join } from "path";
import { ImageService } from "./image.service";

@Controller('api')
export class ImageController {

    constructor(
        private imageService: ImageService,
    ) { }

    @Post('/image/upload')
    @UseInterceptors(FilesInterceptor('images', 3, {
        storage: diskStorage({
            destination: './uploads',
            filename(req, file, callback) {
                const filename: string = 'leuti-' + randomUUID();
                const extension: string = path.parse(file.originalname).ext;

                callback(null, `${filename}${extension}`);
            },
        }),
        fileFilter(req, file, callback) {

            const fileSize = parseInt(req.headers['content-length']);

            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {

                return callback(new BadRequestException('Only image files are allowed!'), false);
            }

            if (fileSize > 2000000) {
                return callback(new BadRequestException('image too large 3mb'), false);
            }

            callback(null, true);
        },
    }))
    async uploadImages(@UploadedFiles() images: Array<Express.Multer.File>, @Res() res: Response, @Req() req: Request) {

        try {

            const { productid } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'image success uploaded',
                data: await this.imageService.createImage(images, productid.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('image')
    async getImage(@Req() req: Request, @Res() res: Response) {

        try {

            const { img } = req.query;

            // await res.status(HttpStatus.OK).sendFile(img.toString(), { root: './uploads' });

            if (!existsSync(join(process.cwd(), 'uploads/' + img))) {
                throw new NotFoundException('image not found');
            }

            res.sendFile(join(process.cwd(), 'uploads/' + img));

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: 'image not found'
            })

        }
    }

    @Delete('image/delete')
    async deleteImageById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'image success deleted',
                data: await this.imageService.deleteImageById(id.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Post('image/add')
    async addImageToProduct(@Req() req: Request, @Res() res: Response) {

        try {

            const { imageid, productid } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'image berhasil ditambahkan ke product',
                data: await this.imageService.addImageToProduct(imageid.toString(), productid.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }
}