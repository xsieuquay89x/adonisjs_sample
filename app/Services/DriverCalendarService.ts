import VehicleService from 'App/Services/VehicleService'
import DriverCalendar from 'App/Models/DriverCalendar'

export default class DriverCalendarService {
  /**
   * Create Driver Calendar
   * @param data
   * @Returns Driver Calendar
   */
  public static async store(id: any) {
    const vehicle = await VehicleService.getVehicle(id)

    const data = { vehicleId: vehicle.id }

    return await DriverCalendar.create(data)
  }

  /**
   * Create Driver Calendar With Reservation
   * @param id
   * @param data
   * @returns Driver Calendar
   */
  public static async storeWithReservation(vehicleId, reservationId: any, pickDate: any) {
    //at least 1 record in data
    let driver = await DriverCalendar.query()
      .where('vehicleId', vehicleId)
      .whereNull('pick_date')
      .first()

    if (driver) {
      driver.reservationId = reservationId
      driver.pickDate = pickDate
      await driver.save()
    } else {
      const data = { vehicleId, reservationId, pickDate }
      driver = await DriverCalendar.create(data)
    }
    return driver
  }

  /**
   * Delete Driver Calendar
   * @param id
   * @Returns Driver Calendar|null
   */
  public static async delete(vehicleId: any, reservationId: any) {
    //at least 1 record in data
    const driver = await DriverCalendar.query()
      .where('vehicleId', vehicleId)
      .whereNull('pick_date')
      .first()

    let deleteDriver = await DriverCalendar.query()
      .where('vehicleId', vehicleId)
      .where('reservationId', reservationId)
      .firstOrFail()

    //delete file image
    if (driver) {
      await deleteDriver.softDelete()
    } else {
      const data = { reservationId: undefined, pickDate: undefined }
      await deleteDriver.merge(data).save()
    }

    return deleteDriver
  }
}
