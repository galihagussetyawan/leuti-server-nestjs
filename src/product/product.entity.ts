import { ImageEntity } from "src/image/image.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'category' })
    category: string;

    @Column({ name: 'advantage', nullable: true })
    advantage: string;

    @Column({ name: 'application', nullable: true })
    application: string;

    @Column({ name: 'ingredient', nullable: true })
    ingredient: string;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;

    @ManyToMany(() => ImageEntity, { cascade: true })
    @JoinTable()
    images: ImageEntity[];
}