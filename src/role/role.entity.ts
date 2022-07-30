import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'roles' })
export class RoleEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;
}