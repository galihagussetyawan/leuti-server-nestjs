import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createReadStream, unlink } from "fs";
import { join } from "path";
import { ProductEntity } from "src/product/product.entity";
import { Repository } from "typeorm";
import { ImageEntity } from "./image.entity";

@Injectable()
export class ImageService {

    constructor(
        @InjectRepository(ImageEntity) private imageRepository: Repository<ImageEntity>,
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    ) { }

    async createImage(images: Array<Express.Multer.File>, productid: string) {

        let imageList = [];

        try {

            images.forEach(data => {

                const image = new ImageEntity();
                image.name = data.filename;
                image.mimetype = data.mimetype;
                image.path = data.path;

                imageList.push(image);
            })

            const product = await this.productRepository.findOne({
                where: { id: productid },
                relations: { images: true },
            })

            const imageSaved = await this.imageRepository.save(imageList);
            product.images = imageSaved;

            await this.productRepository.save(product);

            return imageSaved;

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }

    async deleteImageById(id: string) {

        try {

            const image = await this.imageRepository.findOneBy({ id });

            if (!image) {
                throw new NotFoundException('image not found');
            }

            await unlink(join(process.cwd(), image.path), (error) => {

                if (error) {
                    throw new BadRequestException(error.message);
                }

                this.imageRepository.delete({ id });
            })

        } catch (error) {

            throw new BadRequestException(error.message);

        }

    }

    async getImageByName(img: string) {

        const stream = createReadStream(join(process.cwd(), 'uploads/' + img));

        return stream;
    }

    async addImageToProduct(imageid: string, productid: string) {

        try {

            const image = await this.imageRepository.findOneBy({ id: imageid });
            const product = await this.productRepository.findOne({
                where: {
                    id: productid,
                },
                relations: {
                    images: true,
                }
            })

            product.images = [...product.images, await image];

            await this.productRepository.save(await product);

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }
}