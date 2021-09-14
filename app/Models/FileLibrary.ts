import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  beforeFetch,
  beforeFind,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { uuid } from 'uuidv4'
import { softDelete, softDeleteQuery } from 'App/Helpers/SoftDelete'
import Brand from 'App/Models/Brand'

export enum FileLibraryType {
  Profile,
  Brand,
  Model,
}

export enum FileLibraryStatus {
  Unassigned,
  Assigned,
}

export default class FileLibrary extends BaseModel {
  public static selfAssignPrimaryKey = true

  public static table = 'file_library'

  @column({ isPrimary: true })
  public id: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @column()
  public name: string

  @column()
  public url: string

  @column()
  public size: number

  @column()
  public type: string

  @column()
  public cdn: string

  @column()
  public status: FileLibraryStatus

  @hasMany(() => Brand, {
    foreignKey: 'imageId',
  })
  public brand: HasMany<typeof Brand>

  @beforeCreate()
  public static assignUuid(fileLibrary: FileLibrary) {
    fileLibrary.id = uuid()
  }

  @beforeFind()
  public static softDeletesFind = softDeleteQuery

  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery

  public async softDelete(column?: string) {
    await softDelete(this, column)
  }
}
