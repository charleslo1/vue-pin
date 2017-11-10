# Inrto
使用 Vue 指令快速的 “钉”住某个元素，移植于 [jQuery.pin](https://github.com/webpop/jquery.pin)

# Install

``` sh
npm install vue-pin --save
```

# Usage

## 初始化

``` js
import Vue from 'vue'
import Pin from 'vue-pin'

// install
Vue.use(Pin)
```

## 基于 Vue 指令使用

``` html
<template>
    <!-- 常规使用 -->
    <nav v-pin>
        <ul>
            <li>Home</li>
        </ul>
        <ul>
            <li>Products</li>
        </ul>
        <ul>
            <li>About</li>
        </ul>
    </nav>

    <!-- 自定义选项 -->
    <aside v-pin="{containerSelector: '.container', padding: {top: 10, bottom: 10}}">
        <ul>
            <li>Inbox</li>
        </ul>
        <ul>
            <li>Today</li>
        </ul>
        <ul>
            <li>All</li>
        </ul>
    </aside>
</template>

<script>
export default {
}
</script>
```

## 非 Vue 框架使用

``` js
import Pin from 'pin'

// 获取元素
var el = document.querySelector('.nav')
// 选项（可选）
var options = {
    containerSelector: '.container',
    padding: {
        top: 10,
        bottom: 10
    }
}

// 实例化
var pin = new Pin(el, options)
// 或
Pin.create(el, options)

```

# options

* containerSelector: 要使固定的元素保留在外部容器中，请使用 containerSelector 选项
* padding: 使用 padding 选项可以为固定元素添加 top/bottom填充

# Links
[jQuery.pin](https://github.com/webpop/jquery.pin)
