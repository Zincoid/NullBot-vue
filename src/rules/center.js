import { requiredRule, passwordRules, equalRule } from '../utils/rules'

export const createPasswordChangeRules = (getNewPassword) => ({
  oldPassword: [requiredRule('旧密码不能为空')],
  newPassword: passwordRules('新'),
  confirmPassword: [
    requiredRule('确认密码不能为空'),
    equalRule(getNewPassword, '两次密码不一致')
  ],
})
