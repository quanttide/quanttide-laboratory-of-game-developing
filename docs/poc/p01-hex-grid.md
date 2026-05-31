# PoC 01 — 六角格地图渲染

- **依赖**：无（基础 PoC）
- **被依赖**：p02, p03, p04, p05, p07

## 验证目标

选择渲染方案并实现可交互六角格网格。

## 背景

qtgame-war 使用 SVG 原型和 Flutter CustomPainter 两种渲染方案。PoC 阶段需确定本实验室的首选方案。

## 方案选型

| 方案 | 优点 | 缺点 |
|------|------|------|
| Canvas 2D | 性能好、灵活度高、浏览器原生支持 | 无 DOM 事件、需手动碰撞检测 |
| SVG | 有 DOM 事件、方便调试、矢量缩放 | 大量元素时性能下降 |
| WebGL | 高性能、支持大规模网格 | 复杂度高、过度设计 |
| Flutter CustomPainter | 跨平台、声明式 | 依赖 Flutter 生态 |

**推荐**：Canvas 2D（性能与灵活性的平衡，适合原型阶段）。

## 数据结构

```
HexGrid {
  hexSize: number          // 六角格边长
  layout: 'pointy' | 'flat'
  origin: { x, y }         // 画布偏移
  cells: HexCell[]         // 所有格子
}

HexCell {
  q, r, s: number          // 立方体坐标 (s = -q - r)
  terrain: TerrainType
  highlighted: boolean
}
```

## 实现步骤

1. 创建 HexGrid 类，支持立方体坐标系统
2. 实现 `hexToPixel(q, r)` 和 `pixelToHex(x, y)` 坐标转换
3. 实现 Canvas 绘制六个顶点的多边形
4. 添加格子高亮（鼠标悬停/选中状态）
5. 添加格子点击事件（像素坐标 → 格子坐标转换）
6. 实现 9x11 标准网格渲染

## 关键技术

- 坐标系统：使用 RedBlobGames 立方体坐标（q, r, s）
- 顶点计算：`pointy_top` 布局，边长60°扇形
- 碰撞检测：像素坐标转立方体坐标后四舍五入取整

## 验收标准

- [ ] 9x11 六角格网格完整渲染
- [ ] 鼠标悬停高亮当前格子
- [ ] 点击格子输出其坐标
- [ ] 窗口缩放时网格保持比例（使用 viewBox + 监听 resize 事件重绘）

## 参考

- qtgame-war `src/studio/lib/models/battlefield.dart`
- RedBlobGames: Hexagonal Grids
