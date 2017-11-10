import Pin from './src/Pin'

/**
 * 指令选项
 * @type {Object}
 */
Pin.directiveOptions = {
  inserted: function (el, options) {
    Pin.create(el, options.value)
  },
  componentUpdated: function (el, options) {
    setTimeout(() => { Pin.create(el, options.value) }, 500)
  }
}

/**
 * 注入 Vue 插件安装器
 * @param  {Object} Vue        Vue 框架对象
 * @param  {Object} options    use 选项
 */
Pin.install = function (Vue, options) {
  // 注册 vue 指令
  Vue.directive('pin', Pin.directiveOptions)
}

/**
 * 快捷创建
 * @param  {Element} el     DOM元素
 * @param  {Options} options 选项
 * @return {Pin}     pin 实例
 */
Pin.create = function (el, options) {
  return new Pin(el, options)
}

// export
export default Pin
