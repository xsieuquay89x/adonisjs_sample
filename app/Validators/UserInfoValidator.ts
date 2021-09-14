import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class UserInfoValidator {
  public static UserInfoCreateSchema() {
    return schema.create({
      first_name: schema.string({ escape: true, trim: true }, [rules.required()]),
      last_name: schema.string({ escape: true, trim: true }, [rules.required()]),
      address1: schema.string({ trim: true }, [rules.required()]),
      gender: schema.string({}, [rules.required()]),
      dob: schema.date({ format: 'yyyy-MM-dd' }, [rules.required()]),
      city: schema.string({}, [rules.required()]),
      country: schema.string({}, [rules.required()]),
      email: schema.string({}, [
        rules.required(),
        rules.unique({
          table: 'user_info',
          column: 'email',
          caseInsensitive: true,
          where: { deleted_at: null },
        }),
        rules.email({
          sanitize: true,
          ignoreMaxLength: true,
          domainSpecificValidation: true,
        }),
      ]),
      mobile: schema.string({}, [
        rules.required(),
        rules.unique({
          table: 'user_info',
          column: 'mobile',
          caseInsensitive: true,
          where: { deleted_at: null },
        }),
      ]),
      image_id: schema.string.optional({}, [rules.uuid({ version: 4 })]),
    })
  }

  public static UserInfoUpdateSchema(id: any) {
    return schema.create({
      first_name: schema.string({ escape: true, trim: true }, [rules.required()]),
      last_name: schema.string({ escape: true, trim: true }, [rules.required()]),
      address1: schema.string({ trim: true }, [rules.required()]),
      gender: schema.string({}, [rules.required()]),
      dob: schema.date({ format: 'yyyy-MM-dd' }, [rules.required()]),
      city: schema.string({}, [rules.required()]),
      country: schema.string({}, [rules.required()]),
      mobile: schema.string({}, [
        rules.required(),
        rules.unique({
          table: 'user_info',
          column: 'mobile',
          caseInsensitive: true,
          where: { deleted_at: null },
          whereNot: { id: id },
        }),
      ]),
      image_id: schema.string.optional({}, [rules.uuid({ version: 4 })]),
    })
  }

  public static UserInfoMessage() {
    return {
      required: 'The {{ field }} is required',
      uuid: 'The {{ field }} is wrong format',
      date: 'The {{ field }} is wrong format',
      email: 'The {{ field }} is wrong format',
      unique: 'The {{ field }} existed',
    }
  }
}
