import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class BrandValidator {
  public static ModelSchema() {
    return schema.create({
      name: schema.string({ escape: true, trim: true }, [rules.required()]),
      brand_id: schema.string({}, [rules.required()]),
      image_id: schema.string.optional({}, [rules.uuid({ version: 4 })]),
    })
  }

  public static ModelMessage() {
    return {
      required: 'The {{ field }} is required',
      uuid: 'The {{ field }} is wrong format',
    }
  }
}
