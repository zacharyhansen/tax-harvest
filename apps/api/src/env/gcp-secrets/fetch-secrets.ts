import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { ConfigService } from "@nestjs/config";

export const fetchGCPSecrets = async () => {
  const client = new SecretManagerServiceClient();
  const config = new ConfigService();

  function getSecret(name: string) {
    return client
      .accessSecretVersion({
        name: `projects/${config.get("GOOGLE_PROJECT")}/secrets/${name}/versions/latest`,
      })
      .then(res => {
        const [response] = res;
        return { [name]: response.payload?.data?.toString() };
      });
  }

  const secrets = await Promise.all([
    getSecret("DATABASE_NAME"),
    getSecret("DATABASE_HOST"),
    getSecret("DATABASE_PASSWORD"),
    getSecret("DATABASE_PORT"),
    getSecret("DATABASE_USER"),
    getSecret("POLYGON_API_KEY"),
    getSecret("ETRADE_API_KEY"),
    getSecret("ETRADE_API_SECRET"),
    getSecret("GOOGLE_PROJECT"),
    getSecret("STRIPE_SECRET_KEY"),
    getSecret("PLAID_SECRET_KEY"),
    getSecret("PLAID_CLIENT_ID"),
    getSecret("CLERK_USER_UPDATE_CREATE_WEBHOOK_SIGN_SECRET"),
  ]);
  return secrets.reduce(
    (current, accumulator) => ({ ...accumulator, ...current }),
    {},
  );
};
