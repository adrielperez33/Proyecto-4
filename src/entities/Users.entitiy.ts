import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './Orders.entitiy';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    example: 'b4f2e74d-8d2f-4c5a-b0e7-9c9a2f3dcd11',
    description: 'ID único del usuario',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del usuario',
  })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Correo electrónico del usuario',
  })
  @Column({ length: 50, unique: true })
  email: string;

  @ApiProperty({
    example: '********',
    description: 'Contraseña del usuario',
  })
  @Column({ length: 60 })
  password: string;

  @ApiProperty({
    example: 1234567890,
    description: 'Teléfono del usuario',
  })
  @Column('int')
  phone: number;

  @ApiProperty({
    example: 'Argentina',
    description: 'País del usuario',
  })
  @Column({ length: 50 })
  country: string;

  @ApiProperty({
    example: 'Calle falsa 123',
    description: 'Dirección del usuario',
  })
  @Column('text')
  address: string;

  @ApiProperty({
    example: 'Buenos Aires',
    description: 'Ciudad del usuario',
  })
  @Column({ length: 50 })
  city: string;

  @ApiProperty({
    type: [Order],
    description: 'Órdenes asociadas a este usuario',
  })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ApiProperty({
    example: false,
    description: 'Indica si el usuario es administrador',
  })
  @Column({ default: false })
  admin: boolean;
}
