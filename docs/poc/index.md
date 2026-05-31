# PoC 实现方案索引

## 分组 & 依赖关系

```
P0 — 基础引擎（核心依赖）
├── p01 六角格地图渲染
├── p02 单位放置与移动（依赖 p01）
├── p03 地形系统（依赖 p01）
└── p04 回合流程（依赖 p01, p02, p03）

P1 — 战斗系统（依赖 P0）
├── p05 攻击交互（依赖 p01, p02, p03, p04）
├── p06 兵种差异化（依赖 p05）
└── p07 战场迷雾（依赖 p01, p04）

P2 — 指挥体验（依赖 P0 + P1）
├── p08 指挥所布局
├── p09 意图驱动选项（依赖 p04, p08）
├── p10 命令签署（依赖 p04, p08）
└── p11 执行阶段（依赖 p04, p08, p10）

P3 — 扩展方向（依赖 P0 + P1 + P2）
├── p12 双模式架构（依赖 P0 全）
├── p13 决策回放（依赖 p02, p05）
└── p14 AI 对手（依赖 P0 + P1）
```

## 推荐实施顺序

| 优先级 | PoC | 预估工作量 | 状态 |
|--------|-----|-----------|------|
| 1 | p01 六角格地图 | 小 | ✓ 已实现 |
| 2 | p03 地形系统 | 小 | ✓ 已实现 |
| 3 | p02 单位移动 | 中 | ✓ 已实现 |
| 4 | p04 回合流程 | 中 | ✓ 已实现 |
| 5 | p05 攻击交互 | 中 |
| 6 | p06 兵种差异化 | 小 |
| 7 | p08 指挥所布局 | 中 |
| 8 | p07 战场迷雾 | 中 |
| 9 | p09 意图驱动 | 中 |
| 10 | p10 命令签署 | 小 |
| 11 | p11 执行阶段 | 中 |
| 12 | p14 AI 对手 | 中 |
| 13 | p13 决策回放 | 中 |
| 14 | p12 双模式架构 | 大 |

## 技术栈

| 层 | 推荐选择 |
|----|---------|
| 渲染 | Canvas 2D（见 p01 方案选型） |
| 坐标 | 立方体坐标 (q, r, s) |
| 布局 | CSS Grid + Flexbox |
| 语言 | JavaScript / TypeScript |
| 框架 | 无（纯前端，零依赖） |

## 审计日志接口（跨 PoC 共享）

PoC 02（移动）和 PoC 05（攻击）会写入审计日志。PoC 13 读取日志实现回放。

```
// 全局审计日志接口（PoC 02 / PoC 05 调用）
auditLog.write(event: AuditEntry)

// PoC 13 消费
auditLog.getAll(): AuditEntry[]
auditLog.getByTurn(turn: number): AuditEntry[]
```

---

- [p01 六角格地图渲染](p01-hex-grid.md)
- [p02 单位放置与移动](p02-unit-movement.md)
- [p03 地形系统](p03-terrain.md)
- [p04 回合流程](p04-turn-loop.md)
- [p05 攻击交互](p05-combat.md)
- [p06 兵种差异化](p06-unit-types.md)
- [p07 战场迷雾](p07-fog-of-war.md)
- [p08 指挥所布局](p08-hq-layout.md)
- [p09 意图驱动选项](p09-intent-filtering.md)
- [p10 命令签署](p10-command-signing.md)
- [p11 执行阶段](p11-execution-phase.md)
- [p12 双模式架构](p12-dual-mode.md)
- [p13 决策回放](p13-decision-replay.md)
- [p14 AI 对手](p14-ai-opponent.md)
