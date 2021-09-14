import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserProfiles extends BaseSchema {
  protected tableName = 'user_info'

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
        .uuid('user_id')
        .index()
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      table.string('first_name', 255).notNullable()
      table.string('last_name', 255).notNullable()
      table.string('display_name', 255).notNullable()
      table.string('gender', 255).notNullable()
      table.date('dob').nullable()
      table.string('address1', 255).notNullable()
      table.string('address2', 255).nullable()
      table.string('city', 255).nullable()
      table.string('country', 255).nullable()
      table.string('email', 255).notNullable()
      table.string('mobile', 255).notNullable()
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
