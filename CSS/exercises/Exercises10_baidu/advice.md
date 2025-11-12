# 修改建议

## HTML 结构与语义
- `exercise10.html:2`：`lang="en"` 与页面中文内容不符，建议改为 `zh-CN` 并在 `<head>` 中补充 `meta description`，以便搜索与朗读工具正确处理语言。
- `exercise10.html:31-176` 多处出现 `�?` 字符并导致标签如 `</a>`、`</span>` 被破坏，当前 HTML 无法解析。请确保文件以 UTF-8 保存并修复占位文案（如“百度一下”“0℃”“测运势”等）。
- `exercise10.html:50-67` 搜索框缺少 `<form>`、`label` 与 `name`，输入框与“百度一下”链接只是孤立元素，键盘 Enter 无法提交。建议用 `<form>` 包裹，使用 `<button type="submit">` 并为输入框添加可见或隐藏标签。
- `exercise10.html:72-117` 工具按钮用于跳转，却使用 `<button>` 而非 `<a>`；若未来包裹在表单内会误触提交。请改用语义化标签，并为“更多”菜单添加可访问的 toggle（`aria-expanded`、`aria-controls`）。
- `exercise10.html:91-117` 下拉菜单完全依赖 hover，移动端和键盘用户无法打开。建议使用点击事件或 `details/summary` 结构，并给菜单项提供可读的 `aria-label`/`alt`。
- `exercise10.html:27-38` `user-info` 中大量 `span` 嵌套 `a`，但 `span` 仅用于布局。可以改为 `ul/li` 或把城市、设置等合并成单一 `<a>`，并将图标与文字放在同一个可点击区域，方便触屏。
- `exercise10.html:121-177` “热搜”部分缺少层级标题（`h2/h3`），且 `ol` 被设为无序样式又手动添加数字，语义与表现脱节。建议保留原生编号或改用 `ul` + CSS 伪元素生成序号。
- `exercise10.html:23-177` 多数 `<img>` 的 `alt` 为空，读屏不知道图片用途。请为功能性图标写出描述，如“AI 图标”“天气图标”等。
- `exercise10.html:181` `<footer>` 为空占位，建议填入版权/备案信息或暂时删除。

## CSS 与布局
- `style.css:1-4` 的全局通配符只清除了 `margin/padding` 并设置字体，缺少 `box-sizing: border-box` 且没有中文字体回退。建议在 `html`（或 `*, *::before, *::after`）设置盒模型，并补充 `"PingFang SC", "Microsoft YaHei", sans-serif`。
- `style.css:13-33` 顶部导航依赖 `inline-block + font-size:0` 排列，维护成本高。建议改用 Flex 布局并让 `.nav-bar` 控制对齐，从而移除大量 magic number。
- `style.css:136-205` 搜索区域中输入框宽度写死为 750px，AI 按钮与提交按钮用绝对定位贴在容器边缘，且 `.search-box` 本身未设 `position: relative`。在不同屏宽下会互相遮挡，建议用 Flex/Grid 重新编排，或至少给 `.search-box` 定位并用 `calc()` 计算输入宽度。
- `style.css:180-187` 使用 `scale: 150%` 属性，兼容性差。应改为 `transform: scale(1.5)` 并结合 `transition` 控制放大效果。
- `style.css:136`, `257`, `361` 等处大量固定宽度（800px、790px），导致移动端无法适配。推荐通过 `max-width: 820px; width: min(90vw, 820px);`、媒体查询和 `gap` 构建响应式布局。
- `style.css:257-358` 工具栏和菜单的色值、圆角、阴影在多个选择器中重复。可以抽取 CSS 变量或公用类（如 `.card`、`.tag`），保持一致性也便于主题定制。
- `style.css:371-391` “热搜”区域依赖 `float` 与 `inline-block`，没有清除浮动会影响后续内容高度。建议改为 `display:grid` 或 `flex`，并通过 `gap` 控制列间距。
- `style.css:395-434` 通过额外 `<span class="num">` 等标签写死序号和“热”标识，使 HTML 冗长。推荐用 `counter-increment` 与伪元素生成序号，用 `.hot-list__item--hot::after` 添加标签。

## 命名与可维护性
- 类名混合使用组件式与通用名（如 `.nav-bar`, `.hot-list-right`, `.menu-wrapper`, `.logo`），缺少统一规则。建议采用 BEM 或其它命名体系（例如 `header__nav`, `search-box__tools`），防止后续样式冲突。
- 状态样式目前依赖 `.num1/.num2/.num3` 这样的硬编码类。可改为语义化修饰符（如 `.hot-list__item--top`、`.hot-list__item--new`）或用数据驱动的 `data-rank` 属性，让 CSS 更可读。

## 交互与内容体验
- 导航链接 `href=""`（`exercise10.html:15-24`）会让浏览器刷新到页面顶部。请改为真实地址或 `href="#"` 并阻止默认行为。
- 工具区按钮缺少 `type="button"`、`title`/`aria-label`，图标也没有隐藏文本，键盘/读屏用户无法理解其作用。建议在按钮内添加描述文本或 `aria-label`，并设置 `type` 防止误提交。
- 所有功能性图片均从外部 CDN 加载（含二维码），一旦离线或被拦截就出现大片空白。可以在 `assets` 目录准备本地占位图，同时给 `<img>` 添加 `loading="lazy"`。
- 页面缺少交互反馈：搜索框 focus 与按钮 hover 只改变颜色。可为主要组件添加 `transition`，并在 `@media (prefers-reduced-motion: reduce)` 中降级动画，提升体验。
