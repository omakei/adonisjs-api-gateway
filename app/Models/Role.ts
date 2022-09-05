import { DateTime } from 'luxon'
import {
  afterDelete,
  afterSave,
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Permission from './Permission'
import Cache from '@ioc:Adonis/Addons/Cache'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string | null

  @manyToMany(() => Permission, {
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'permission_id',
    pivotTable: 'role_permissions',
  })
  public permissions: ManyToMany<typeof Permission>

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'user_roles',
  })
  public users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterSave()
  public static async afterSaveHook() {
    await Cache.forget('roles')
  }

  @afterDelete()
  public static async afterDeleteHook() {
    await Cache.forget('roles')
  }
}
