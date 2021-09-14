export default class ResponseData {
  public static error(message) {
    return { success: false, message: message }
  }

  public static success(data: any, message: string) {
    return { success: true, message: message, data: data }
  }
}
