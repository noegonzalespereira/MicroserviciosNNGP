import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Agenda {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombres!: string;

  @Column()
  apellidos!: string;

  @Column()
  fecha_nacimiento!: string;

  @Column()
  direccion!: string;

  @Column()
  celular!: string;

  @Column()
  correo!: string;
}
