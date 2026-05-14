import { emailRules, passwordRules, requiredRule } from '../utils/rules'

export const registFormRules = {
  id: [requiredRule('账号不能为空')],
  password: passwordRules(),
  email: emailRules(),
  activationCode: [requiredRule('激活码不能为空')],
}
