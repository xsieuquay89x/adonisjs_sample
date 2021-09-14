import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserSchema extends BaseSchema {
  protected tableName = 'user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.timestamps(true)
      table.uuid('id').primary()
      table
        .uuid('parent_id')
        .index()
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      table.specificType('type', 'smallint').notNullable().defaultTo(1)
      table.string('username', 255).notNullable()
      table.string('password', 255).notNullable()
      table.specificType('status', 'smallint').notNullable().defaultTo(0)
      table.string('reset_password_token').nullable()
      table.boolean('reset_password_required').defaultTo(0)
      table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
