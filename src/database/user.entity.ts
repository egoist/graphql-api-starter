import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  email: string

  @Column({ nullable: true })
  passwordHash?: string

  /**
   * User's full name
   */
  @Column()
  name: string
}
