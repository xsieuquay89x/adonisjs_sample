import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class ReservationValidator {
  public static ReservationSchema() {
    return schema.create({
      contact_name: schema.string({ escape: true, trim: true }, [rules.required()]),
      contact_phone: schema.string({ escape: true, trim: true }, [rules.required()]),
      pick_date: schema.date.optional({ format: 'yyyy-MM-dd HH:mm:ss z' }, []),
      pick_location: schema.string({ trim: true }, [rules.required()]),
      destination_location: schema.string({ trim: true }, [rules.required()]),
    })
  }

  public static ReservationMessage() {
    return {
      required: 'The {{ field }} is required',
      date: 'The {{ field }} is wrong format',
    }
  }
}
