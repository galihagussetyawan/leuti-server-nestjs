import { RoleEntity } from "src/role/role.entity";
import { UserDetailEntity } from "src/user-detail/user-detail.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ name: 'email', unique: true })
    email: string;

    @Column({ nullable: true })
    createdAt: string;

    @Column({ nullable: true })
    updatedAt: string;

    @ManyToMany(() => RoleEntity, {
        cascade: true,
    })
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

    @OneToOne(() => UserDetailEntity, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    userDetail: UserDetailEntity;
}