import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mssql',
        host: 'localhost',
        port: 1433,
        username: 'sa',
        password: '123456',
        database: 'TTTN_DongHoOnline',
        options: {
          trustServerCertificate: true, // Allow self-signed certificates
        },
        entities: [
            __dirname + 'src/modules/**/*.entity{.ts,.js}', //   /../**/*.entity{.ts,.js}
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];