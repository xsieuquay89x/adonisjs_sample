import FileLibrary, { FileLibraryStatus } from 'App/Models/FileLibrary'

export default class FileLibraryService {
  /**
   * Get File Library By Id
   * @param id
   * @return FileLibrary
   */
  public static async getFileLibrary(id: any) {
    return await FileLibrary.find(id)
  }

  /**
   * Change Status Of File Library
   * @param fileLibrary
   * @param status
   */
  public static async updateStatus(fileLibrary: any, status: any) {
    fileLibrary.status = status
    await fileLibrary.save()
  }

  /**
   * Update Image for Object
   * @param data
   * @param object
   * @private
   */
  public static async updateObjectImage(imageId: string, object?: any) {
    const fileLibrary = await FileLibraryService.getFileLibrary(imageId)
    if (fileLibrary && fileLibrary.status !== FileLibraryStatus.Assigned) {
      const deleteFileId = object.imageId
      fileLibrary.status = FileLibraryStatus.Assigned
      fileLibrary.save()

      //delete prev image
      if (deleteFileId !== null && deleteFileId !== imageId) {
        await this.delete(deleteFileId)
      }
      return fileLibrary.id
    } else {
      return null
    }
  }

  /**
   * Delete File Library By Id
   * @param id
   */
  public static async delete(id: any) {
    const fileLibrary = await FileLibrary.findOrFail(id)
    await fileLibrary.softDelete()
  }
}
