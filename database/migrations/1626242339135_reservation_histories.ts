import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ReservationHistories extends BaseSchema {
  protected tableName = 'reservation_history'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('reservation_id')
        .index()
        .references('id')
        .inTable('reservation')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')

      table.specificType('prev_status', 'smallint').notNullable().defaultTo(0)
      table.specificType('current_status', 'smallint').notNullable().defaultTo(0)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
