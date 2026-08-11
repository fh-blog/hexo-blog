---
title: Vue3中computed/watch的区别
date: 2026-08-10
updated: 2026-08-10
tags:
  - Vue
categories:
  - 前端
description: 一文讲清 Vue3 中 computed、watch、watchEffect 的核心区别、使用场景和避坑指南，附原理简析和面试回答思路。
keywords:
  - Vue3
  - computed
  - watch
  - watchEffect
  - 响应式
---

## 前言

Vue3 提供了三个处理响应式数据副作用的 API：`computed`、`watch` 和 `watchEffect`。很多开发者容易混淆它们的适用场景。本文将用对比的方式彻底讲清楚。

<!-- more -->

## 一、一句话区别

| API | 一句话 | 触发时机 |
|-----|--------|---------|
| **computed** | 计算一个派生值，自动缓存 | 依赖的响应式数据变化时重新计算 |
| **watch** | 监听特定数据源，执行副作用 | 被监听的数据源变化时回调 |
| **watchEffect** | 自动追踪依赖，立即执行副作用 | 初始化立即执行 + 依赖变化重新执行 |

```javascript
import { ref, computed, watch, watchEffect } from 'vue'

const count = ref(0)

// computed：返回一个只读的计算结果
const double = computed(() => count.value * 2) // 4字口诀：算缓存读

// watch：明确监听某个值，拿到新旧值
watch(count, (newVal, oldVal) => {
  console.log(`${oldVal} → ${newVal}`)
})

// watchEffect：自动追踪，立即执行
watchEffect(() => {
  console.log(`count 变了：${count.value}`) // 立即打印 "count 变了：0"
})
```

## 二、computed 详解

### 基本用法

```javascript
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// 基础写法
const fullName = computed(() => firstName.value + lastName.value)

// 可写 computed
const fullName2 = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(val) {
    [firstName.value, lastName.value] = val.split(' ')
  }
})

fullName2.value = '李 四' // 触发 setter
```

### 核心特性：缓存

```javascript
const count = ref(0)

// 每次访问都执行（没有缓存）
const noCache = () => {
  console.log('计算了一次')
  return count.value * 2
}

// computed 有缓存，依赖不变不重新计算
const withCache = computed(() => {
  console.log('计算了一次')
  return count.value * 2
})

noCache(); noCache(); noCache() // 打印 3 次
withCache.value; withCache.value; withCache.value // 只打印 1 次
```

> **缓存条件**：只有当依赖的响应式数据发生变化时，`computed` 才会重新计算，否则直接返回上一次的结果。

### 使用场景

| 场景 | 示例 |
|------|------|
| 数据格式化 | 价格格式化、日期格式化 |
| 列表过滤/排序 | 搜索过滤表格、按条件排序 |
| 多字段拼接 | 姓名拼接、地址拼接 |
| 条件判断 | 是否禁用按钮、是否展示内容 |
| 数据统计 | 总价/均价计算、数量统计 |

```vue
<script setup>
import { ref, computed } from 'vue'

// 购物车场景
const cartItems = ref([
  { name: 'Vue3 实战', price: 59, count: 2 },
  { name: 'JS 高级', price: 39, count: 1 }
])

// 总价 — computed 自动跟踪 cartItems 变化
const totalPrice = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.count, 0)
)

// 列表过滤
const keyword = ref('')
const filteredItems = computed(() =>
  cartItems.value.filter(item => item.name.includes(keyword.value))
)
</script>
```

---

## 三、watch 详解

### 基本用法

```javascript
import { ref, reactive, watch } from 'vue'

// 监听 ref
const count = ref(0)
watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} → ${newVal}`)
})

// 监听 reactive 对象的属性（用 getter 函数）
const state = reactive({ count: 0, name: 'Vue' })
watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log(newVal, oldVal)
  }
)

// 监听多个数据源
const x = ref(0)
const y = ref(0)
watch([x, y], ([newX, newY], [oldX, oldY]) => {
  console.log(`(${oldX},${oldY}) → (${newX},${newY})`)
})
```

### 深度监听

```javascript
const obj = reactive({
  user: {
    name: '张三',
    profile: { age: 25 }
  }
})

// deep: true 深度监听
watch(
  () => obj.user,
  (newVal) => {
    console.log('user 内部变化了', newVal)
  },
  { deep: true }
)

// 直接监听 reactive 对象默认就是深度监听
watch(obj, (newVal) => {
  console.log('obj 任意属性变化都会触发')
})
```

### immediate：立即执行

```javascript
const keyword = ref('')

// immediate: true → 初始化立即执行一次
watch(keyword, (newVal) => {
  fetchSearchResults(newVal)
}, { immediate: true })
// 等价于：先手动调一次 fetchSearchResults(keyword.value)，再 watch
```

### flush 选项：控制回调时机

```javascript
// pre（默认）：DOM 更新前执行
watch(source, callback, { flush: 'pre' })

// post：DOM 更新后执行，可以安全访问 DOM
watch(source, callback, { flush: 'post' })
// 等价于 watchPostEffect

// sync：同步执行，慎用
watch(source, callback, { flush: 'sync' })
```

### 使用场景

| 场景 | 说明 |
|------|------|
| **路由监听** | `watch(() => route.params.id, fetchData)` |
| **搜索防抖** | 配合 debounce 监听 keyword 变化发请求 |
| **表单联动** | 省变化后自动请求市列表 |
| **新旧值对比** | 需要知道改之前的值是什么 |
| **分页请求** | 页码/页大小变化重新拉数据 |
| **props 变化** | 子组件监听 props 变化做处理 |

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 路由参数变化时重新请求
watch(() => route.params.id, (newId) => {
  fetchArticle(newId)
})

// 搜索防抖
const keyword = ref('')
let timer = null
watch(keyword, (val) => {
  clearTimeout(timer)
  timer = setTimeout(() => fetchSearch(val), 300)
})
</script>
```

---

## 四、watchEffect 详解

### 基本用法

```javascript
import { ref, watchEffect } from 'vue'

const count = ref(0)
const name = ref('Vue')

// 初始化立即执行，自动追踪 count 和 name
watchEffect(() => {
  console.log(`count: ${count.value}, name: ${name.value}`)
  // 立即打印：count: 0, name: Vue
})

count.value++ // 打印：count: 1, name: Vue
name.value = 'Vue3' // 打印：count: 1, name: Vue3
```

> **核心逻辑**：`watchEffect` 会自动追踪回调函数中用到的所有响应式数据，任何一个变化都会重新执行。

### 清除副作用（onCleanup）

```javascript
const userId = ref(1)

watchEffect((onCleanup) => {
  let cancelled = false

  // 注册清理函数：下次执行前 / 组件卸载时自动调用
  onCleanup(() => {
    cancelled = true
  })

  fetchUser(userId.value).then(data => {
    if (!cancelled) {
      console.log('用户信息:', data)
    }
  })
})

// 切换 userId → onCleanup 取消上一次未完成的请求
setTimeout(() => userId.value = 2, 1000)
```

> 典型场景：`userId` 快速切换时，上一次的异步请求还没返回，用 `onCleanup` 丢弃过期结果，防止数据错乱。

### 停止监听

```javascript
// 组件卸载时自动停止（setup 中使用）
const stop = watchEffect(() => { /* ... */ })

// 手动停止
stop()
```

### 使用场景

| 场景 | 说明 |
|------|------|
| **自动追踪多依赖** | 不用手动指定依赖列表 |
| **初始化立即执行** | 页面加载就要运行的副作用 |
| **竞态请求** | 配合 onCleanup 取消过期请求 |
| **非侵入式日志** | 调试时追踪多个状态的变化 |

---

## 五、三者的区别对比

### 核心对比表

| 维度 | computed | watch | watchEffect |
|------|----------|-------|-------------|
| **返回值** | 返回一个 ref（只读） | 无返回值 | 无返回值 |
| **缓存** | ✅ 有缓存 | ❌ 无 | ❌ 无 |
| **首次执行** | 惰性（访问时才计算） | ❌ 不执行（除非 `immediate: true`） | ✅ 立即执行 |
| **依赖追踪** | 自动 | 手动指定 | 自动 |
| **新旧值** | ❌ 不提供 | ✅ `(newVal, oldVal)` | ❌ 不提供 |
| **深度监听** | 自动（getter 中访问到的） | 手动 `{ deep: true }` | 自动（回调中访问到的） |
| **副作用清理** | ❌ | ✅ `onCleanup` | ✅ `onCleanup` |
| **DOM 更新时机** | 同步 | 可控 `flush` | 可控 `flush` |
| **可写** | ✅ 支持 setter | ❌ | ❌ |

### 执行时机图示

```
computed:   依赖变化 → 标记 dirty → 下次访问 .value 时才重新计算

watch:      依赖变化 → 满足条件 → 执行回调（默认 DOM 更新前）

watchEffect: 初始化立即执行 ─→ 依赖变化 → 执行回调（默认 DOM 更新前）
```

### 选择决策树

```
需要返回一个值？
├─ 是 → 用 computed
│     ├─ 只读 → computed(() => ...)
│     └─ 可写 → computed({ get, set })
│
└─ 否 → 需要执行副作用？
      ├─ 需要拿到旧值？→ watch
      ├─ 需要懒执行（不立即触发）？→ watch
      ├─ 需要监听特定数据源（路由/props）？→ watch
      └─ 自动追踪 + 立即执行？→ watchEffect
```

---

## 六、常见误区

### 误区 1：computed 里做副作用

```javascript
// ❌ 错误：computed 里发请求、改 DOM
const data = computed(() => {
  fetch('/api/list').then(...)  // 不应该在 computed 里做
  document.title = '新标题'      // 不应该在 computed 里做
  return list.value.filter(...)
})

// ✅ 正确：computed 只做纯计算，副作用放 watch / watchEffect
const data = computed(() => list.value.filter(...))
watchEffect(() => {
  document.title = `共 ${data.value.length} 条`
})
```

### 误区 2：watchEffect 里修改自身依赖导致死循环

```javascript
// ❌ 错误：死循环
const count = ref(0)
watchEffect(() => {
  count.value++ // 修改了依赖 → 重新执行 → 又修改 → 死循环
})

// ✅ 正确：加条件判断
watchEffect(() => {
  if (count.value < 10) count.value++
})
```

### 误区 3：watch reactive 对象属性不写 getter

```javascript
const state = reactive({ count: 0 })

// ❌ 错误：直接写 state.count 不是响应式引用
watch(state.count, (val) => console.log(val)) // 不会触发

// ✅ 正确：用 getter 函数
watch(() => state.count, (val) => console.log(val))
```

### 误区 4：用 watch 代替 computed

```javascript
// ❌ 写法啰嗦：手动维护一个 ref
const double = ref(0)
watch(count, (val) => { double.value = val * 2 })

// ✅ computed 一行搞定
const double = computed(() => count.value * 2)
```

---

## 七、原理简析

### computed 的 dirty 标记

```javascript
// 简化版 computed 实现
function computed(getter) {
  let value        // 缓存值
  let dirty = true // 脏标记

  const effect = () => {
    value = getter()
    dirty = false
  }

  return {
    get value() {
      if (dirty) {
        effect()     // 依赖变了 → 重新计算
      }
      return value   // 依赖没变 → 返回缓存
    }
  }
}
```

### watchEffect 的自动追踪

```javascript
// 简化版 watchEffect 实现
function watchEffect(fn) {
  const effect = () => {
    activeEffect = effect  // 设置当前活跃的 effect
    fn()                   // 执行 fn，fn 里读取的响应式数据会通过 track 收集该 effect
    activeEffect = null
  }
  effect() // 立即执行
}
```

> `watch` 和 `watchEffect` 底层都依赖 `ReactiveEffect`，区别在于 `watch` 手动指定依赖，`watchEffect` 自动追踪。

---

## 八、面试回答思路

> 问："computed、watch、watchEffect 有什么区别？"

**建议回答框架：**

1. **先给一句话定义**：computed 是计算派生值有缓存，watch 是手动监听特定源，watchEffect 是自动追踪+立即执行
2. **说核心差异**：缓存（computed 有，watch 没有）、旧值（watch 有，computed/watchEffect 没有）、首次执行（watchEffect 立即，computed 惰性，watch 默认不执行）
3. **举典型场景**：
   - computed → 格式化、过滤、统计
   - watch → 路由监听、搜索防抖、props 变化
   - watchEffect → 多依赖自动追踪、竞态清理
4. **提一下原理**：computed 基于 dirty 标记实现缓存；watch 和 watchEffect 底层都是 ReactiveEffect

---

## 总结

| 选型 | 条件 |
|------|------|
| **computed** | 需要基于现有数据计算一个新值，且希望自动缓存 |
| **watch** | 需要知道具体哪个值变了（新旧值），或只监听特定源不立即执行 |
| **watchEffect** | 不关心具体哪个值变了，只需自动追踪依赖并在变化时执行副作用 |

记住这三句话就不会选错：**算缓存用 computed，追旧值用 watch，自动跑用 watchEffect**。

---

*内容由 AI 生成，仅供参考。本文发布于 [码上学习](http://www.pfh.bbroot.com)，转载请注明出处。*
