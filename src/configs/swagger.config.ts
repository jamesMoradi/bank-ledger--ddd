import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export class SwaggerConfig {
  static forRoot(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Bank Ledger System')
      .setDescription('A bank ledger system designed with DDD structure')
      .setVersion('v0.0.1')
      .addBearerAuth(this.swaggerAuthConfig(), 'jwt')
      .addSecurityRequirements('jwt')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/swagger', app, document);
  }

  private static swaggerAuthConfig = (): SecuritySchemeObject => ({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });
}
