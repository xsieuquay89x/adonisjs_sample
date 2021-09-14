import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import ResponseData from 'App/Helpers/ResponseData'
import ReservationValidator from 'App/Validators/ReservationValidator'
import ReservationService from 'App/Services/ReservationService'
import { ReservationStatus } from 'App/Models/Reservation'
import ReservationDto from 'App/dtos/ReservationDto'
import UserInfoService from 'App/Services/UserInfoService'

export default class UserController {
  public async index({ response }: HttpContextContract) {
    const reservations = await ReservationService.getReservations()

    const reservationDtos = reservations.map(async (reservation) => {
      if (reservation.vehicle) {
        const userInfo = await UserInfoService.getUserInfoByUser(reservation.vehicle.ownerId)
        return new ReservationDto(reservation, userInfo)
      } else {
        return new ReservationDto(reservation)
      }
    })

    response.ok(ResponseData.success(reservationDtos, 'List Reservation'))
  }

  public async view({ params, response }: HttpContextContract) {
    const id = params.id

    const reservation = await ReservationService.getReservation(id)
    let reservationDto

    if (reservation.vehicle) {
      const userInfo = await UserInfoService.getUserInfoByUser(reservation.vehicle.ownerId)
      reservationDto = new ReservationDto(reservation, userInfo)
    } else {
      reservationDto = new ReservationDto(reservation)
    }

    response.ok(ResponseData.success(reservationDto, 'Reservation'))
  }

  public async create({ request, response }: HttpContextContract) {
    try {
      await request.validate({
        schema: ReservationValidator.ReservationSchema(),
        messages: ReservationValidator.ReservationMessage(),
      })

      const data = this.getData(request)

      const reservation = await ReservationService.store(data)

      response.ok(ResponseData.success(reservation.id, 'Create Reservation Success'))
    } catch (e) {
      return response.badRequest(ResponseData.error(e.messages || e))
    }
  }

  public async arranging({ params, response }: HttpContextContract) {
    const id = params.id
    try {
      const reservation = await ReservationService.updateStatus(id, ReservationStatus.Arranged)
      response.ok(ResponseData.success(reservation.id, 'Arranged Reservation Success'))
    } catch (e) {
      return response.badRequest(ResponseData.error(e.messages || e))
    }
  }

  public async starting({ params, response }: HttpContextContract) {
    const id = params.id
    try {
      const reservation = await ReservationService.updateStatus(id, ReservationStatus.Ongoing)
      response.ok(ResponseData.success(reservation.id, 'Reservation Running'))
    } catch (e) {
      return response.badRequest(ResponseData.error(e.messages || e))
    }
  }

  public async finish({ params, response }: HttpContextContract) {
    const id = params.id
    try {
      const reservation = await ReservationService.updateStatus(id, ReservationStatus.Completed)
      response.ok(ResponseData.success(reservation.id, 'Reservation Running'))
    } catch (e) {
      return response.badRequest(ResponseData.error(e.messages || e))
    }
  }

  public async cancel({ params, response }: HttpContextContract) {
    const id = params.id
    try {
      const reservation = await ReservationService.cancel(id)
      response.ok(ResponseData.success(reservation.id, 'Reservation Cancelled'))
    } catch (e) {
      return response.badRequest(ResponseData.error(e.messages || e))
    }
  }

  /**
   * Mapping data between request and object data
   * @param request
   * @returns data
   * @private
   */
  private getData(request: RequestContract) {
    const contactName = request.input('contact_name')
    const contactPhone = request.input('contact_phone')

    const pickDate = request.input('pick_date')

    const pickLocation = request.input('pick_location')
    const pickLatitude = Number(request.input('pick_latitude'))
    const pickLongitude = Number(request.input('pick_longitude'))

    const destinationLocation = request.input('destination_location')
    const destinationLatitude = Number(request.input('destination_latitude'))
    const destinationLongitude = Number(request.input('destination_longitude'))

    return {
      contactName,
      contactPhone,
      pickDate,
      pickLocation,
      pickLatitude,
      pickLongitude,
      destinationLocation,
      destinationLatitude,
      destinationLongitude,
    }
  }
}
