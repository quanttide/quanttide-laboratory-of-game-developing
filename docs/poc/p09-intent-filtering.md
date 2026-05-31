# PoC 09 — 意图驱动选项

## 验证目标

选定作战意图后，不兼容的命令选项自动消失而非置灰，验证意图→选项的动态过滤机制。

## 核心概念

意图是玩家在每次决策前的"立场声明"。不同于传统游戏中"从菜单选择动作"，玩家先声明意图，系统自动过滤不兼容的动作。

## 意图模型

```
Intent: enum {
  ACTIVE_DEFENSE,    // 积极防御: 优先保全兵力、伺机反击
  DECISIVE_ATTACK,   // 集中突击: 集中优势兵力、主动进攻
  CIVILIAN_PROTECT,  // 掩护群众: 优先保护平民、避免附带损伤
  RECON_IN_FORCE     // 威力侦察: 试探性进攻、摸清敌情
}
```

## 意图过滤器

```
function filterActions(intent, availableActions):
  switch intent:
    case ACTIVE_DEFENSE:
      return availableActions.filter(a =>
        a.type !== '全军突击' &&
        a.type !== '纵深穿插')
    case DECISIVE_ATTACK:
      return availableActions.filter(a =>
        a.type !== '固守待援' &&
        a.type !== '分散撤退')
    case CIVILIAN_PROTECT:
      return availableActions.filter(a =>
        a.type !== '炮火覆盖' &&
        a.targetTerrain !== '居民区')
    case RECON_IN_FORCE:
      return availableActions.filter(a =>
        a.consumption > 0.3 * MAX_CONSUMPTION)
```

## 实现步骤

1. 定义 Intent 枚举和意图选择 UI
2. 为每个命令选项添加兼容性标签（`availableUnder: Intent[]`）
3. 实现意图过滤器函数
4. 实现命令面板动态更新（选项消失/出现动画）
5. 验证跨意图切换的正确性
6. 实现叙事反馈（选择意图后 UI 文字变化、提示变化）

## 关键技术

- 删除 vs 禁用：选项直接消失（而非置灰），强化"意图即身份"的认知
- 双向影响：意图不仅过滤选项，也改变情报解读的叙事文本
- 不可逆：确认意图后本回合不可更改

## 验收标准

- [ ] 至少 2 种意图可选
- [ ] 选择"积极防御"后，"全军突击"选项消失
- [ ] 切换意图后命令面板即时更新
- [ ] 确认意图后不可更改
- [ ] 不同意图下的叙事文本不同

## 参考

- qtgame-war `docs/qa/index.md` C01 / C07 验证场景
- qtgame-war PRD 设计支柱 2："你的指挥风格决定了你能做什么"
