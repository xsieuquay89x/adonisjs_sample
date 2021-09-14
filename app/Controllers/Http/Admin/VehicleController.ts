import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ResponseData from 'App/Helpers/ResponseData'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import VehicleService from 'App/Services/VehicleService'
import VehicleValidator from 'App/Validators/VehicleValidator'

export default class VehicleController {
  /**
   *
   * @param response
   */
  public async index({ response }: HttpContextContract) {
    try {
      const vehicles = await VehicleService.getVehicles()
      const vehiclesJSON = vehicles.map((vehicle) => vehicle.serialize())
      return response.ok(ResponseData.success(vehiclesJSON, 'List Vehicle For Admin'))
    } catch (e) {
      return response.badRequest(ResponseData.error(e.messages || e))
    }
  }

  /**
   *
   * @param params
   * @param response
   */
  public async view({ params, response }: HttpContextContract) {
    let isError = false
    if (params.id) {
      try {
        const vehicle = await VehicleService.getVehicle(params.id)

        const vehicleJSON = vehicle.serialize()
        return response.ok(ResponseData.success(vehicleJSON, 'Get Vehicle Success'))
      } catch (e) {
        isError = true
      }
    }

    if (isError) {
      response.notFound(ResponseData.error(`Vehicle has id=${params.id} is not existed`))
    }
  }

  /**
   *
   * @param request
   * @param response
   */
  public async add({ request, response }: HttpContextContract) {
    let errorMessage = ''
    try {
      await request.validate({
        schema: VehicleValidator.VehicleSchema(),
        messages: VehicleValidator.VehicleMessage(),
      })

      const data = this.getData(request)

      const vehicle = await VehicleService.store(data)

      response.ok(ResponseData.success(vehicle.id, 'Create Vehicle Success'))
    } catch (e) {
      errorMessage = e.messages || e
    }

    if (errorMessage) {
      return response.badRequest(ResponseData.error(errorMessage))
    }
  }

  /**
   *
   * @param params
   * @param request
   * @param response
   */
  public async update({ params, request, response }: HttpContextContract) {
    let errorMessage = ''
    try {
      await request.validate({
        schema: VehicleValidator.VehicleSchema(),
        messages: VehicleValidator.VehicleMessage(),
      })

      const id = params.id

      const data = this.getData(request)

      await VehicleService.update(id, data)

      response.ok(ResponseData.success(id, 'Update Vehicle Success'))
    } catch (e) {
      errorMessage = e.messages || e
    }

    if (errorMessage) {
      return response.badRequest(ResponseData.error(errorMessage))
    }
  }

  /**
   *
   * @param params
   * @param response
   */
  public async delete({ params, response }: HttpContextContract) {
    const id = params.id
    let errorMessage = ''

    try {
      await VehicleService.delete(id)
      return response.ok(ResponseData.success(id, `Vehicle has id=${params.id} deleted`))
    } catch (e) {
      errorMessage = e.messages || e
    }

    if (errorMessage) {
      return response.badRequest(ResponseData.error(errorMessage))
    }
  }

  /**
   * Mapping data between request and object data
   * @param request
   * @returns data
   * @private
   */
  private getData(request: RequestContract) {
    const name = request.input('name')
    const color = request.input('color')
    const mileage = Number(request.input('mileage'))
    const identificationNumber = request.input('identification_number')
    const plateNumber = request.input('plate_number')
    const manufacturedDate = request.input('manufactured_date')
    const purchasedDate = request.input('purchased_date')
    const parkingLocation = request.input('parking_location')
    const parkingLatitude = Number(request.input('parking_latitude'))
    const parkingLongitude = Number(request.input('parking_longitude'))

    const ownerId = request.input('owner_id')
    const modelId = request.input('model_id')
    const imageId = request.input('image_id')

    return {
      name,
      color,
      mileage,
      identificationNumber,
      plateNumber,
      manufacturedDate,
      purchasedDate,
      parkingLocation,
      parkingLatitude,
      parkingLongitude,
      ownerId,
      modelId,
      imageId,
    }
  }
}
