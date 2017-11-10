/**
 * 包裹 DOM 元素
 * @param  {HTMLElement} el      被包裹元素
 * @param  {HTMLElement} wrapEl  包裹元素
 */
export const wrap = (el, wrapEl) => {
  let wrapper = wrapEl || document.createElement('div')
  el.parentNode.insertBefore(wrapper, el)
  el.parentNode.removeChild(el)
  wrapper.appendChild(el)
}
/**
 * 取消包裹 DOM 元素
 * @param  {HTMLElement} el      需要取消包裹的元素
 */
export const unwrap = (el) => {
  Array.prototype.forEach.call(el.childNodes, (child) => {
    el.parentNode.insertBefore(child, el)
  })
  el.parentNode.removeChild(el)
}

/**
 * 获取样式
 * @param  {HTMLElement} el  DOM 元素
 * @param  {String}      key 样式键（可选）
 * @return {String/Object}   样式值/样式表
 */
export const getStyle = (el, key) => {
  let styles = el.ownerDocument.defaultView.getComputedStyle(el, null)
  if (key) return styles[key]
  return styles
}

/**
 * 设置样式
 * @param  {HTMLElement} el     DOM 元素
 * @param  {Object}      styles 样式表
 */
export const setStyle = (el, styles) => {
  let value = null
  for (let key in styles) {
    value = styles[key]
    if (typeof value === 'number') {
      value = [value, 'px'].join('')
    }
    el.style[key] = value
  }
}

/**
 * 获取元素 offset
 * @param  {HTMLElement} el DOM元素
 * @return {Object}         offset 值
 */
export const getOffset = (el) => {
  let box = el.getBoundingClientRect()

  return {
    top: box.top + window.pageYOffset - document.documentElement.clientTop,
    left: box.left + window.pageXOffset - document.documentElement.clientLeft
  }
}

/**
 * 获取元素高度
 * @param  {HTMLElement} el DOM元素
 * @return {Number}         高度值
 */
export const getHeight = (el) => {
  let styles = getStyle(el)
  let height = el.offsetHeight
  let borderTopWidth = parseFloat(styles.borderTopWidth)
  let borderBottomWidth = parseFloat(styles.borderBottomWidth)
  let paddingTop = parseFloat(styles.paddingTop)
  let paddingBottom = parseFloat(styles.paddingBottom)
  return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom
}

/**
 * 获取文档的 scrollTop
 * @return {Number} scroolTop 值
 */
export const getScrollTop = () => {
  return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
}
