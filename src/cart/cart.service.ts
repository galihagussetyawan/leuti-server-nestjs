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
                relations: {
                    discounts: true,
                }
            })

            if (!user) {
                throw new NotFoundException('user tidak ditemukan');
            }

            if (!product) {
                throw new NotFoundException('product tidak ditemukan');
            }

            if (cartBody.quantity < 1) {
                throw new BadRequestException('Minimum pembelian 1 items');
            }

            if (cartBody.quantity > product.stock) {
                throw new BadRequestException(`Produk tersisa ${product.stock}`);
            }

            //check discount product
            const cart = new CartEntity();
            const discount = product?.discounts?.filter(data => data?.quantity === Number(cartBody.quantity))[0];

            if (discount) {
                cart.discount = discount;
            } else {
                cart.discount = null;
            }

            cart.user = user;
            cart.quantity = cartBody?.quantity;
            cart.amount = product?.price * cartBody?.quantity;
            cart.product = product;
            cart.checkout = cartBody?.checkout;
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
                where: { user, visibility: true },
                relations: {
                    product: {
                        images: true,
                        discounts: true,
                    },
                    discount: true,
                }
            })

            return cart;

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async updateCartById(id: string, cartBody: CartEntity) {

        try {

            const cart = await this.cartRepository.findOne({
                where: { id },
                relations: {
                    product: {
                        discounts: true,
                    },
                    discount: true,
                }
            });

            if (cartBody?.quantity < 1) {
                throw new BadRequestException('Minimun pembelian 1 items');
            }

            if (cartBody?.quantity > cart?.product?.stock) {
                throw new BadRequestException(`Produk tersisa ${cart?.product?.stock}`);
            }

            const discount = cart?.product?.discounts?.filter(data => data?.quantity === Number(cartBody?.quantity))[0];

            if (discount) {
                cart.discount = discount;
            } else {
                cart.discount = null;
            }

            cart.quantity = cartBody?.quantity;
            cart.amount = cart?.product?.price * cartBody?.quantity;
            cart.updatedAt = Date.now().toString();

            return await this.cartRepository.save(cart);


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