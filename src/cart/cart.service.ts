import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/product/product.entity";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { CartEntity } from "./cart.entity";

@Injectable()
export class CartService {

    constructor(
        @InjectRepository(CartEntity) private cartRepository: Repository<CartEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    ) { }

    async createCart(userid: string, productid: string, cartBody: CartEntity) {

        try {

            const user = await this.userRepository.findOneBy({ id: userid });
            const product = await this.productRepository.findOne({
                where: { id: productid },
            })

            if (!user) {
                throw new NotFoundException('user tidak ditemukan');
            }

            if (!product) {
                throw new NotFoundException('product tidak ditemukan');
            }

            if (cartBody.quantity > product.stock) {
                throw new BadRequestException(`Produk tersisa ${product.stock}`);
            }

            const cart = new CartEntity();
            cart.user = user;
            cart.product = product;
            cart.quantity = cartBody.quantity;
            cart.amount = product.price * cartBody.quantity;
            cart.checkout = cartBody.checkout;
            cart.createdAt = Date.now().toString();
            cart.updatedAt = Date.now().toString();

            return await this.cartRepository.save(cart);

        } catch (error) {

            if (error.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('product sudah ada di keranjang');
            }

            throw new BadRequestException(error.message);
        }
    }

    async getCartByUser(userid: string) {

        try {

            const user = await this.userRepository.findOneBy({ id: userid });

            if (!user) {
                throw new NotFoundException('user tidak ditemukan');
            }

            const cart = await this.cartRepository.find({
                where: { user },
                relations: {
                    product: true,
                }
            })

            return cart;

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async updateCartById(id: string, cartBody: CartEntity) {

        try {

            cartBody.updatedAt = Date.now().toString();

            return await this.cartRepository.update(id, cartBody);

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }

    async deleteCartById(id: string) {

        try {

            return await this.cartRepository.delete(id);

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }
}