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
import Reservation from 'App/Models/Reservation'

export default class DriverCalendar extends BaseModel {
  public static selfAssignPrimaryKey = true

  public static table = 'driver_calendar'

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @column({ isPrimary: true })
  public id: string

  @column()
  public pickDate: DateTime

  @column()
  public vehicleId: string

  @column()
  public reservationId: string

  @beforeCreate()
  public static assignUuid(driverCalendar: DriverCalendar) {
    driverCalendar.id = uuid()
  }

  @belongsTo(() => Vehicle, {
    foreignKey: 'vehicleId',
    localKey: 'id',
  })
  public vehicle: BelongsTo<typeof Vehicle>

  @belongsTo(() => Reservation, {
    foreignKey: 'reservationId',
    localKey: 'id',
  })
  public reservation: BelongsTo<typeof Reservation>

  @beforeFind()
  public static softDeletesFind = softDeleteQuery

  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery

  public async softDelete(column?: string) {
    await softDelete(this, column)
  }
}
