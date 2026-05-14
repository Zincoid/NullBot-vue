import { createRequiredRule, createPasswordRules } from "../utils/rules";


export const loginFormRules = {
  id: [createRequiredRule('账号不能为空')],
  password: createPasswordRules(),
}