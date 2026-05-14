import { requiredRule } from '../utils/rules'

export const registFormRules = {
  id: [requiredRule('账号不能为空')],
  password: [requiredRule('密码不能为空')],
  email: [requiredRule('邮箱不能为空')],
  activationCode: [requiredRule('激活码不能为空')],
}
