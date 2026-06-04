import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './configs/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { CatchAllErrorsFilter } from './common/filters/catch-all.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new CatchAllErrorsFilter());
  app.use(helmet());
  SwaggerConfig.forRoot(app);
  const PORT = process.env.PORT || 3003;
  await app.listen(PORT, () => {
    console.log(`application is running on http://localhost:${PORT}`);
    console.log(`swagger is running on http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
