import { emailRules, createPasswordRules, createRequiredRule } from '../utils/rules'


export const registFormRules = {
  id: [createRequiredRule('账号不能为空')],
  password: createPasswordRules(),
  email: emailRules,
  activationCode: [createRequiredRule('激活码不能为空')],
}
