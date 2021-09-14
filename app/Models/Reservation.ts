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
import { softDelete, softDeleteQuery } from 'App/Helpers/SoftDelete'
import Vehicle from 'App/Models/Vehicle'

export enum ReservationStatus {
  Waiting,
  Arranged,
  Ongoing,
  Completed,
  Cancelled,
}

export default class Reservation extends BaseModel {
  public static selfAssignPrimaryKey = true

  public static table = 'reservation'

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @column({ isPrimary: true })
  public id: string

  @column()
  public contactName: string

  @column()
  public contactPhone: string

  @column()
  public pickDate: DateTime

  @column()
  public startDate: DateTime

  @column()
  public completedDate: DateTime

  @column()
  public pickLocation: string

  @column()
  public pickLatitude: number

  @column()
  public pickLongitude: number

  @column()
  public destinationLocation: string

  @column()
  public destinationLatitude: number

  @column()
  public destinationLongitude: number

  @column()
  public preferredDuration: number

  @column()
  public actualDuration: number

  @column()
  public status: ReservationStatus

  @column()
  public vehicleId: string

  @beforeCreate()
  public static assignUuid(reservation: Reservation) {
    reservation.id = uuid()
  }

  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
    localKey: 'id',
  })
  public vehicle: BelongsTo<typeof Vehicle>

  @beforeFind()
  public static softDeletesFind = softDeleteQuery

  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery

  public async softDelete(column?: string) {
    await softDelete(this, column)
  }
}
