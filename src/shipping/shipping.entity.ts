import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'shipping' })
export class ShippingEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'country' })
    country: string;

    @Column({ name: 'province' })
    province: string;

    @Column({ name: 'city' })
    city: string;

    @Column({ name: 'district' })
    district: string;

    @Column({ name: 'village' })
    village: string;

    @Column({ name: 'address' })
    address: string;

    @Column({ name: 'phone' })
    phone: string;

    @Column({ name: 'postalCode' })
    postalCode: string;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;
}