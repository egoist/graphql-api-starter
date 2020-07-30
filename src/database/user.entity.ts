import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({
    unique: true,
  })
  email: string

  /**
   * User's display name
   */
  @Column()
  name: string

  /**
   * Auth provider, like `github` or `google`
   */
  @Column()
  provider: string

  @Column()
  providerId: string
}
