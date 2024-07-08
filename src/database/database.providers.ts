import { Sequelize } from 'sequelize-typescript';
import { Contact } from 'src/modules/identify/entities/contact.entity';
import { SEQUELIZE_PROVIDER } from './constants';

export const databaseProviders = [
  {
    provide: SEQUELIZE_PROVIDER,
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      });
      sequelize.addModels([Contact]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
