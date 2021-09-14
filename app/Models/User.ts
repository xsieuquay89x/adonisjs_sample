import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  beforeCreate,
  beforeFind,
  beforeFetch,
} from '@ioc:Adonis/Lucid/Orm'
import UserToken from 'App/Models/UserToken'
import { softDelete, softDeleteQuery } from '../Helpers/SoftDelete'
import { uuid } from 'uuidv4'

export enum UserType {
  Individual = 1,
  Driver,
}

export enum UserStatus {
  Pending,
  Activated,
}

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  public static table = 'user'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @column({ isPrimary: true })
  public id: string

  @column()
  public parentId: number

  @column()
  public type: UserType

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public status: UserStatus

  @column({ serializeAs: null })
  public resetPasswordToken: string

  @column({ serializeAs: null })
  public resetPasswordRequired: boolean

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuid()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasOne(() => User, {
    foreignKey: 'parentId',
  })
  public parent: HasOne<typeof User>

  @hasMany(() => User, {
    foreignKey: 'parentId',
  })
  public children: HasMany<typeof User>

  @hasMany(() => UserToken)
  public tokens: HasMany<typeof UserToken>

  @beforeFind()
  public static softDeletesFind = softDeleteQuery

  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery

  public async softDelete(column?: string) {
    await softDelete(this, column)
  }

  public async verifyPassword(password: string) {
    const hashed = await Hash.make(password)
    return this.password === hashed
  }
}
