import { requiredRule, createPasswordRules, equalRule } from '../utils/rules'


export const createPasswordChangeFormRules = (getNewPassword) => ({
  oldPassword: [requiredRule('旧密码不能为空')],
  newPassword: createPasswordRules('新'),
  confirmPassword: [
    requiredRule('确认密码不能为空'),
    equalRule(getNewPassword, '两次密码不一致')
  ],
})
