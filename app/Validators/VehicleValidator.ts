import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class VehicleValidator {
  public static VehicleSchema() {
    return schema.create({
      name: schema.string({ escape: true, trim: true }, [rules.required()]),
      color: schema.string({ trim: true }, [rules.required()]),
      mileage: schema.number(),
      plate_number: schema.string(),
      manufactured_date: schema.date.optional({ format: 'yyyy-MM-dd' }, []),
      purchased_date: schema.date.optional({ format: 'yyyy-MM-dd' }, []),
      owner_id: schema.string({}, [rules.required(), rules.uuid({ version: 4 })]),
      model_id: schema.string({}, [rules.required(), rules.uuid({ version: 4 })]),
      image_id: schema.string.optional({}, [rules.uuid({ version: 4 })]),
    })
  }

  public static VehicleMessage() {
    return {
      required: 'The {{ field }} is required',
      uuid: 'The {{ field }} is wrong format',
      date: 'The {{ field }} is wrong format',
    }
  }
}
