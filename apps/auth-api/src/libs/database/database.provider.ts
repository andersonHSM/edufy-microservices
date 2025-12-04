import {FactoryProvider, Logger, Scope} from '@nestjs/common';
import databaseConfig, {DatabaseConfig,} from '@src/libs/configuration/database.config';
import {CamelCasePlugin, Kysely, ParseJSONResultsPlugin, PostgresDialect,} from 'kysely';
import {Pool} from 'pg';
import {DATABASE} from './constants';
import {DB} from './generated/db';

export const databaseProvider: FactoryProvider = {
	provide: DATABASE,
	useFactory(config: DatabaseConfig) {
		const logger = new Logger('Kysely');
		return new Kysely<DB>({
			dialect: new PostgresDialect({
				pool: new Pool({
					connectionString: config.url,
				}),
			}),
			plugins: [
				new CamelCasePlugin({
					underscoreBeforeDigits: true,
				}),
				new ParseJSONResultsPlugin(),
			],
			log: (event) => {
				if (event.level === 'error') {
					logger.error(event.error);
				} else {
					const context = {
						parameters: event.query.parameters,
					};
					logger.log(
						`[Kysely] [duration=${event.queryDurationMillis}] - ${event.query.sql}`,
						context,
					);
				}
			},
		});
	},
	inject: [databaseConfig.KEY],
	scope: Scope.DEFAULT,
};
