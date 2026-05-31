# PoC 04 — 回合流程

## 验证目标

实现完整的回合制游戏循环：玩家回合 → AI 回合 → 回合切换。

## 游戏阶段模型

```
Phase: enum {
  ASSESSMENT,   // 情报评估阶段
  COMMAND,      // 命令下达阶段
  EXECUTION,    // 执行结算阶段
  ENEMY_TURN,   // 敌方回合
  GAME_OVER     // 游戏结束
}
```

## 回合流程

```
Player Turn:
  1. Phase = ASSESSMENT → 查看情报/战场态势
  2. Phase = COMMAND → 选择单位 → 移动/攻击 → 确认
  3. Phase = EXECUTION → 结算所有行动（动画/数值更新）
  4. Phase = ENEMY_TURN → 切换给 AI
  
Enemy Turn:
  1. AI 自动执行所有敌方单位行动
  2. 结算完成后切回 Player Turn

回合结束条件：
  - 所有己方单位已行动（hasActed = true）
  - 或玩家点击"结束回合"
```

## 实现步骤

1. 定义 Phases 枚举和 GameState.turn/phase 状态
2. 实现"结束回合"按钮和触发逻辑
3. 实现行动状态管理：`hasActed` 标记，每回合重置
4. 实现阶段间过渡动画/效果
5. 实现回合计数和回合上限（默认 12 回合）
6. 实现胜利/失败判定逻辑

## 关键技术

- 阶段状态机：单向不可逆（ASSESSMENT → COMMAND → EXECUTION → ENEMY_TURN）
- 行动管理：单位操作的原子性（移动后不可再攻击或攻击后不可再移动）
- 回合记录：每回合日志记录（做了什么、结果如何）

## 验收标准

- [ ] 玩家回合可完成一个单位的完整操作
- [ ] 所有单位行动后自动结束玩家回合
- [ ] AI 回合自动执行
- [ ] 回合计数器递增，上限触发游戏结束
- [ ] 胜利条件判定生效

## 参考

- qtgame-war `src/studio/lib/models/game.dart` GamePhase
- qtgame-war `src/studio/lib/controllers/game_controller.dart` endTurn
