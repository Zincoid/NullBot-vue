import { requiredRule, passwordRules, confirmPasswordRules } from '../utils/rules'

export const createPasswordChangeRules = (getNewPassword) => ({
  oldPassword: passwordRules(),
  newPassword: passwordRules(),
  confirmPassword: confirmPasswordRules(getNewPassword),
})
