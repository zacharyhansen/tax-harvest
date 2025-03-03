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

  try {
    const secrets = await Promise.all([
      getSecret("DATABASE_NAME"),
      getSecret("DATABASE_HOST"),
      getSecret("DATABASE_PASSWORD"),
      getSecret("DATABASE_PORT"),
      getSecret("DATABASE_USER"),
      getSecret("GOOGLE_PROJECT"),
    ]);
    return secrets.reduce(
      (current, accumulator) => ({ ...accumulator, ...current }),
      {},
    );
  } catch (error) {
    throw error;
  }
};
