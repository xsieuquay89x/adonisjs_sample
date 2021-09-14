import Brand from 'App/Models/Brand'
import FileLibraryService from 'App/Services/FileLibraryService'

export default class BrandService {
  /**
   * Get All brand
   * @returns brands
   */
  public static async getBrands() {
    const brands = await Brand.query().preload('image')
    return brands
  }

  /**
   * Get Brand By Id
   * @param id
   */
  public static async getBrand(id: any) {
    const brand = await Brand.findOrFail(id)
    await brand.load('image')
    return brand
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

    return await Brand.create(data)
  }

  /**
   * Update Brand
   * @param id
   * @param data
   * @returns brand
   */
  public static async update(id: string, data: any) {
    const brand = await Brand.findOrFail(id)

    if (data.imageId) {
      data.imageId = await FileLibraryService.updateObjectImage(data.imageId, brand)
    } else {
      data.imageId = null
    }

    return await brand.merge(data).save()
  }

  /**
   * Delete Brand
   * @param id
   * @Returns Brand|null
   */
  public static async delete(id: string) {
    const brand = await Brand.findOrFail(id)
    //delete file image
    if (brand.imageId) {
      await FileLibraryService.delete(brand.imageId)
    }
    return await brand.softDelete()
  }
}
