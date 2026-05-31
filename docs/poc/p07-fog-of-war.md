# PoC 07 — 战场迷雾

## 验证目标

实现敌我视野不对称：未发现敌单位为 `?`、情报可信度分层、情报更新有延迟。

## 情报模型（PoC 阶段简化版）

PoC 阶段先实现二态（可见/不可见），后续迭代扩展为三态。这样降低复杂度，尽早验证核心迷雾机制。

```
IntelLevel: enum { VISIBLE, HIDDEN }

IntelCard {
  id: string
  title: string
  description: string
  targetCoords: [q, r][]     // 涉及坐标
  adopted: boolean
  expiresAt: number          // 情报过期回合
}

IntelState {
  cards: IntelCard[]
  enemyVisibility: Map<Coord, boolean>
}
```

## 可见性规则

```
function isEnemyVisible(coord, intelState):
  if intelState.enemyVisibility[coord]:
    return true, unit info
  else:
    return false, 显示为 ?
```

## 下一步扩展（三态）

| 等级 | 标记色 | 行为 |
|------|--------|------|
| 确凿 | 绿 | 目标位置精确，持续到行动发现新情报 |
| 推测 | 黄 | 目标位置 ±1 格误差，3 回合后自动降为存疑 |
| 存疑 | 红 | 目标可能已移动，仅标注大致区域 |

## 实现步骤

1. 定义 IntelCard/IntelState 数据类（二态版本）
2. 实现初始视野分配（部分敌单位开局可见）
3. 实现采纳情报后更新敌人可见性
4. 实现未发现单位的 `?` 渲染
5. 实现情报板 UI（卡片列表、采纳按钮）
6. 实现情报过期机制（每回合检查过期）

## 关键技术

- 双层状态分离：真实状态 vs 玩家可见状态，为三态扩展预留接口
- 过期机制：每回合结束检查情报有效期

## 验收标准

- [ ] 未发现的敌单位显示为 `?`
- [ ] 采纳情报后对应区域敌单位显现
- [ ] 未采纳情报的区域保持隐藏
- [ ] 情报过期后对应区域恢复隐藏
- [ ] 情报板可交互（采纳/忽略）

## 参考

- qtgame-war 原型 `headquarters_screen.html` 情报板实现
- qtgame-war `docs/qa/index.md` C04 验证场景
