import Reservation, { ReservationStatus } from 'App/Models/Reservation'
import UserInfo from 'App/Models/UserInfo'

export default class ReservationDto {
  constructor(reservation: Reservation, driver?: UserInfo) {
    this.id = reservation.id
    this.contactName = reservation.contactName
    this.contactPhone = reservation.contactPhone
    this.pickLocation = reservation.pickLocation
    this.destinationLocation = reservation.destinationLocation
    this.duration = reservation.actualDuration || reservation.preferredDuration
    this.pickDate = reservation.pickDate.toISO()
    this.startDate = reservation.startDate.toISO()
    this.completedDate = reservation.completedDate.toISO()
    this.status = ReservationStatus[reservation.status]
    if (driver) {
      this.plateNumber = reservation.vehicle.plateNumber
      this.driverName = driver.displayName
      this.driverPhone = driver.mobile
    }
  }

  public id: string
  public contactName: string
  public contactPhone: string
  public driverName: string
  public driverPhone: string
  public plateNumber: string
  public pickLocation: string
  public destinationLocation: string
  public duration: number
  public pickDate: string
  public startDate: string
  public completedDate: string
  public status: string
}
