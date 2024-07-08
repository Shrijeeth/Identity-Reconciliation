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

@Table({ tableName: 'contacts' })
export class Contact extends Model<Contact> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    field: 'phone_number',
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
    field: 'linked_id',
    type: DataType.INTEGER,
    allowNull: true,
  })
  linkedId?: number;

  @Column({
    field: 'link_precedence',
    type: DataType.ENUM('primary', 'secondary'),
    allowNull: false,
  })
  linkPrecedence: 'primary' | 'secondary';

  @CreatedAt
  @Column({
    field: 'created_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    field: 'updated_at',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;

  @DeletedAt
  @Column({
    field: 'deleted_at',
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt: Date;
}
