import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RbacItems extends BaseSchema {
  protected tableName = 'rbac_item'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.timestamps(true)
      table.uuid('id').primary()
      table.specificType('type', 'smallint').notNullable().defaultTo(0)
      table.string('name', 255).notNullable()
      table.string('description', 255).nullable()
      table.json('data').nullable()
      table.boolean('soft_delete').defaultTo(false)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
