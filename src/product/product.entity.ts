import { DiscountEntity } from "src/discount/discount.entity";
import { ImageEntity } from "src/image/image.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'products' })
export class ProductEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'price' })
    price: number;

    @Column({ name: 'stock' })
    stock: number;

    @Column({ name: 'description', type: 'longtext' })
    description: string;

    @Column({ name: 'category' })
    category: string;

    @Column({ name: 'advantage', nullable: true, type: 'longtext' })
    advantage: string;

    @Column({ name: 'application', nullable: true, type: 'longtext' })
    application: string;

    @Column({ name: 'ingredient', nullable: true, type: 'longtext' })
    ingredient: string;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;

    @Column({ name: 'active', default: true })
    status: boolean;

    @ManyToMany(() => ImageEntity, { cascade: true })
    @JoinTable()
    images: ImageEntity[];

    @OneToMany(() => DiscountEntity, (discount) => discount.product)
    discounts: DiscountEntity[];
}