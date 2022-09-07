import { DiscountEntity } from "src/discount/discount.entity";
import { ProductEntity } from "src/product/product.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'carts' })
export class CartEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'quantity' })
    quantity: number;

    @Column({ name: 'amount' })
    amount: number;

    @Column({ name: 'isCheckout', default: true })
    checkout: boolean;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;

    @Column({ name: 'visibility', default: true })
    visibility: boolean;

    @ManyToOne(() => UserEntity, { lazy: true, cascade: true })
    user: UserEntity;

    @ManyToOne(() => ProductEntity, { cascade: true })
    product: ProductEntity;

    @ManyToOne(() => DiscountEntity)
    discount: DiscountEntity;
}