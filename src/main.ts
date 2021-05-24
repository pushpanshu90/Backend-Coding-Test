import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { initializeApp } from './Common/InitializeFirebaseApp';
import { ServiceAccount } from 'firebase-admin';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { serviceConfig } from './FirebaseConfig/firebase.config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const adminConfig: ServiceAccount = {
    projectId: serviceConfig.project_id,
    privateKey: serviceConfig.private_key,
    clientEmail: serviceConfig.client_email,
  };
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });
  await initializeApp();
  app.enableCors();

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Blog Service')
    .setDescription('Nestjs-Firebase-Postgres')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
