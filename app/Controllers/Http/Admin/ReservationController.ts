import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ResponseData from 'App/Helpers/ResponseData'

import ReservationService from 'App/Services/ReservationService'

import ReservationDto from 'App/dtos/ReservationDto'
import UserInfoService from 'App/Services/UserInfoService'

export default class UserController {
  public async index({ response }: HttpContextContract) {
    const reservations = await ReservationService.getReservations()

    const reservationDtos = reservations.map(async (reservation) => {
      if (reservation.vehicle) {
        const userInfo = await UserInfoService.getUserInfo(reservation.vehicle.ownerId)
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
      const userInfo = await UserInfoService.getUserInfo(reservation.vehicle.ownerId)
      reservationDto = new ReservationDto(reservation, userInfo)
    } else {
      reservationDto = new ReservationDto(reservation)
    }

    response.ok(ResponseData.success(reservationDto, 'Reservation'))
  }
}
