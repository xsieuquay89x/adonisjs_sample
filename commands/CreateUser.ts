import { BaseCommand, args } from '@adonisjs/ace'
import { UserFactory } from 'Database/factories'

export default class CreateUser extends BaseCommand {
  public static commandName = 'create:user'
  public static description = 'Create a new dummy user'

  @args.string({ required: false, description: 'Username' })
  public username: string

  @args.string({ required: false, description: 'Password' })
  public password: string

  /**
   * Load application
   */
  public static settings = {
    loadApp: true,
  }

  public async run() {
    try {
      let attributes = {}
      this.username && Object.assign(attributes, { username: this.username })
      this.password && Object.assign(attributes, { password: this.password })
      const user = await UserFactory.merge(attributes).make()
      this.username = user.username
      this.password = user.password
      await user.save()
      this.logger.success(
        `User has been created.\nUsername: ${this.username}\nPassword: ${this.password}`
      )
    } catch (err) {
      this.logger.error(err)
    }
    process.exit(1)
  }
}
