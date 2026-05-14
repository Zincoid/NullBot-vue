/*
 * 表单校验规则工具函数
 *
 * 规则命名格式:
 * 单条规则: create*Rule(..) -> 单条规则对象
 * 复合规则: *Rules 或 create*Rules(..) -> 复合规则列表
 * 表单规则: *FormRules 或 create*FormRules(..) -> 表单规则对象
 * 
 */


// 基本规则

export const createRequiredRule = (message) => ({ required: true, message, trigger: 'blur' })

export const createLengthRule = (min, max, message) => ({ min, max, message, trigger: 'blur' })

export const createRegRule = (pattern, message) => ({ pattern, message, trigger: 'blur' })

export const createEqualRule = (other, message) => ({
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



// 复合规则

export const createPasswordRules = (type) => [
  createRequiredRule(`${type || ''}密码不能为空`),
  createLengthRule(6, 20, `${type || ''}密码长度必须在6~20位之间`)
]

export const emailRules = [
  createRequiredRule('邮箱不能为空'),
  createRegRule(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/, '邮箱格式错误')
]
