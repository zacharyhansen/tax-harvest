import { ConfigService } from '@nestjs/config'
import { envSchema } from '../env.schema'
import { fetchGCPSecrets } from './fetch-secrets'

export default async function getConfigService() {
  const config = new ConfigService()
  // If loading from local we dont get any extra env variables
  if (config.get('SECRET_SOURCE') === 'LOCAL') {
    return {}
  }

  console.info(`SECRET_SOURCE: ${config.get('SECRET_SOURCE')}`)
  console.info('Fetching GCP secrets')
  const secrets = await fetchGCPSecrets()
  return { ...envSchema.parse(secrets) }
}
