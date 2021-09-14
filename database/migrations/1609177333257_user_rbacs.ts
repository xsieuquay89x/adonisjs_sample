import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserRbacs extends BaseSchema {
  protected tableName = 'user_rbac'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.timestamps(true)
      table
        .uuid('user_id')
        .index()
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      table
        .uuid('rbac_item_id')
        .index()
        .references('id')
        .inTable('rbac_item')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
