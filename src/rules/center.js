import { passwordRules, confirmPasswordRules } from '../utils/rules'

export const createPasswordChangeRules = (form) => ({
  oldPassword: passwordRules(),
  newPassword: passwordRules(),
  confirmPassword: confirmPasswordRules(form.newPassword),
})
