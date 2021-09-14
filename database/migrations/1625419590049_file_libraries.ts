import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FileLibraries extends BaseSchema {
  protected tableName = 'file_library'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      // table.timestamps(true)
      table.uuid('id').primary()
      table.string('name', 255).notNullable()
      table.string('url', 255).notNullable()
      table.integer('size').notNullable()
      table.string('type', 255).notNullable()
      table.string('cdn', 255).nullable()
      table.specificType('status', 'smallint').notNullable().defaultTo(0)
      /**
       * "useTz: true" utilizes timezone option in PostgreSQL and MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
