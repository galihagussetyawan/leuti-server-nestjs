import { ProductEntity } from "src/product/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'discount' })
export class DiscountEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'quantity' })
    quantity: number;

    @Column({ name: 'item' })
    item: number;

    @Column({ name: 'addOns', nullable: true })
    addOns: string;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;

    @ManyToOne(() => ProductEntity, (product) => product.discounts)
    product: ProductEntity;
}