import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeCreate,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import { uuid } from 'uuidv4'
import FileLibrary from 'App/Models/FileLibrary'
import Model from 'App/Models/Model'
import { softDelete, softDeleteQuery } from 'App/Helpers/SoftDelete'
import User from 'App/Models/User'

export default class Vehicle extends BaseModel {
  public static selfAssignPrimaryKey = true

  public static table = 'vehicle'

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
  public color: string

  @column()
  public mileage: number

  @column()
  public identificationNumber: string

  @column()
  public plateNumber: string

  @column()
  public manufacturedDate: Date

  @column()
  public purchasedDate: Date

  @column()
  public parkingLocation: string

  @column()
  public parkingLatitude: number

  @column()
  public parkingLongitude: number

  @column()
  public ownerId: string

  @column()
  public modelId: string

  @column()
  public imageId: string

  @beforeCreate()
  public static assignUuid(vehicle: Vehicle) {
    vehicle.id = uuid()
  }

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
    localKey: 'id',
  })
  public owner: BelongsTo<typeof User>

  @belongsTo(() => FileLibrary, {
    foreignKey: 'imageId',
    localKey: 'id',
  })
  public image: BelongsTo<typeof FileLibrary>

  @belongsTo(() => Model, {
    foreignKey: 'modelId',
    localKey: 'id',
  })
  public model: BelongsTo<typeof Model>

  @beforeFind()
  public static softDeletesFind = softDeleteQuery

  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery

  public async softDelete(column?: string) {
    await softDelete(this, column)
  }
}
