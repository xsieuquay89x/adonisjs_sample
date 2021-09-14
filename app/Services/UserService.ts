import User from 'App/Models/User'

export default class UserService {
  /**
   * Get User By Id
   * @param id
   */
  public static async getUserByType(id: any, type: any) {
    const user = await User.query().where('id', id).where('type', type).first()

    return user
  }
}
