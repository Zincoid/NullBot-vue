/**
 * 基本规则
 */

export const requiredRule = (message) => ({ required: true, message, trigger: 'blur' })

export const lengthRule = (min, max, message) => ({ min, max, message, trigger: 'blur' })

export const regRule = (reg, message) => ({ reg, message, trigger: 'reg' })

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


/**
 * 复合规则
 */

export const passwordRules = (type) => [
  requiredRule(`${type || ''}密码不能为空`),
  lengthRule(6, 20, `${type || ''}密码长度必须在6~20位之间`)
]

export const emailRules = () => [
  requiredRule('邮箱不能为空'),
  regRule(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/, '邮箱格式错误')
]
