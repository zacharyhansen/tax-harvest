import type { AuthConnection } from '@prisma/client';

export default abstract class ConnectionProvider {
	abstract sync({
		authConnection,
	}: {
		authConnection: AuthConnection;
	}): Promise<AuthConnection>;
}
