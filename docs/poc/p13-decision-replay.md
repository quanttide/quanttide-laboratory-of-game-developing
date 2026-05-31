# PoC 13 — 决策回放

## 验证目标

记录每次操作并支持按时间线回放，验证"打完一仗后可以看到自己每一步决策"的可行性。

## 审计日志模型

```
AuditEntry {
  id: string
  timestamp: number          // 游戏内时间戳
  turn: number               // 回合数
  type: AuditEntryType       // 事件类型
  phase: GamePhase           // 发生阶段
  actor: string              // 执行者（玩家/AI/系统）
  action: string             // 操作描述
  detail: any                // 详细数据（位置/数值/结果）
  snapshot?: GameState       // 该时刻状态快照
}

AuditEntryType:
  'INTEL_ADOPT' | 'INTEL_IGNORE'
  | 'INTENT_SELECTED' | 'INTENT_CHANGED'
  | 'ORDER_SIGNED'
  | 'UNIT_MOVED' | 'UNIT_ATTACKED' | 'UNIT_DESTROYED'
  | 'TURN_END' | 'PHASE_CHANGE'
  | 'REINFORCEMENT_ARRIVED' | 'EVENT_TRIGGERED'
  | 'COMBAT_RESULT'
```

## 回放功能

```
ReplayController {
  entries: AuditEntry[]
  currentIndex: number
  speed: 1 | 2 | 4

  play(): void              // 从当前位置播放
  pause(): void             // 暂停
  stepForward(): void       // 下一步（增量执行下一条）
  stepBackward(): void      // 上一步（用最近快照 + 增量重放到目标位置）
  jumpTo(turn): void        // 跳转到指定回合
  speedUp(): void           // 加速
  slowDown(): void          // 减速
}
```

**stepBackward 实现方案**：不存储每一步的反向操作。改用快照 + 增量重放——从最近快照出发，重放到目标索引位置。每 N=10 条记录创建一次全状态快照，空间换时间。

## 分支点标记

回放时标记"决策分支点"——玩家做出关键选择的位置：
- 签署命令的时刻
- 选择意图的时刻
- 采用/忽略情报的时刻

分支点显示"如果当时选了另一个..."提示。

## 实现步骤

1. 定义 AuditEntry 数据模型
2. 实现操作记录器（全局中间件/监听器）
3. 给每个操作注入时间戳和回合信息
4. 实现 ReplayController（播放/暂停/步进）
5. 实现回放 UI（时间轴滑块 + 播放控制）
6. 实现状态快照恢复（回到历史某个时间点）
7. 实现分支点标记与展示

## 关键技术

- 事件溯源：所有操作不可变地追加到日志
- 快照 + 增量：每 N 条记录创建快照，回放时从最近快照开始 + 增量重放
- 分支标记仅作提示，不真正分支（若实现 if-then 则复杂度暴增）

## 验收标准

- [ ] 所有玩家操作被记录到审计日志
- [ ] 可完整回放整局游戏
- [ ] 支持暂停/继续/步进
- [ ] 可跳转到指定回合
- [ ] 分支点可见且有明确标记

## 参考

- qtgame-war PRD 设计支柱 4："Every decision is recorded forever"
- qtgame-war `docs/qa/index.md` C06 验证场景
