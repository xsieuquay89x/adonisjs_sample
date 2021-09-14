import { createHash } from 'crypto'

export default class Sha256 {
  ids = ['sha256']

  hash(value) {
    return Promise.resolve(createHash('sha256').update(value).digest('hex'))
  }

  make(value) {
    return this.hash(value)
  }

  verify(hashedValue, plainValue) {
    return this.hash(plainValue).then((h) => h === hashedValue)
  }

  needsReHash(_value) {
    return false
  }
}
