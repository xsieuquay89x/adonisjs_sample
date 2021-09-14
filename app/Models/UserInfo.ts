import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import FileLibrary from 'App/Models/FileLibrary'
import { softDelete, softDeleteQuery } from 'App/Helpers/SoftDelete'
import { uuid } from 'uuidv4'

export default class UserInfo extends BaseModel {
  public static selfAssignPrimaryKey = true

  public static table = 'user_info'

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @column({ isPrimary: true })
  public id: string

  @column()
  public displayName: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public gender: string

  @column()
  public dob: Date

  @column()
  public address1: string

  @column()
  public address2: string

  @column()
  public city: string

  @column()
  public country: string

  @column()
  public email: string

  @column()
  public mobile: string

  @computed()
  public get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  @column()
  public imageId: string

  @column()
  public userId: string

  @belongsTo(() => User, {
    foreignKey: 'userId',
    localKey: 'id',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => FileLibrary, {
    foreignKey: 'imageId',
    localKey: 'id',
  })
  public image: BelongsTo<typeof FileLibrary>

  @beforeCreate()
  public static assignUuid(user: User) {
    user.id = uuid()
  }

  @beforeFind()
  public static softDeletesFind = softDeleteQuery

  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery

  public async softDelete(column?: string) {
    await softDelete(this, column)
  }
}
