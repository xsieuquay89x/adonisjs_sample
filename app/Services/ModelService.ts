import FileLibraryService from 'App/Services/FileLibraryService'
import Model from 'App/Models/Model'

export default class ModelService {
  /**
   * Get All model
   * @returns models
   */
  public static async getModels() {
    const models = await Model.query().preload('image').preload('brand')

    return models
  }

  /**
   * Get Model By Id
   * @param id
   * @returns model| exception
   */
  public static async getModel(id: any) {
    const model = await Model.findOrFail(id)
    await model.load('image')
    return model
  }

  /**
   * Create Brand
   * @param data
   * @Returns Brand
   */
  public static async store(data: any) {
    if (data.imageId) {
      data.imageId = await FileLibraryService.updateObjectImage(data.imageId)
    } else {
      data.imageId = null
    }

    return await Model.create(data)
  }

  /**
   * Update Model
   * @param id
   * @param data
   * @returns Model
   */
  public static async update(id: string, data: any) {
    const model = await Model.findOrFail(id)

    if (model) {
      if (data.imageId) {
        data.imageId = await FileLibraryService.updateObjectImage(data.imageId, model)
      } else {
        data.imageId = null
      }
    }

    return await model.merge(data).save()
  }

  /**
   * Delete Model
   * @param id
   * @Returns Model|null
   */
  public static async delete(id: string) {
    const model = await Model.findOrFail(id)
    if (model) {
      //delete file image
      if (model.imageId) {
        await FileLibraryService.delete(model.imageId)
      }
      return await model.softDelete()
    } else {
      return null
    }
  }
}
