# PoC 06 — 兵种差异化

## 验证目标

5 种基础兵种各具独特属性，验证兵种差异对战术选择的影响。

## 兵种数据

| 兵种 | HP | 攻击 | 防御 | 移动 | 射程 | 特殊能力 |
|------|----|------|------|------|------|---------|
| 轻步兵 | 3 | 2 | 0 | 4 | 1 | 无 |
| 重步兵 | 4 | 3 | 1 | 3 | 1 | 防御+ |
| 炮兵 | 2 | 4 | 0 | 3 | 3 | 远程 |
| 骑兵 | 3 | 2 | 0 | 6 | 1 | 高机动 |
| 突击步兵 | 3 | 2 | 1 | 5 | 1 | 破障 |

## 模板-实例分离

```
UnitType (模板):
  - name, faction
  - maxHp, baseAttack, baseDefense
  - baseMoveRange, attackRange
  - isAssault: boolean

Unit (实例):
  - id: string
  - side: 'blue' | 'red'
  - type: UnitType
  - col, row: number
  - hp: number
  - hasActed: boolean
  - revealed: boolean
  - alive: boolean
```

## 特殊能力实现

| 能力 | 机制 | 实现方式 |
|------|------|---------|
| 远程 | 可攻击 3 格内目标 | `attackRange = 3` |
| 高机动 | 移动力 6，无视河流消耗 | `baseMoveRange = 6` + 河流消耗=1 |
| 破障 | 可进入核心据点、对全掩体目标造成 2 伤害 | `isAssault = true` |
| 防御+ | 受近战攻击时减伤 | `defenseBonus = 1` 仅对近战生效 |

## 实现步骤

1. 定义 `UnitType` 模板数据类
2. 定义 `Unit` 实例数据类（引用模板）
3. 实现兵种属性对战斗公式的影响（攻/防/射程代入 PoC 05）
4. 实现 `isAssault` 特殊逻辑（进入核心据点、伤害加成）
5. 实现远程兵种的射程限制
6. 实现兵种视觉区分（不同图标/颜色/标记）

## 验收标准

- [ ] 5 种兵种可在地图上区分
- [ ] 炮兵射程 3 格，可攻击 2 格外目标
- [ ] 骑兵移动力 6，是轻步兵的 1.5 倍
- [ ] 突击步兵可进入核心据点
- [ ] 新增一种兵种只需添加模板配置

## 参考

- qtgame-war `src/studio/lib/models/unit.dart`
- qtgame-war `assets/campaigns/diqiudian/units.json`
