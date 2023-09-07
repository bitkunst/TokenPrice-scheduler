import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as path from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
        return {
            type: 'mysql',
            host: this.configService.get('DB_HOST'),
            port: this.configService.get('DB_PORT'),
            username: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PWD'),
            database: this.configService.get('DATABASE_NAME'),
            entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
            synchronize: true, // for development mode
        };
    }
}
