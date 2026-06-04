import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export class SwaggerConfig {
  static forRoot(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Bank Ledger System')
      .setDescription('a bank ledger system designed with ddd structure')
      .setVersion('v0.0.1')
      .addBearerAuth(this.swaggerAuthConfig(), 'Authorization')
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/swagger', app, swaggerDocument);
  }

  private static swaggerAuthConfig = (): SecuritySchemeObject => ({
    type: 'http',
    bearerFormat: 'JWT',
    in: 'header',
    scheme: 'bearer',
  });
}
