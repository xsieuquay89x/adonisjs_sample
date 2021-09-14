import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserMetas extends BaseSchema {
  protected tableName = 'user_meta'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.timestamps(true)
      table.uuid('id').primary()
      table
        .uuid('user_id')
        .index()
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      table.string('name', 255).notNullable()
      table.json('value').notNullable()
      table.boolean('soft_delete').defaultTo(false)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
