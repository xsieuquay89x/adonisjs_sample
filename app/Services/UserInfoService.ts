import FileLibraryService from 'App/Services/FileLibraryService'
import UserInfo from 'App/Models/UserInfo'
import User, { UserStatus, UserType } from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { uuid } from 'uuidv4'

export default class UserInfoService {
  /**
   * Get All User Info
   * @Return List User Info
   */
  public static async getUserInfos() {
    const userInfos = await UserInfo.query().preload('image').preload('user')

    return userInfos
  }

  /**
   * Get User By Id
   * @param id
   */
  public static async getUserInfo(id: any) {
    const userInfo = await UserInfo.findOrFail(id)
    await userInfo.load('image')
    await userInfo.load('user')
    return userInfo
  }

  /**
   * Get User By Id
   * @param id
   */
  public static async getUserInfoByUser(id: any) {
    const userInfo = await UserInfo.query().where('userId', id).firstOrFail()
    await userInfo.load('image')
    await userInfo.load('user')
    return userInfo
  }

  /**
   * Create User
   * @param data
   * @Returns UserInfo
   */
  public static async store(data: any) {
    if (data.imageId) {
      await FileLibraryService.updateObjectImage(data.imageId)
    } else {
      data.imageId = null
    }

    //create User Account For Driver
    const username = data.email
    const type = UserType.Driver
    const status = UserStatus.Activated
    const password = uuid()
    const resetPasswordRequired = true
    const resetPasswordToken = await Hash.use('sha256').make(
      JSON.stringify({ date: new Date(), rand: Math.random() })
    )

    const dataUser = { username, type, password, status, resetPasswordRequired, resetPasswordToken }
    const user = await User.create(dataUser)

    data.userId = user.id

    const userInfo = await UserInfo.create(data)

    // TODO SEND MAIL TO DRIVER FOR PASSWORD

    return userInfo
  }

  /**
   * Update User
   * @param id
   * @param data
   * @returns User Info
   */
  public static async update(id: string, data: any) {
    const userInfo = await UserInfo.findOrFail(id)

    if (userInfo) {
      if (data.imageId) {
        data.imageId = await FileLibraryService.updateObjectImage(data.imageId, userInfo)
      } else {
        data.imageId = null
      }
    }

    // Exclude email for update.
    data.email = userInfo.email

    return await userInfo.merge(data).save()
  }

  /**
   * Delete User Info
   * @param id
   * @Returns User Info|null
   */
  public static async delete(id: string) {
    const userInfo = await UserInfo.findOrFail(id)
    if (userInfo) {
      //delete file image
      if (userInfo.imageId) {
        await FileLibraryService.delete(userInfo.imageId)
      }

      //delete user account
      const user = await User.findOrFail(userInfo.userId)
      await user.softDelete()

      return await userInfo.softDelete()
    } else {
      return null
    }
  }
}
