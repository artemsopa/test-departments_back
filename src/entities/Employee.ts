import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'employees' })
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public salary: number;

  @Column()
  public currency: string;

  @Column()
  public department: string;

  @Column({ name: 'sub_department' })
  public subDepartment: string;

  @Column({ name: 'on_contract', default: false })
  public onContract: boolean;
}
