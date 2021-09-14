import {
  BaseModel,
  beforeCreate,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Brand from 'App/Models/Brand'
import FileLibrary from 'App/Models/FileLibrary'
import { uuid } from 'uuidv4'
import { softDelete, softDeleteQuery } from 'App/Helpers/SoftDelete'

export default class Model extends BaseModel {
  public static selfAssignPrimaryKey = true

  public static table = 'model'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public year: string

  @column()
  public brandId: string

  @column()
  public imageId: string

  @hasMany(() => Brand, {
    foreignKey: 'brandId',
  })
  public brand: HasMany<typeof Brand>

  @belongsTo(() => FileLibrary, {
    foreignKey: 'imageId',
    localKey: 'id',
  })
  public image: BelongsTo<typeof FileLibrary>

  @beforeCreate()
  public static assignUuid(model: Model) {
    model.id = uuid()
  }

  @beforeFind()
  public static softDeletesFind = softDeleteQuery

  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery

  public async softDelete(column?: string) {
    await softDelete(this, column)
  }
}
