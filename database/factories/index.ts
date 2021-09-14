import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    username: faker.internet.password(8, true),
    password: faker.internet.password(8, false, /[a-zA-Z0-9]/),
    status: faker.random.number(2),
    type: faker.random.number(2),
  }
}).build()
