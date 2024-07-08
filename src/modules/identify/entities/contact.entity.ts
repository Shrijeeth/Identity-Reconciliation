import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

@Table
export class Contact extends Model<Contact> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email?: string;

  @ForeignKey(() => Contact)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  linkedId?: number;

  @Column({
    type: DataType.ENUM('primary', 'secondary'),
    allowNull: false,
  })
  linkPrecedence: 'primary' | 'secondary';

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt?: Date;
}
