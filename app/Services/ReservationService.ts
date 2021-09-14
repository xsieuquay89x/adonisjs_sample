import Reservation, { ReservationStatus } from 'App/Models/Reservation'
import { DateTime } from 'luxon'
import DriverCalendar from 'App/Models/DriverCalendar'
import DriverCalendarService from 'App/Services/DriverCalendarService'
import ReservationHistoryService from 'App/Services/ReservationHistoryService'

export default class ReservationService {
  /**
   * Get All Reservation Info
   * @Return List Reservation Info
   */
  public static async getReservations() {
    const reservations = await Reservation.query().preload('vehicle')

    return reservations
  }

  /**
   * Get Reservation By Id
   * @param id
   * @returns Reservation
   */
  public static async getReservation(id: any) {
    const reservation = await Reservation.findOrFail(id)
    await reservation.load('vehicle')

    return reservation
  }

  /**
   * Create Reservation
   * @param data
   * @Returns Reservation
   */
  public static async store(data: any) {
    //we are using google directions for calculate millimeter between pick location and destination location and get duration
    //I will hard code here
    data.preferredDuration = 100

    const reservation = await Reservation.create(data)

    return reservation
  }

  /**
   * Update Reservation Status
   * @param data
   * @Returns Reservation
   */
  public static async updateStatus(id: string, status: any) {
    const reservation = await Reservation.findOrFail(id)

    if (reservation.status + 1 !== status) {
      throw new Error('The Reservation Wrong workflow')
    }

    const prevStatus = reservation.status

    switch (status) {
      case ReservationStatus.Arranged:
        //logic check Driver here
        //finding in driver calendar
        let date = reservation.pickDate
        const vehicle = await DriverCalendar.query()
          .whereNull('pickDate')
          .orWhere('pickDate', '>=', date.toISOString())
          .firstOrFail()

        reservation.vehicleId = vehicle.vehicleId
        reservation.status = ReservationStatus.Arranged

        await DriverCalendarService.storeWithReservation(vehicle.vehicleId, id, date)
        break
      case ReservationStatus.Ongoing:
        reservation.status = ReservationStatus.Ongoing
        reservation.startDate = DateTime.now()
        break
      case ReservationStatus.Completed:
        reservation.status = ReservationStatus.Completed
        reservation.completedDate = DateTime.now()

        //calcualte actualDuration
        const duration = reservation.completedDate - reservation.startDate
        reservation.actualDuration = duration

        await DriverCalendarService.delete(reservation.vehicleId, reservation.id)

        break
      default:
        break
    }

    //create history
    await ReservationHistoryService.store({
      reservationId: reservation.id,
      prevStatus: prevStatus,
      currentStatus: status,
    })

    return await reservation.save()
  }

  /**
   * Cancel Reservation
   * @param data
   * @Returns Reservation
   */
  public static async cancel(id: string) {
    const reservation = await Reservation.findOrFail(id)
    const currentTime = DateTime.now()

    if (
      reservation.status === ReservationStatus.Waiting ||
      (reservation.status === ReservationStatus.Arranged &&
        currentTime.hour - reservation.pickDate.hour > 1)
    ) {
      const prevStatus = reservation.status
      reservation.status = ReservationStatus.Cancelled

      await DriverCalendarService.delete(reservation.vehicleId, reservation.id)

      await ReservationHistoryService.store({
        reservationId: reservation.id,
        prevStatus: prevStatus,
        currentStatus: ReservationStatus.Cancelled,
      })
    } else {
      throw new Error('The Reservation Cannot Cancel')
    }

    return await reservation.save()
  }
}
