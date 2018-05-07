import { wrap, unwrap, getStyle, setStyle, getOffset, getHeight, getScrollTop } from './utils'

/**
 * Pin 类
 */
export default class Pin {
  /**
   * 构造函数
   * @param  {Element} el       DOM元素
   * @param  {Object}  options  选项
   * @return {Pin}              Pin实例
   */
  constructor (el, options) {
    // 定义属性
    this.$el = el
    this.$win = window
    this.scrollY = 0
    this.elements = []
    this.disabled = false
    this.options = options || {}
    this.data = {}

    // 初始化
    this._init()
  }

  /**
   * 更新
   */
  update () {
    this._recalculateLimits()
    this._onScroll()
  }

  /**
   * 初始化
   */
  _init () {
    // 初始化 data
    let data = this.data
    if (!data.update) {
      this.elements.push(this.$el)
      Array.prototype.forEach.call(this.$el.getElementsByTagName('img'), item => {
        item.addEventListener('load', () => {
          this._recalculateLimits()
          this.removeEventListener('load')
        })
      })
      data.update = this.update
      this.data = data
    }

    // 监听事件
    this.$win.addEventListener('scroll', () => { this._onScroll() })
    this.$win.addEventListener('resize', () => { this._recalculateLimits() })
    this._recalculateLimits()
    this.$win.addEventListener('load', () => { this.update() })
  }

  /**
   * 计算状态值
   */
  _recalculateLimits () {
    for (let i = 0, len = this.elements.length; i < len; i++) {
      let $el = this.elements[i]

      if (this.options.minWidth && this.$win.innerWidth <= this.options.minWidth) {
        if ($el.parentNode.matches('.pin-wrapper')) { unwrap($el) }
        setStyle($el, {width: '', left: '', top: '', position: ''})
        if (this.options.activeClass) { $el.classList.remove(this.options.activeClass) }
        this.disabled = true
        continue
      } else {
        this.disabled = false
      }

      let $container = this.options.containerSelector ? $el.closest(this.options.containerSelector) : document.body
      let offset = getOffset($el)
      let containerOffset = getOffset($container)
      let parentOffset = getOffset($el.offsetParent)

      if (!$el.parentNode.matches('.pin-wrapper')) {
        let warpEl = document.createElement('div')
        warpEl.className = 'pin-wrapper'
        wrap($el, warpEl)
      }

      let pad = Object.assign({}, {
        top: 0,
        bottom: 0
      }, this.options.padding || {})
      let data = {
        pad: pad,
        // from: offset.top - pad.top,
        from: (this.options.containerSelector ? containerOffset.top : offset.top) - pad.top,
        to: containerOffset.top + getHeight($container) - $el.clientHeight - pad.bottom,
        end: containerOffset.top + getHeight($container),
        parentTop: parentOffset.top
      }
      this.data = data

      setStyle($el, { width: $el.clientWidth })
      setStyle($el.parentNode, { height: $el.clientHeight })
    }
  }

  /**
   * 滚动事件处理方法
   */
  _onScroll () {
    if (this.disabled) { return }

    this.scrollY = getScrollTop()

    let elmts = []
    for (let i = 0, len = this.elements.length; i < len; i++) {
      let $el = this.elements[i]
      let data = this.data

      if (!data) continue

      elmts.push($el)

      let from = data.from - data.pad.bottom
      let to = data.to - data.pad.top

      if (from + $el.clientHeight > data.end) {
        $el.style.position = ''
        continue
      }

      if (scrollY > from && scrollY < to) {
        if (!(getStyle($el, 'position') === 'fixed')) {
          setStyle($el, {
            left: getOffset($el).left,
            top: data.pad.top,
            position: 'fixed'
          })
        }
        if (this.options.activeClass) { $el.classList.add(this.options.activeClass) }
      } else if (scrollY >= to) {
        setStyle($el, {
          left: '',
          top: to - data.parentTop + data.pad.top,
          position: 'absolute'
        })
        if (this.options.activeClass) { $el.classList.add(this.options.activeClass) }
      } else {
        setStyle($el, {
          left: '',
          top: '',
          position: ''
        })
        if (this.options.activeClass) { $el.classList.remove(this.options.activeClass) }
      }
    }
    this.elements = elmts
  }
}
