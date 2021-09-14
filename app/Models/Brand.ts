import {
  BaseModel,
  beforeCreate,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { uuid } from 'uuidv4'
import FileLibrary from 'App/Models/FileLibrary'
import Model from 'App/Models/Model'
import { softDelete, softDeleteQuery } from 'App/Helpers/SoftDelete'

export default class Brand extends BaseModel {
  public static selfAssignPrimaryKey = true

  public static table = 'brand'

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public imageId: string

  @beforeCreate()
  public static assignUuid(brand: Brand) {
    brand.id = uuid()
  }

  @belongsTo(() => FileLibrary, {
    foreignKey: 'imageId',
    localKey: 'id',
  })
  public image: BelongsTo<typeof FileLibrary>

  @hasMany(() => Model)
  public model: HasMany<typeof Model>

  @beforeFind()
  public static softDeletesFind = softDeleteQuery

  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery

  public async softDelete(column?: string) {
    await softDelete(this, column)
  }
}
