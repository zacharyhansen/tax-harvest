import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { ConfigService } from '@nestjs/config'

export async function fetchGCPSecrets() {
  const client = new SecretManagerServiceClient()
  const config = new ConfigService()

  function getSecret(name: string) {
    return client
      .accessSecretVersion({
        name: `projects/${config.get('GOOGLE_PROJECT')}/secrets/${name}/versions/latest`,
      })
      .then((res) => {
        const [response] = res
        return { [name]: response.payload?.data?.toString() }
      })
      .catch((error) => {
        console.error(`Error fetching secret ${name}:`, error)
        return { [name]: undefined }
      })
  }

  const secrets = await Promise.all([
    getSecret('DATABASE_NAME'),
    getSecret('DATABASE_HOST'),
    getSecret('DATABASE_PASSWORD'),
    getSecret('DATABASE_PORT'),
    getSecret('DATABASE_USER'),
    getSecret('POLYGON_API_KEY'),
    getSecret('ETRADE_API_KEY'),
    getSecret('ETRADE_API_SECRET'),
    getSecret('GOOGLE_PROJECT'),
    getSecret('STRIPE_SECRET_KEY'),
    getSecret('PLAID_SECRET_KEY'),
    getSecret('PLAID_CLIENT_ID'),
    getSecret('CLERK_USER_UPDATE_CREATE_WEBHOOK_SIGN_SECRET'),
  ]).catch((error) => {
    console.error('Error fetching secrets in promise all:', error)
    throw error
  })

  return secrets.reduce(
    (current, accumulator) => ({ ...accumulator, ...current }),
    {},
  )
}
