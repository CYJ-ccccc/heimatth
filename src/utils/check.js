// 校验手机号
export function phoneDataPass (rule, value, callback) {
  const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('手机号码不正确'))
  }
}
