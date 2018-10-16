(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['vue-pin'] = factory());
}(this, (function () { 'use strict';

/**
 * 包裹 DOM 元素
 * @param  {HTMLElement} el      被包裹元素
 * @param  {HTMLElement} wrapEl  包裹元素
 */
var wrap = function wrap(el, wrapEl) {
  var wrapper = wrapEl || document.createElement('div');
  el.parentNode.insertBefore(wrapper, el);
  el.parentNode.removeChild(el);
  wrapper.appendChild(el);
};
/**
 * 取消包裹 DOM 元素
 * @param  {HTMLElement} el      需要取消包裹的元素
 */
var unwrap = function unwrap(el) {
  Array.prototype.forEach.call(el.childNodes, function (child) {
    el.parentNode.insertBefore(child, el);
  });
  el.parentNode.removeChild(el);
};

/**
 * 获取样式
 * @param  {HTMLElement} el  DOM 元素
 * @param  {String}      key 样式键（可选）
 * @return {String/Object}   样式值/样式表
 */
var getStyle = function getStyle(el, key) {
  var styles = el.ownerDocument.defaultView.getComputedStyle(el, null);
  if (key) return styles[key];
  return styles;
};

/**
 * 设置样式
 * @param  {HTMLElement} el     DOM 元素
 * @param  {Object}      styles 样式表
 */
var setStyle = function setStyle(el, styles) {
  var value = null;
  for (var key in styles) {
    value = styles[key];
    if (typeof value === 'number') {
      value = [value, 'px'].join('');
    }
    el.style[key] = value;
  }
};

/**
 * 获取元素 offset
 * @param  {HTMLElement} el DOM元素
 * @return {Object}         offset 值
 */
var getOffset = function getOffset(el) {
  if (!el) return { top: 0, left: 0 };
  var box = el.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset - document.documentElement.clientTop,
    left: box.left + window.pageXOffset - document.documentElement.clientLeft
  };
};

/**
 * 获取元素高度
 * @param  {HTMLElement} el DOM元素
 * @return {Number}         高度值
 */
var getHeight = function getHeight(el) {
  var styles = getStyle(el);
  var height = el.offsetHeight;
  var borderTopWidth = parseFloat(styles.borderTopWidth);
  var borderBottomWidth = parseFloat(styles.borderBottomWidth);
  var paddingTop = parseFloat(styles.paddingTop);
  var paddingBottom = parseFloat(styles.paddingBottom);
  return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
};

/**
 * 获取文档的 scrollTop
 * @return {Number} scroolTop 值
 */
var getScrollTop = function getScrollTop() {
  return document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * Pin 类
 */

var Pin$1 = function () {
  /**
   * 构造函数
   * @param  {Element} el       DOM元素
   * @param  {Object}  options  选项
   * @return {Pin}              Pin实例
   */
  function Pin(el, options) {
    classCallCheck(this, Pin);

    // 定义属性
    this.$el = el;
    this.$win = window;
    this.scrollY = 0;
    this.elements = [];
    this.disabled = false;
    this.options = options || {};
    this.data = {};

    // 将 Pin 实例绑定到元素，以便可手动触发 update
    el.pin = this;

    // 初始化
    this._init();
  }

  /**
   * 更新
   */


  createClass(Pin, [{
    key: 'update',
    value: function update() {
      this._recalculateLimits();
      this._onScroll();
    }

    /**
     * 初始化
     */

  }, {
    key: '_init',
    value: function _init() {
      var _this = this;

      // 初始化 data
      var data = this.data;
      if (!data.update) {
        this.elements.push(this.$el);
        Array.prototype.forEach.call(this.$el.getElementsByTagName('img'), function (item) {
          item.addEventListener('load', function () {
            _this._recalculateLimits();
            _this.removeEventListener('load');
          });
        });
        data.update = this.update;
        this.data = data;
      }

      // 监听事件
      this.$win.addEventListener('scroll', function () {
        _this._onScroll();
      });
      this.$win.addEventListener('resize', function () {
        _this._recalculateLimits();
      });
      this._recalculateLimits();
      this.$win.addEventListener('load', function () {
        _this.update();
      });
    }

    /**
     * 计算状态值
     */

  }, {
    key: '_recalculateLimits',
    value: function _recalculateLimits() {
      for (var i = 0, len = this.elements.length; i < len; i++) {
        var $el = this.elements[i];

        if (this.options.minWidth && this.$win.innerWidth <= this.options.minWidth) {
          if ($el.parentNode.matches('.pin-wrapper')) {
            unwrap($el);
          }
          setStyle($el, { width: '', left: '', top: '', position: '' });
          if (this.options.activeClass) {
            $el.classList.remove(this.options.activeClass);
          }
          this.disabled = true;
          continue;
        } else {
          this.disabled = false;
        }

        var $container = this.options.containerSelector ? $el.closest(this.options.containerSelector) : document.body;
        var offset = getOffset($el);
        var containerOffset = getOffset($container);
        var parentOffset = getOffset($el.offsetParent);

        if (!$el.parentNode.matches('.pin-wrapper')) {
          var warpEl = document.createElement('div');
          warpEl.className = 'pin-wrapper';
          wrap($el, warpEl);
        }

        var pad = Object.assign({}, {
          top: 0,
          bottom: 0
        }, this.options.padding || {});
        var data = {
          pad: pad,
          // from: offset.top - pad.top,
          from: (this.options.containerSelector ? containerOffset.top : offset.top) - pad.top,
          to: containerOffset.top + getHeight($container) - $el.clientHeight - pad.bottom,
          end: containerOffset.top + getHeight($container),
          parentTop: parentOffset.top
        };
        this.data = data;

        setStyle($el, { width: $el.clientWidth });
        setStyle($el.parentNode, { height: $el.clientHeight });
      }
    }

    /**
     * 滚动事件处理方法
     */

  }, {
    key: '_onScroll',
    value: function _onScroll() {
      if (this.disabled) {
        return;
      }

      this.scrollY = getScrollTop();

      var elmts = [];
      for (var i = 0, len = this.elements.length; i < len; i++) {
        var $el = this.elements[i];
        var data = this.data;

        if (!data) continue;

        elmts.push($el);

        var from = data.from - data.pad.bottom;
        var to = data.to - data.pad.top;

        if (from + $el.clientHeight > data.end) {
          $el.style.position = '';
          continue;
        }

        if (scrollY > from && scrollY < to) {
          if (!(getStyle($el, 'position') === 'fixed')) {
            setStyle($el, {
              left: getOffset($el).left,
              top: data.pad.top,
              position: 'fixed'
            });
          }
          if (this.options.activeClass) {
            $el.classList.add(this.options.activeClass);
          }
        } else if (scrollY >= to) {
          setStyle($el, {
            left: '',
            top: to - data.parentTop + data.pad.top,
            position: 'absolute'
          });
          if (this.options.activeClass) {
            $el.classList.add(this.options.activeClass);
          }
        } else {
          setStyle($el, {
            left: '',
            top: '',
            position: ''
          });
          if (this.options.activeClass) {
            $el.classList.remove(this.options.activeClass);
          }
        }
      }
      this.elements = elmts;
    }
  }]);
  return Pin;
}();

/**
 * 指令选项
 * @type {Object}
 */
Pin$1.directiveOptions = {
  inserted: function inserted(el, options) {
    Pin$1.create(el, options.value);
    el.updatePin = Pin$1.create.bind(null, el, options.value);
  },
  componentUpdated: function componentUpdated(el, options) {
    setTimeout(function () {
      Pin$1.create(el, options.value);
    }, 500);
  }

  /**
   * 注入 Vue 插件安装器
   * @param  {Object} Vue        Vue 框架对象
   * @param  {Object} options    use 选项
   */
};Pin$1.install = function (Vue, options) {
  // 注册 vue 指令
  Vue.directive('pin', Pin$1.directiveOptions);
};

/**
 * 快捷创建
 * @param  {Element} el     DOM元素
 * @param  {Options} options 选项
 * @return {Pin}     pin 实例
 */
Pin$1.create = function (el, options) {
  return new Pin$1(el, options);
};

return Pin$1;

})));
//# sourceMappingURL=vue-pin.js.map
