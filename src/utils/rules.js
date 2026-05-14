/*
 * 规则命名格式:
 *
 * 单条规则: *Rule(..) -> 单条规则对象
 * 复合规则: *Rules -> 复合规则列表 或 create*Rules(..) -> 复合规则列表
 * 表单规则: *FormRules -> 表单规则对象 或 create*FormRules(..) -> 表单规则对象
 */


/**
 * 基本规则
 */

export const requiredRule = (message) => ({ required: true, message, trigger: 'blur' })

export const lengthRule = (min, max, message) => ({ min, max, message, trigger: 'blur' })

export const regRule = (pattern, message) => ({ pattern, message, trigger: 'blur' })

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

export const createPasswordRules = (type) => [
  requiredRule(`${type || ''}密码不能为空`),
  lengthRule(6, 20, `${type || ''}密码长度必须在6~20位之间`)
]

export const emailRules = [
  requiredRule('邮箱不能为空'),
  regRule(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/, '邮箱格式错误')
]
