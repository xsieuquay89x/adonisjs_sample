import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RbacItemChildren extends BaseSchema {
  protected tableName = 'rbac_item_children'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.timestamps(true)
      table
        .uuid('child_id')
        .index()
        .references('id')
        .inTable('rbac_item')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
      table
        .uuid('parent_id')
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
