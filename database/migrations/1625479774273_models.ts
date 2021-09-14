import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Models extends BaseSchema {
  protected tableName = 'model'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      // table.timestamps(true)
      table.uuid('id').primary()
      table
        .uuid('brand_id')
        .index()
        .references('id')
        .inTable('brand')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      table
        .uuid('image_id')
        .index()
        .references('id')
        .inTable('file_library')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      table.string('name', 255).notNullable()
      table.string('year', 5).notNullable()

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
