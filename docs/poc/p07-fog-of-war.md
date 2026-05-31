# PoC 07 — 战场迷雾

## 验证目标

实现敌我视野不对称：未发现敌单位为 `?`、情报可信度分层、情报更新有延迟。

## 情报模型

```
IntelLevel: enum { CONFIRMED, SPECULATED, DOUBTFUL }

IntelCard {
  id: string
  title: string
  description: string
  level: IntelLevel
  targetCoords: [q, r][]     // 涉及坐标
  adopted: boolean
  expiresAt: number          // 情报过期回合
}

IntelState {
  cards: IntelCard[]
  enemyVisibility: Map<Coord, IntelLevel>
  lastUpdatedAt: number
}
```

## 可信度行为

| 等级 | 标记色 | 行为 |
|------|--------|------|
| 确凿 | 绿 | 目标位置精确，持续到行动发现新情报 |
| 推测 | 黄 | 目标位置 ±1 格误差，3 回合后自动降为存疑 |
| 存疑 | 红 | 目标可能已移动，仅标注大致区域 |

## 可见性规则

```
function isEnemyVisible(coord, intelState):
  if intelState.enemyVisibility[coord] == CONFIRMED:
    return true, unit info (确切)
  elif intelState.enemyVisibility[coord] == SPECULATED:
    return true, unit info (显示为推测标记)
  elif intelState.enemyVisibility[coord] == DOUBTFUL:
    return false, 显示区域标记
  else:
    return false, 显示为 ?
```

## 实现步骤

1. 定义 IntelLevel 枚举和 IntelCard/IntelState 数据类
2. 实现初始视野分配（部分敌单位开局可见）
3. 实现根据情报等级更新敌人可见性
4. 实现未发现单位的 `?` 渲染
5. 实现情报板 UI（卡片列表、标记色、采纳按钮）
6. 实现情报随时间自动退化（存疑→消失，推测→存疑）

## 关键技术

- 双层状态：服务器真实状态 vs 玩家可见状态
- 情报延迟：侦察指令需要等待 1 回合才能返回结果
- 过期机制：每回合结束检查情报有效期

## 验收标准

- [ ] 未发现的敌单位显示为 `?`
- [ ] 采纳情报后对应区域敌单位显现
- [ ] 不同情报等级视觉区分（绿/黄/红标记）
- [ ] 情报过期后自动降级或消失
- [ ] 情报板可交互（采纳/忽略）

## 参考

- qtgame-war 原型 `headquarters_screen.html` 情报板实现
- qtgame-war `docs/qa/index.md` C04 验证场景
