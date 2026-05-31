# PoC 14 — AI 对手

## 验证目标

实现简单 AI：自动攻击最近目标、支援判断。

## AI 优先级

```
AI 决策优先级（从高到低）：
1. 攻击射程内血量最低的敌方单位
2. 攻击射程内最近的敌方单位
3. 移动至最近的敌方单位附近
4. 向最近的目标推进（无目标时）
5. 若无法行动则结束回合
```

## AI 行为模型

```
function aiTakeTurn(aiUnits, enemyUnits, battlefield):
  for unit in aiUnits (sorted by priority):
    if unit.hasActed: continue

    // Step 1: 寻找攻击目标
    targets = findAttackTargets(unit, enemyUnits)
    if targets.length > 0:
      best = selectOptimalTarget(targets) // 最低血 + 最高击杀概率
      resolveCombat(unit, best)
      continue

    // Step 2: 向最近敌人移动
    nearest = findNearestEnemy(unit, enemyUnits)
    path = findPath(unit, nearest, battlefield)
    if path.length > 0:
      moveTo(path[0]) // 移动一步（或尽可能远）
      if canAttackAfterMove:
        targets = findAttackTargets(unit, enemyUnits)
        if targets.length > 0:
          resolveCombat(unit, selectOptimalTarget(targets))

    // Step 3: 标记完成
    unit.hasActed = true
```

## 支援判断

```
function selectOptimalTarget(unit, targets):
  // 优先选择：击杀概率最高的目标
  // 平局时：选择血量最低的
  // 再平局：选择最近的
  return targets
    .map(t => ({ target: t, killProb: calcKillProbability(unit, t) }))
    .sort((a, b) => b.killProb - a.killProb || a.target.hp - b.target.hp)
    .first()
```

## 实现步骤

1. 实现 AI 决策循环（遍历所有 AI 单位）
2. 实现攻击目标选择逻辑（最低血 + 最高击杀概率）
3. 实现移动路径选择（向最近敌人推进）
4. 实现移动后攻击检查
5. 实现 AI 行为可视化（高亮 AI 的决策目标）
6. 实现 AI 难度调节（简单/中等/困难）
7. 可选：实现防御性 AI（优先治疗/撤退）

## 难度调节

| 难度 | 行为 | 命中修正 |
|------|------|---------|
| 简单 | 攻击最近目标 | -10% |
| 中等 | 选择最优目标 | 0% |
| 困难 | 选择最优目标 + 协同攻击 | +5% |

## 验收标准

- [ ] AI 回合自动执行
- [ ] AI 优先攻击射程内目标
- [ ] AI 无目标时向最近敌人推进
- [ ] AI 不会攻击已阵亡单位
- [ ] AI 回合有清晰的视觉反馈
- [ ] 难度切换影响 AI 行为

## 参考

- qtgame-war `src/studio/lib/controllers/game_controller.dart` AI 步骤
