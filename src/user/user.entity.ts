import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ unique: true })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    createdAt: string;

    @Column({ nullable: true })
    updatedAt: string;
}