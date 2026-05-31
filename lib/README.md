# 共享库

PoC 间可复用的核心模块。

| 文件 | 全局命名空间 | 用途 |
|------|-------------|------|
| `hex.js` | `Hex` | 六角格坐标系统、Canvas 绘制、网格遍历 |
| `terrain.js` | `TerrainLib` | 地形定义、地图预设、图例生成 |
| `unit.js` | `UnitLib` | 单位模型、BFS 移动范围计算、单位绘制 |
| `ui.css` | — | 公共样式（深色主体、居中布局、信息栏） |

## 加载方式

直接通过 `<script src>` 和 `<link>` 引用（支持 `file://` 协议）：

```html
<link rel="stylesheet" href="../../lib/ui.css">
<script src="../../lib/hex.js"></script>
<script src="../../lib/terrain.js"></script>
<script src="../../lib/unit.js"></script>
```

## Hex API

| 函数 | 参数 | 返回 |
|------|------|------|
| `hexToPixel(q, r, hexSize)` | 立方体坐标 + 边长 | `{x, y}` |
| `pixelToHex(px, py, hexSize)` | 像素坐标 + 边长 | `{q, r}` |
| `cubeRound(q, r)` | 浮点立方体坐标 | `{q, r}` 取整 |
| `corners(cx, cy, hexSize)` | 六角格中心 | 6 个 `{x,y}` 顶点 |
| `canvasSize(cols, rows, hexSize)` | 网格参数 | `{width, height}` |
| `path(ctx, cx, cy, hexSize)` | 构建六角格 Canvas 路径 | — |
| `eachCell(cols, rows, fn)` | 遍历所有格子 | — |
| `NEIGHBORS` | — | 6 个邻格偏移常量 |

## TerrainLib API

| 函数 | 返回 |
|------|------|
| `fromIndex(map, q, r)` | 地形对象 |
| `defaultMap9x11()` | 9x11 预设地图数组 |
| `defaultMap9x7()` | 9x7 预设地图数组 |
| `legendHTML()` | 图例 HTML 字符串 |

## UnitLib API

| 函数 | 参数 | 返回 |
|------|------|------|
| `create(side, q, r, movePts)` | 单位属性 | 单位对象 |
| `resetIdCounter()` | — | — |
| `occupiedSet(units)` | 单位数组 | 已占格 `Set<string>` |
| `findAt(q, r, units)` | 坐标 | 单位对象或 null |
| `moveRange(unit, units, cols, rows, getCost)` | — | `Map<key, cost>` |
| `draw(ctx, unit, hexSize, highlight)` | 绘制上下文 | — |
