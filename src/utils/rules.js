export const requiredRule = (message) => ({ required: true, message, trigger: 'blur' })

export const passwordRules = () => [
  requiredRule('新密码不能为空'),
  { min: 6, max: 20, message: '新密码长度必须在6~20位之间', trigger: 'blur' }
]

export const confirmPasswordRules = (getNewPassword) => [
  requiredRule('确认密码不能为空'),
  {
    validator: (rule, value, callback) => {
      if (value !== getNewPassword()) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
]
