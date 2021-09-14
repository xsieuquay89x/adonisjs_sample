import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ResponseData from 'App/Helpers/ResponseData'
import UploadFileService from 'App/Services/UploadService'

export default class UploadController {
  public async upload({ request, response }: HttpContextContract) {
    const image = request.file('image')

    const type = Number(request.input('type', '-1'))

    const fileLibrary = await UploadFileService.uploadFiles([image], type)
    if (fileLibrary.length > 0) {
      return response.ok(ResponseData.success(fileLibrary[0], 'Upload Success'))
    } else {
      return response.badRequest(ResponseData.error('Upload Fail'))
    }
  }

  public async multipleUpload({ request, response }: HttpContextContract) {
    const images = request.files('images')

    const type = request.input('type', -1)

    const fileLibrary = await UploadFileService.uploadFiles(images, type)

    if (fileLibrary.length > 0) {
      return response.ok(ResponseData.success(fileLibrary, 'Upload Success'))
    } else {
      return response.badRequest(ResponseData.error('Upload Fail'))
    }
  }
}
