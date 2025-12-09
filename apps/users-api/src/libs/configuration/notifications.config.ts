import {registerAs} from '@nestjs/config';
import z from 'zod';

const notificationsConfigSchema = z.object({
	emailEnabled: z.coerce.boolean().default(false),
});

export default registerAs('notifications', () =>
	notificationsConfigSchema.parse({
		emailEnabled: process.env.EMAIL_NOTIFICATION_ENABLED,
	}),
);

export type NotificationsConfig = z.infer<typeof notificationsConfigSchema>;
