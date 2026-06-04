import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeormConfig } from './configs/typeorm.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TypeormConfig.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
