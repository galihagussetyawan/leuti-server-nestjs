import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'images' })
export class ImageEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'mimetype' })
    mimetype: string;

    @Column({ name: 'path' })
    path: string;
}