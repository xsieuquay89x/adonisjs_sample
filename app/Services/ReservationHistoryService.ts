import ReservationHistory from 'App/Models/ReservationHistory'

export default class ReservationHistoryService {
  /**
   * Create Reservation History
   * @param data
   * @Returns Reservation History
   */
  public static async store(data: any) {
    return await ReservationHistory.create(data)
  }
}
