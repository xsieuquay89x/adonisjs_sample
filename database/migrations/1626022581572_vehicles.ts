import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Vehicles extends BaseSchema {
  protected tableName = 'vehicle'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('image_id')
        .index()
        .references('id')
        .inTable('file_library')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      table
        .uuid('owner_id')
        .index()
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      table
        .uuid('model_id')
        .index()
        .references('id')
        .inTable('model')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      table.string('name', 255).notNullable()
      table.string('color', 255).nullable()
      table.float('mileage', 10).nullable()
      table.string('identification_number', 255).nullable()
      table.string('plate_number', 255).nullable()
      table.date('manufactured_date').nullable()
      table.date('purchased_date').nullable()
      table.string('parking_location', 255).nullable()
      table.float('parking_latitude', 10).nullable()
      table.float('parking_longitude', 10).nullable()
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
