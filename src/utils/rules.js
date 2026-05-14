export const requiredRule = (message) => ({ required: true, message, trigger: 'blur' })

export const equalRule = (other, message) => ({
  validator: (rule, value, callback) => {
    const target = typeof other === 'function' ? other() : other
    if (value !== target) {
      callback(new Error(message))
    } else {
      callback()
    }
  },
  trigger: 'blur'
})

export const passwordRules = () => [
  requiredRule('密码不能为空'),
  { min: 6, max: 20, message: '密码长度必须在6~20位之间', trigger: 'blur' }
]

export const confirmPasswordRules = (getNewPassword) => [
  requiredRule('确认密码不能为空'),
  equalRule(getNewPassword, '两次密码不一致')
]
