import { AdonisMemcachedClientConfig } from '@ioc:Adonis/Addons/Adonis5-MemcachedClient'
import Env from '@ioc:Adonis/Core/Env'

const config: AdonisMemcachedClientConfig = {
  server: Env.get('MEMCACHED_SERVER_URL'),
}

export default config
