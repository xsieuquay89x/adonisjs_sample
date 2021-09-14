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
import Reservation, { ReservationStatus } from 'App/Models/Reservation'

export default class ReservationHistory extends BaseModel {
  public static selfAssignPrimaryKey = true

  public static table = 'reservation_history'

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @column({ isPrimary: true })
  public id: string

  @column()
  public prevStatus: ReservationStatus

  @column()
  public currentStatus: ReservationStatus

  @column()
  public reservationId: string

  @beforeCreate()
  public static assignUuid(reservation: ReservationHistory) {
    reservation.id = uuid()
  }

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
