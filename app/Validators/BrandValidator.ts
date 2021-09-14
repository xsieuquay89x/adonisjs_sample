import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class BrandValidator {
  public static BrandSchema() {
    return schema.create({
      name: schema.string({ escape: true, trim: true }, [rules.required()]),
      image_id: schema.string.optional({}, [rules.uuid({ version: 4 })]),
    })
  }

  public static BrandMessage() {
    return {
      required: 'The {{ field }} is required',
    }
  }
}
