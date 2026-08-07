---
title: JavaScript的数组方法
date: 2026-08-06
updated: 2026-08-06
tags:
  - JavaScript
categories:
  - 前端
description: 全面梳理 JavaScript 数组的增删改查、遍历、排序、归并等核心方法，结合实战场景掌握每个方法的最佳用法。
keywords:
  - 数组
  - Array
  - reduce
  - map
  - filter
  - JavaScript
---

## 前言

数组是前端开发中最常用的数据结构，JS 提供了 30+ 个数组方法。本文按功能分类整理，每个方法配实战场景，帮你告别"只会 forEach"的尴尬。

<!-- more -->

## 一、增删改查

### push / pop — 尾部操作

```javascript
const arr = [1, 2, 3]

arr.push(4, 5)      // 返回 5（新长度），arr = [1,2,3,4,5]
arr.pop()           // 返回 5（删除的值），arr = [1,2,3,4]
```

> `push` 修改原数组，返回新长度；`pop` 修改原数组，返回被删元素。

### unshift / shift — 头部操作

```javascript
const arr = [2, 3, 4]

arr.unshift(1)      // 返回 4，arr = [1,2,3,4]
arr.shift()         // 返回 1，arr = [2,3,4]
```

> 头部操作比尾部慢，因为需要移动所有元素。大数据量优先用 `push`/`pop`。

### splice — 万能增删改

```javascript
const arr = [1, 2, 3, 4, 5]

// 删除：从索引 2 开始删 2 个
arr.splice(2, 2)    // 返回 [3,4]，arr = [1,2,5]

// 插入：从索引 1 开始删 0 个，插入 'a','b'
arr.splice(1, 0, 'a', 'b')  // arr = [1,'a','b',2,5]

// 替换：从索引 1 开始删 2 个，插入 'x'
arr.splice(1, 2, 'x')       // arr = [1,'x',5]
```

### slice — 切片（不修改原数组）

```javascript
const arr = [1, 2, 3, 4, 5]

arr.slice(1, 3)     // [2, 3]（索引 1 到 3，不含 3）
arr.slice(2)        // [3, 4, 5]（从索引 2 到末尾）
arr.slice(-2)       // [4, 5]（最后两个）

// 快速浅拷贝
const copy = arr.slice() // [1,2,3,4,5]
```

> `slice` 不修改原数组，常用于分页截取和浅拷贝。

## 二、遍历方法（不修改原数组）

### forEach — 纯遍历

```javascript
const arr = [1, 2, 3]

arr.forEach((item, index, array) => {
  console.log(item, index)
})

// ❌ forEach 不能用 break/continue
// ❌ forEach 不能 return 值
// ✅ 适合执行副作用（发请求、DOM 操作等）
```

### map — 映射转换（高频）

```javascript
const users = [{ id: 1, name: '张三' }, { id: 2, name: '李四' }]

// 提取 id 列表
const ids = users.map(u => u.id) // [1, 2]

// 格式化数据
const options = users.map(u => ({
  value: u.id,
  label: u.name
}))
// [{ value: 1, label: '张三' }, { value: 2, label: '李四' }]
```

### filter — 过滤筛选（高频）

```javascript
const list = [1, 2, 3, 4, 5, 6]

// 筛选偶数
const evens = list.filter(n => n % 2 === 0) // [2, 4, 6]

// 筛选有效数据
const users = [{ name: 'a', active: true }, { name: 'b', active: false }]
const activeUsers = users.filter(u => u.active) // [{ name: 'a', active: true }]

// 去重
const unique = list.filter((v, i, arr) => arr.indexOf(v) === i)
```

### find / findIndex — 查找（高频）

```javascript
const users = [{ id: 1, name: '张三' }, { id: 2, name: '李四' }]

// 找到第一个匹配元素（找不到返回 undefined）
const user = users.find(u => u.id === 2) // { id: 2, name: '李四' }

// 找到索引（找不到返回 -1）
const index = users.findIndex(u => u.name === '张三') // 0
```

### some / every — 条件判断

```javascript
const scores = [85, 90, 78, 92]

// 是否有及格的？→ true（只要有一个满足）
scores.some(s => s >= 60)

// 是否全部及格？→ false（需要全部满足）
scores.every(s => s >= 60)

// 实际应用：表单全部填写才允许提交
const fields = ['张三', '13800138000', '']
const allFilled = fields.every(Boolean) // false
```

## 三、归并方法

### reduce — 万能聚合（核心）

```javascript
arr.reduce((prev, cur, index, arr) => { /* ... */ }, initialValue)
```

**场景一：数组求和**

```javascript
const sum = [1, 2, 3, 4].reduce((p, c) => p + c, 0) // 10
```

**场景二：数组对象分组**

```javascript
const list = [
  { type: '水果', name: '苹果' },
  { type: '蔬菜', name: '白菜' },
  { type: '水果', name: '香蕉' }
]

const grouped = list.reduce((acc, item) => {
  (acc[item.type] ||= []).push(item)
  return acc
}, {})
// { 水果: [{type:'水果',name:'苹果'}, ...], 蔬菜: [...] }
```

**场景三：数组去重**

```javascript
const arr = [1, 2, 3, 2, 1, 4]
const unique = arr.reduce((acc, v) => {
  if (!acc.includes(v)) acc.push(v)
  return acc
}, [])
// [1, 2, 3, 4]
```

**场景四：统计出现次数**

```javascript
const names = ['Alice', 'Bob', 'Alice', 'Tom', 'Bob']
const count = names.reduce((acc, name) => {
  acc[name] = (acc[name] || 0) + 1
  return acc
}, {})
// { Alice: 2, Bob: 2, Tom: 1 }
```

**场景五：扁平化嵌套数组**

```javascript
function flatten(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item)
  }, [])
}

flatten([1, [2, [3, 4]]]) // [1, 2, 3, 4]
```

## 四、排序与反转

### sort — 排序（修改原数组）

```javascript
// 数字排序
const nums = [3, 1, 10, 5]
nums.sort((a, b) => a - b)  // [1, 3, 5, 10] 升序
nums.sort((a, b) => b - a)  // [10, 5, 3, 1] 降序

// 对象排序
const list = [{ age: 25 }, { age: 18 }, { age: 30 }]
list.sort((a, b) => a.age - b.age) // 按年龄升序

// 中文排序
const names = ['张三', '李四', '王五']
names.sort((a, b) => a.localeCompare(b))
```

### reverse — 反转（修改原数组）

```javascript
const arr = [1, 2, 3]
arr.reverse() // [3, 2, 1]

// 不修改原数组的写法
const reversed = [...arr].reverse()
```

## 五、连接与填充

### concat — 合并数组

```javascript
const a = [1, 2]
const b = [3, 4]
const c = a.concat(b) // [1, 2, 3, 4]
// 或用展开运算符
const d = [...a, ...b] // [1, 2, 3, 4]
```

### join — 转字符串

```javascript
const arr = ['a', 'b', 'c']
arr.join()      // 'a,b,c'
arr.join('-')   // 'a-b-c'
arr.join('')    // 'abc'
```

### fill — 填充

```javascript
const arr = new Array(5).fill(0) // [0, 0, 0, 0, 0]
;[1, 2, 3, 4].fill('x', 1, 3)   // [1, 'x', 'x', 4]
```

### flat / flatMap — 扁平化

```javascript
const arr = [1, [2, [3, [4]]]]

arr.flat()      // [1, 2, [3, [4]]] 默认一层
arr.flat(2)     // [1, 2, 3, [4]]
arr.flat(Infinity) // [1, 2, 3, 4] 完全扁平

// flatMap = map + flat(1)
const result = [1, 2, 3].flatMap(n => [n, n * 2])
// [1, 2, 2, 4, 3, 6]
```

## 六、实战应用场景

### 1. 树形数据查找节点

```javascript
function findNode(tree, id) {
  for (const node of tree) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

const tree = [
  { id: 1, name: 'root', children: [{ id: 2, name: 'child' }] }
]
console.log(findNode(tree, 2)) // { id: 2, name: 'child' }
```

### 2. 数组转树结构

```javascript
function listToTree(list, parentId = null) {
  return list
    .filter(item => item.pid === parentId)
    .map(item => ({
      ...item,
      children: listToTree(list, item.id)
    }))
}

const list = [
  { id: 1, pid: null, name: 'root' },
  { id: 2, pid: 1, name: 'child' },
  { id: 3, pid: 2, name: 'grandchild' }
]

const tree = listToTree(list)
```

### 3. 数据分页

```javascript
function paginate(arr, page, size) {
  const start = (page - 1) * size
  return arr.slice(start, start + size)
}

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
paginate(data, 2, 3) // [4, 5, 6]
```

### 4. 数组对象去重

```javascript
function uniqueBy(arr, key) {
  const seen = new Map()
  return arr.filter(item => !seen.has(item[key]) && seen.set(item[key], 1))
}

const list = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
  { id: 1, name: 'c' }
]
uniqueBy(list, 'id') // [{ id:1, name:'a' }, { id:2, name:'b' }]
```

### 5. 交集 / 并集 / 差集

```javascript
const a = [1, 2, 3, 4]
const b = [3, 4, 5, 6]

// 交集
const intersection = a.filter(v => b.includes(v)) // [3, 4]

// 并集
const union = [...new Set([...a, ...b])] // [1, 2, 3, 4, 5, 6]

// 差集（a 有 b 没有）
const diff = a.filter(v => !b.includes(v)) // [1, 2]
```

## 七、Vue3 中数组方法的应用

### 1. computed 中的数据处理

```vue
<script setup>
import { ref, computed } from 'vue'

const todos = ref([
  { id: 1, text: '学 Vue', done: true },
  { id: 2, text: '写项目', done: false },
  { id: 3, text: '复习', done: false }
])

// 用 filter + map 派生新数据
const undoneTodos = computed(() =>
  todos.value
    .filter(t => !t.done)
    .map(t => ({ ...t, date: new Date() }))
)

// 用 reduce 统计
const stats = computed(() =>
  todos.value.reduce((acc, t) => {
    t.done ? acc.done++ : acc.undone++
    return acc
  }, { done: 0, undone: 0 })
)
</script>
```

### 2. 级联选择器数据处理

```vue
<script setup>
import { ref, computed } from 'vue'

const regions = ref([
  { id: '1', pid: null, name: '广东省' },
  { id: '2', pid: '1', name: '深圳市' },
  { id: '3', pid: '2', name: '南山区' }
])

// filter + map 构建级联数据
const options = computed(() => {
  // 先转成树
  const provinces = regions.value
    .filter(r => !r.pid)
    .map(p => ({
      value: p.id,
      label: p.name,
      children: regions.value
        .filter(r => r.pid === p.id)
        .map(c => ({
          value: c.id,
          label: c.name,
          children: regions.value
            .filter(r => r.pid === c.id)
            .map(d => ({ value: d.id, label: d.name }))
        }))
    }))
  return provinces
})
</script>
```

### 3. 表格排序与搜索

```vue
<script setup>
import { ref, computed } from 'vue'

const users = ref([
  { name: '张三', age: 25, active: true },
  { name: '李四', age: 30, active: false },
  { name: '王五', age: 20, active: true }
])

const keyword = ref('')
const sortBy = ref('age')

// 搜索 + 排序组合
const filteredUsers = computed(() => {
  return users.value
    .filter(u => u.name.includes(keyword.value))    // 过滤
    .sort((a, b) => a[sortBy.value] > b[sortBy.value] ? 1 : -1) // 排序
})

const activeCount = computed(() =>
  users.value.filter(u => u.active).length
)
</script>
```

### 4. 拖拽排序

```javascript
function handleDragEnd(arr, fromIndex, toIndex) {
  const item = arr.splice(fromIndex, 1)[0]  // 取出
  arr.splice(toIndex, 0, item)              // 插入
}

const list = ref([1, 2, 3, 4, 5])
handleDragEnd(list.value, 0, 3)
// list.value = [2, 3, 4, 1, 5]
```

## 八、性能速查

| 场景 | 推荐方法 | 原因 |
|------|---------|------|
| 遍历执行副作用 | `for...of` / `forEach` | 直接，不需返回值 |
| 映射新数组 | `map` | 语义清晰，链式调用 |
| 筛选条件 | `filter` | 返回新数组，不修改原数组 |
| 找第一个匹配 | `find` / `findIndex` | 找到即停，比 filter 高效 |
| 聚合/统计 | `reduce` | 一次遍历完成多种计算 |
| 有任一满足 | `some` | 找到即停 |
| 全部满足 | `every` | 遇到 false 即停 |
| 大量数据头部操作 | 避免 `unshift`/`shift` | 元素位移开销大 |

## 总结

| 分类 | 方法 |
|------|------|
| 增删改 | `push` `pop` `unshift` `shift` `splice` `slice` |
| 遍历 | `forEach` `map` `filter` `find` `findIndex` `some` `every` |
| 归并 | `reduce` `reduceRight` |
| 排序 | `sort` `reverse` |
| 连接 | `concat` `join` `flat` `flatMap` |
| 其他 | `fill` `includes` `indexOf` `lastIndexOf` `Array.from` `Array.of` |

- 记住每个方法的**返回值**和**是否修改原数组**，是选对方法的关键
- `reduce` 是万能工具，分组、去重、扁平化都能做
- Vue3 中 `computed` + 数组方法 = 声明式数据处理的黄金搭档

---

*内容由 AI 生成，仅供参考。本文发布于 [码上学习](http://www.pfh.bbroot.com)，转载请注明出处。*
