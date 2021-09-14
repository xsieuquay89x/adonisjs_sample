import Env from '@ioc:Adonis/Core/Env'
import FileLibrary, { FileLibraryType } from 'App/Models/FileLibrary'
import { uuid } from 'uuidv4'

export default class UploadFileService {
  public static async uploadFiles(images, type) {
    let url = Env.get('UPLOAD_PATH')

    switch (type) {
      case FileLibraryType.Brand:
        url += '/brand'
        break
      case FileLibraryType.Model:
        url += '/model'
        break
      case FileLibraryType.Profile:
        url += '/profile'
        break
      default:
        url += ''
        break
    }

    let fileLibraries: string[] = []

    for (let image of images) {
      const fileName = `${uuid()}.${image.extname}`
      const type = image.type
      const size = image.size
      const name = image.data.clientName

      url += '/' + fileName

      const data = { name, type, size, url }
      // Todo Upload file to asset of project
      await image.move(url)
      const fileLibrary = await FileLibrary.create(data)
      const id = fileLibrary.id

      fileLibraries.push(id)
    }
    return fileLibraries
  }
}
