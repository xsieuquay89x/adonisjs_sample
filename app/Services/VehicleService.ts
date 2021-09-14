import FileLibraryService from 'App/Services/FileLibraryService'
import Vehicle from 'App/Models/Vehicle'
import ModelService from 'App/Services/ModelService'
import UserInfoService from 'App/Services/UserInfoService'
import { UserType } from 'App/Models/User'
import DriverCalendarService from 'App/Services/DriverCalendarService'

export default class VehicleService {
  /**
   * Get All Vehicle Info
   * @Return List Vehicle Info
   */
  public static async getVehicles() {
    const vehicles = await Vehicle.query().preload('image').preload('model')

    return vehicles
  }

  /**
   * Get Vehicle By Id
   * @param id
   * @returns Vehicle
   */
  public static async getVehicle(id: any) {
    const vehicle = await Vehicle.findOrFail(id)
    await vehicle.load('image')
    await vehicle.load('model')

    return vehicle
  }

  /**
   * Create Vehicle
   * @param data
   * @Returns Vehicle
   */
  public static async store(data: any) {
    //check model exited
    await ModelService.getModel(data.modelId)

    //check owner exited
    const userInfo = await UserInfoService.getUserInfo(data.ownerId)

    if (userInfo && userInfo.user.type === UserType.Driver) {
      data.ownerId = userInfo.userId
    }

    if (data.imageId) {
      await FileLibraryService.updateObjectImage(data.imageId)
    } else {
      data.imageId = null
    }

    const vehicle = await Vehicle.create(data)

    //create calendar
    await DriverCalendarService.store(vehicle.id)

    return vehicle
  }

  /**
   * Update Vehicle
   * @param id
   * @param data
   * @returns Vehicle
   */
  public static async update(id: string, data: any) {
    //check model exited
    await ModelService.getModel(data.modelId)

    //check owner exited
    const userInfo = await UserInfoService.getUserInfo(data.ownerId)

    if (userInfo && userInfo.user.type === UserType.Driver) {
      data.ownerId = userInfo.userId
    }

    const vehicle = await Vehicle.findOrFail(id)

    if (data.imageId) {
      data.imageId = await FileLibraryService.updateObjectImage(data.imageId, vehicle)
    } else {
      data.imageId = null
    }

    return await vehicle.merge(data).save()
  }

  /**
   * Delete Vehicle
   * @param id
   * @Returns Vehicle|null
   */
  public static async delete(id: string) {
    const vehicle = await Vehicle.findOrFail(id)

    //delete file image
    if (vehicle.imageId) {
      await FileLibraryService.delete(vehicle.imageId)
    }

    return await vehicle.softDelete()
  }
}
