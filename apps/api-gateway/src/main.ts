
import { NestFactory } from '@nestjs/core';
import {RpcToHttpExceptionFilter} from "src/libs/exception-filters/rpc-to-http.exception-filter";
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	const PORT = process.env.PORT ?? 3000;

	const config = new DocumentBuilder()
		.setTitle('Edufy API Gateway')
		.setDescription('The Edufy API Gateway description')
		.setVersion('1.0')
		.addTag('edufy')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
  });
}
bootstrap();
