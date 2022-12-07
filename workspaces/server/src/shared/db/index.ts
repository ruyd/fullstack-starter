import { Attributes, Model, ModelAttributes, ModelOptions, ModelStatic, Sequelize } from 'sequelize'
import migrator from './migrator'
import { config } from '../config'
import logger from '../logger'

export const commonOptions: ModelOptions = {
  timestamps: true,
  underscored: true,
}

export interface ModelConfig<M extends Model = Model> {
  name: string
  attributes: ModelAttributes<M, Attributes<M>>
  roles?: string[]
  unsecureRead?: boolean
  unsecure?: boolean
}

export class Connection {
  public static models: ModelStatic<Model>[]
  public static entities: ModelConfig[]
  public static db: Sequelize
  static initialized = false
  constructor() {
    const checkRuntime = config
    if (!checkRuntime) {
      throw new Error(
        'Connection Class cannot read config, undefined variable, either initConfig() not called or cyclical reference from config.ts',
      )
    }
    Connection.models = []
    Connection.entities = []
    Connection.db = new Sequelize(config.db.url, {
      logging: sql => (config.db.trace ? logger.info(`${sql}\n`) : undefined),
      ssl: !!config.db.ssl,
      dialectOptions: config.db.ssl
        ? {
            dialect: 'postgresql',
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    })
    Connection.initialized = true
  }
}

export const connection = new Connection()

/**
 * Defines db model, creates CRUD endpoints and swagger docs
 *
 * @param name - table name
 * @param attributes - columns definitions
 * @param unsecureRead - Set GET and LIST public (no token needed)
 * @param roles - restrict to roles like Admin
 * @returns
 */
export function addModel<T extends object>(
  name: string,
  attributes: ModelAttributes<Model<T>, Attributes<Model<T>>>,
  unsecureRead?: boolean,
  roles?: string[],
): ModelStatic<Model<T, T>> {
  const cfg = {
    name,
    attributes,
    unsecureRead,
    roles,
  }
  Connection.entities.push(cfg)
  const model = Connection.db.define<Model<T>>(cfg.name, cfg.attributes, commonOptions)
  const existing = Connection.models.find(m => m.name === model.name)
  if (!existing) {
    Connection.models.push(model)
  }
  logger.info(`Registered model ${model.name}`, Connection.models)
  return model
}

export async function createDatabase(): Promise<boolean> {
  logger.info('Database does not exist, creating...')
  const root = new Sequelize(config.db.url.replace(config.db.name, 'postgres'))
  const qi = root.getQueryInterface()
  try {
    await qi.createDatabase(config.db.name)
    logger.info('Database created: ' + config.db.name)
    await Connection.db.sync()
    logger.info('Tables created')
  } catch (e: unknown) {
    logger.warn('Database creation failed', e)
    return false
  }
  return true
}

export async function checkMigrations(): Promise<boolean> {
  const pending = await migrator.pending()
  if (pending.length > 0) {
    logger.info('Pending migrations', pending)

    try {
      const result = await migrator.up()
      logger.info('Migrations applied', result)
    } catch (e: unknown) {
      logger.error('Migration failed, reverting...', e)
      const down = await migrator.down()
      logger.info('Migrations reverted', down)

      return false
    }
  }
  return true
}

export async function checkDatabase(): Promise<boolean> {
  try {
    config.db.models = Connection.models.map(m => m.name)
    await Connection.db.authenticate()

    if (config.db.sync) {
      logger.info(
        `Database models: 
        ${Connection.models.map(a => a.name).join(', ')}`,
      )
      await Connection.db.sync({ alter: config.db.alter, force: config.db.force })
    }

    return true
  } catch (e: unknown) {
    const msg = (e as Error)?.message
    logger.error('Unable to connect to the database:', e)
    if (msg?.includes('does not exist')) {
      const result = await createDatabase()
      return result
    }
    if (msg?.includes('column')) {
      const result = await checkMigrations()
      return result
    }
  }
  return false
}

export default connection
