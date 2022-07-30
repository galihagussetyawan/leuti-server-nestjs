import { RoleEntity } from "src/role/role.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToMany(() => RoleEntity)
    @JoinTable({
        name: 'user_role',
        joinColumn: {
            name: 'users',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'roles',
            referencedColumnName: 'id'
        }
    })
    role: RoleEntity[];
}