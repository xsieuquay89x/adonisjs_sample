import { DateTime } from 'luxon'
import { column, BaseModel, hasOne, beforeCreate, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { uuid } from 'uuidv4'

export default class UserToken extends BaseModel {
  public static selfAssignPrimaryKey = true

  public static table = 'user_token'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: number

  @column()
  public name: string

  @column()
  public type: number

  @column()
  public token: string

  @column()
  public ip: string

  @column()
  public agent: string

  @column.dateTime()
  public expriesAt: DateTime

  @hasOne(() => User)
  public user: HasOne<typeof User>

  @beforeCreate()
  public static assignUuid(userToken: UserToken) {
    userToken.id = uuid()
  }
}
