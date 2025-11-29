import {NestFactory} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AppModule} from "./app.module";

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

	await app.listen(PORT, () => {
		console.log(`API Gateway started on port ${PORT}`);
	});
}

bootstrap();
