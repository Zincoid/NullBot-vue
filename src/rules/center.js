import { createRequiredRule, createPasswordRules, createEqualRule, emailRules } from '../utils/rules'


export const createPasswordChangeFormRules = (getNewPassword) => ({
  oldPassword: [createRequiredRule('旧密码不能为空')],
  newPassword: createPasswordRules('新'),
  confirmPassword: [
    createRequiredRule('确认密码不能为空'),
    createEqualRule(getNewPassword, '两次密码不一致')
  ],
})

export const AdminEditFormRules = {
  username: [createRequiredRule('用户名不能为空')],
  email: emailRules,
}
