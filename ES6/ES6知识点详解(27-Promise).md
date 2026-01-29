# ES6 知识点详解（27-Promise）

这份文档会用通俗易懂的方式讲解 ES6 中 **Promise** 的核心知识点。

---

## 📌 什么是 Promise？

### 一句话解释

**Promise** 是 ES6 提出的**异步优化处理方案**，主要用于解决**回调地狱**问题。

### 什么是回调地狱？

当我们需要按顺序执行多个异步操作时，回调函数会层层嵌套：

```javascript
// ❌ 回调地狱示例
ajax("GET", "./data/a.json", function(resA) {
    ajax("GET", "./data/b.json", function(resB) {
        ajax("GET", "./data/c.json", function(resC) {
            ajax("GET", "./data/d.json", function(resD) {
                // 越嵌越深，代码难以阅读和维护
                console.log(resA, resB, resC, resD);
            });
        });
    });
});
```

**通俗理解**：回调地狱就像俄罗斯套娃，一层套一层，越套越深，看得人头晕眼花。

---

## 📌 Promise 基本语法

### 创建 Promise

```javascript
new Promise(function(resolve, reject) {
    // 异步操作
    setTimeout(function() {
        // 成功时调用 resolve
        resolve("成功");
        
        // 失败时调用 reject
        // reject("失败");
    }, 1000);
})
```

### 处理结果

```javascript
new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve("成功");
    }, 1000);
}).then(function(res) {
    console.log(res);  // 处理成功结果
}).catch(function(err) {
    console.log(err);  // 处理失败结果
});
```

| 参数/方法 | 说明 |
|:---------|:-----|
| `resolve` | 成功时调用的回调函数，会触发 `.then()` |
| `reject` | 失败时调用的回调函数，会触发 `.catch()` |
| `.then()` | 处理成功状态 |
| `.catch()` | 处理失败状态 |

**通俗理解**：
- Promise 就像一个"承诺"，它承诺在未来某个时刻给你一个结果
- `resolve` = 承诺兑现了 ✅
- `reject` = 承诺没兑现 ❌

---

## 📌 Promise 的三种状态

Promise 有且只有三种状态：

| 状态 | 英文 | 说明 |
|:-----|:-----|:-----|
| 等待状态 | `pending` | 初始状态，既没有成功也没有失败 |
| 成功状态 | `fulfilled` | 调用 `resolve()` 后进入 |
| 失败状态 | `rejected` | 调用 `reject()` 后进入 |

### 状态转换规则

```
     ┌──────────────────────────────────────────┐
     │                                          │
     │              pending（等待中）            │
     │                                          │
     └──────────────────────────────────────────┘
                ↙                    ↘
     调用 resolve()               调用 reject()
              ↓                          ↓
     ┌────────────────┐        ┌────────────────┐
     │   fulfilled    │        │    rejected    │
     │   （成功）      │        │    （失败）     │
     └────────────────┘        └────────────────┘
            ↓                          ↓
      触发 .then()               触发 .catch()
```

> ⚠️ **重要**：状态一旦改变就**不可逆转**！只能从 `pending` → `fulfilled` 或 `pending` → `rejected`，不能反过来，也不能从 `fulfilled` 变成 `rejected`。

---

## 📌 实际使用示例

### 示例1：封装 Ajax 请求

```javascript
// 把 ajax 请求封装成 Promise
let pro1 = new Promise(function(resolve, reject) {
    ajax("GET", "./data/a.json", function(res) {
        resolve(res);  // 请求成功，把结果传给 resolve
    });
});

// 使用 Promise
pro1.then(function(res) {
    console.log(res);  // 在这里处理请求结果
});
```

### 示例2：保存 Promise 到变量

```javascript
// 创建 Promise 并保存
let pro1 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve("1秒后成功");
    }, 1000);
});

// 之后可以随时使用
pro1.then(function(res) {
    console.log(res);
}).catch(function(err) {
    console.log(err);
});
```

---

## 📌 Promise.all() - 等待所有完成

### 作用

接收一个 Promise 数组，**当所有 Promise 都成功时**，才调用 `.then()`。

### 语法

```javascript
Promise.all([promise1, promise2, promise3])
    .then(function(res) {
        // 所有都成功时执行
        // res 是一个数组，包含所有 Promise 的成功结果
    })
    .catch(function(err) {
        // 任意一个失败时执行
    });
```

### 详细示例

```javascript
let pro1 = new Promise(function(resolve, reject) {
    ajax("GET", "./data/a.json", function(res) {
        resolve(res);
    });
});

let pro2 = new Promise(function(resolve, reject) {
    ajax("GET", "./data/b.json", function(res) {
        resolve(res);
    });
});

let pro3 = new Promise(function(resolve, reject) {
    ajax("GET", "./data/c.json", function(res) {
        resolve(res);
    });
});

// 等待所有请求完成
Promise.all([pro1, pro2, pro3]).then(function(res) {
    console.log(res);  // [a的数据, b的数据, c的数据]
}).catch(function(err) {
    console.log(err);  // 任意一个失败就进入这里
});
```

### 特点总结

| 特点 | 说明 |
|:-----|:-----|
| 成功条件 | **所有** Promise 都必须成功 |
| 失败条件 | **任意一个** Promise 失败就立即失败 |
| 返回值 | 成功时返回一个**数组**，按原顺序包含所有结果 |

**通俗理解**：`Promise.all()` 就像班级考试，**全班都及格**才算这场考试成功，只要有一个人不及格，就算失败。

### 使用场景

- 页面加载时需要同时请求多个接口的数据
- 需要等待多个异步操作都完成后再进行下一步

---

## 📌 Promise.race() - 谁快用谁

### 作用

接收一个 Promise 数组，**第一个完成的 Promise** 决定最终结果。

### 语法

```javascript
Promise.race([promise1, promise2, promise3])
    .then(function(res) {
        // 第一个成功的结果
    })
    .catch(function(err) {
        // 第一个失败的结果
    });
```

### 详细示例

```javascript
let pro1 = new Promise(function(resolve, reject) {
    setTimeout(() => resolve("pro1 - 3秒"), 3000);
});

let pro2 = new Promise(function(resolve, reject) {
    setTimeout(() => resolve("pro2 - 1秒"), 1000);  // 最快
});

let pro3 = new Promise(function(resolve, reject) {
    setTimeout(() => resolve("pro3 - 2秒"), 2000);
});

Promise.race([pro1, pro2, pro3]).then(function(res) {
    console.log(res);  // "pro2 - 1秒" - 因为 pro2 最先完成
}).catch(function(err) {
    console.log("失败", err);
});
```

### 特点总结

| 特点 | 说明 |
|:-----|:-----|
| 成功条件 | 第一个完成的是成功状态 |
| 失败条件 | 第一个完成的是失败状态 |
| 返回值 | 只返回**最快完成的那一个**结果 |

**通俗理解**：`Promise.race()` 就像赛跑🏃，谁先跑到终点线，就用谁的成绩，其他人的成绩不管了。

### 使用场景

- **请求超时处理**：常用于设置请求超时

```javascript
// 超时处理示例
let request = new Promise((resolve, reject) => {
    ajax("GET", "./data/a.json", function(res) {
        resolve(res);
    });
});

let timeout = new Promise((resolve, reject) => {
    setTimeout(() => reject("请求超时"), 5000);  // 5秒超时
});

Promise.race([request, timeout])
    .then(res => console.log("成功:", res))
    .catch(err => console.log("失败:", err));
// 如果请求5秒内没返回，就会输出 "失败: 请求超时"
```

---

## 📌 Promise.resolve() 和 Promise.reject()

这是两个**快捷方法**，用于快速创建已经确定状态的 Promise。

### Promise.resolve() - 创建成功的 Promise

```javascript
// 直接创建一个成功状态的 Promise
Promise.resolve("成功").then(function(res) {
    console.log(res);  // 输出: 成功
});

// 等价于
new Promise(function(resolve, reject) {
    resolve("成功");
}).then(function(res) {
    console.log(res);
});
```

### Promise.reject() - 创建失败的 Promise

```javascript
// 直接创建一个失败状态的 Promise
Promise.reject("失败").catch(function(err) {
    console.log(err);  // 输出: 失败
});

// 等价于
new Promise(function(resolve, reject) {
    reject("失败");
}).catch(function(err) {
    console.log(err);
});
```

### 使用场景

- 在代码中需要快速返回一个 Promise 时
- 测试和调试 Promise 链时

---

## 📌 Promise.all() vs Promise.race() 对比

| 对比项 | `Promise.all()` | `Promise.race()` |
|:------|:----------------|:-----------------|
| **成功条件** | 所有都成功 | 第一个完成的成功 |
| **失败条件** | 任意一个失败 | 第一个完成的失败 |
| **返回值** | 所有结果的数组 | 最快的那一个结果 |
| **比喻** | 班级考试全部及格 | 赛跑取第一名 |
| **常用场景** | 同时请求多个接口 | 超时处理 |

---

## 📌 四种方法速查表

| 方法 | 作用 | 返回值 |
|:-----|:-----|:-------|
| `new Promise()` | 创建一个新的 Promise | Promise 对象 |
| `Promise.all()` | 等待所有 Promise 完成 | 所有结果的数组 |
| `Promise.race()` | 返回最快完成的 Promise | 最快的那个结果 |
| `Promise.resolve()` | 快速创建成功的 Promise | 成功的 Promise |
| `Promise.reject()` | 快速创建失败的 Promise | 失败的 Promise |

---

## 📌 链式调用（高级用法）

Promise 支持链式调用，可以优雅地处理多个异步操作：

```javascript
// 链式调用示例
new Promise(function(resolve, reject) {
    ajax("GET", "./data/a.json", function(res) {
        resolve(res);
    });
}).then(function(resA) {
    console.log("第一个请求完成:", resA);
    
    // 返回新的 Promise
    return new Promise(function(resolve, reject) {
        ajax("GET", "./data/b.json", function(res) {
            resolve(res);
        });
    });
}).then(function(resB) {
    console.log("第二个请求完成:", resB);
    
    return new Promise(function(resolve, reject) {
        ajax("GET", "./data/c.json", function(res) {
            resolve(res);
        });
    });
}).then(function(resC) {
    console.log("第三个请求完成:", resC);
}).catch(function(err) {
    console.log("某一步出错了:", err);
});
```

**通俗理解**：链式调用就像接力赛，每个 `.then()` 是一棒，上一棒完成了就把接力棒（数据）传给下一棒。

---

## 📌 常见面试题

### 题目1：以下代码输出什么？

```javascript
console.log(1);

new Promise(function(resolve, reject) {
    console.log(2);
    resolve();
}).then(function() {
    console.log(3);
});

console.log(4);
```

**答案**：`1, 2, 4, 3`

**解释**：
1. `console.log(1)` 同步执行
2. Promise 构造函数是同步执行的，所以 `console.log(2)` 立即执行
3. `.then()` 是异步的，放入微任务队列
4. `console.log(4)` 同步执行
5. 同步代码执行完毕，执行微任务队列中的 `console.log(3)`

---

### 题目2：Promise.all() 和 Promise.race() 的区别？

| 对比 | Promise.all() | Promise.race() |
|:----|:--------------|:---------------|
| 成功 | 全部成功才成功 | 最快的成功就成功 |
| 失败 | 一个失败就失败 | 最快的失败就失败 |
| 返回 | 所有结果数组 | 最快的那个结果 |

---

### 题目3：Promise 有几种状态？可以改变吗？

**答案**：
- 三种状态：`pending`（等待）、`fulfilled`（成功）、`rejected`（失败）
- 状态一旦改变就**不可逆转**
- 只能从 `pending` 变为 `fulfilled` 或 `rejected`

---

## 🎯 总结

| 知识点 | 核心内容 |
|:------|:---------|
| Promise 作用 | 解决回调地狱，优化异步处理 |
| 三种状态 | `pending` → `fulfilled` 或 `rejected`（不可逆） |
| 基本用法 | `new Promise((resolve, reject) => {}).then().catch()` |
| Promise.all() | 所有成功才成功，返回结果数组 |
| Promise.race() | 谁先完成用谁的结果 |
| Promise.resolve/reject | 快速创建已完成状态的 Promise |

---

*希望这份讲解能帮你理解 Promise！有问题随时问～* 😊
