import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "src/cart/cart.entity";
import { ProductEntity } from "src/product/product.entity";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { OrderEntity } from "./order.entity";

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        @InjectRepository(CartEntity) private cartRepository: Repository<CartEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }

    async createOrderByUser(userid: string) {

        try {

            const user = await this.userRepository.findOneBy({ id: userid });
            const carts = await this.cartRepository.find({
                where: {
                    user
                },
                relations: {
                    product: true,
                }
            })

            // let total;
            // let cartList: CartEntity[];

            // carts.forEach(data => {

            //     const product: ProductEntity = data.product;

            // })

            const order = new OrderEntity();
            order.user = user;


        } catch (error) {

        }
    }
}