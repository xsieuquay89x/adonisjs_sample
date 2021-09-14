import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Reservations extends BaseSchema {
  protected tableName = 'reservation'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('vehicle_id')
        .index()
        .references('id')
        .inTable('vehicle')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')

      table.string('contact_name', 255).nullable()
      table.string('contact_phone', 255).nullable()

      table.timestamp('pick_date', { useTz: true }).nullable()
      table.timestamp('start_date', { useTz: true }).nullable()
      table.timestamp('completed_date', { useTz: true }).nullable()

      table.string('pick_location', 255).nullable()
      table.float('pick_latitude', 10).nullable()
      table.float('pick_longitude', 10).nullable()

      table.string('destination_location', 255).nullable()
      table.float('destination_latitude', 10).nullable()
      table.float('destination_longitude', 10).nullable()

      table.float('preferred_duration', 10).nullable()
      table.float('actual_duration', 10).nullable()

      table.specificType('status', 'smallint').notNullable().defaultTo(0)
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
