import { requiredRule, createPasswordRules } from "../utils/rules";


export const loginFormRules = {
  id: [requiredRule('账号不能为空')],
  password: createPasswordRules(),
}