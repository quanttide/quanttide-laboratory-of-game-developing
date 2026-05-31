# PoC 02 — 单位放置与移动

## 验证目标

实现单位棋子在六角格地图上的放置、选择、移动范围计算和移动执行。

## 背景

qtgame-war 使用 BFS 算法在六角格上计算移动范围，移动消耗取决于地形类型。

## 核心算法

```
function calcMoveRange(startHex, movePoints, terrainCosts):
    visited = {startHex: 0}
    queue = [startHex]
    while queue:
        hex = queue.dequeue()
        for neighbor in hex.neighbors:
            cost = terrainCosts[neighbor.terrain]
            newCost = visited[hex] + cost
            if newCost <= movePoints and newCost < visited[neighbor]:
                visited[neighbor] = newCost
                queue.enqueue(neighbor)
    return visited.keys()
```

## 交互流程

1. 点击己方单位 → 单位高亮选中
2. 显示移动范围（可达格子着色）
3. 点击可达格子 → 单位移动到目标格
4. 点击不可达格子或空白区域 → 取消选择
5. 移动后单位标记为"已行动"

## 实现步骤

1. 定义 Unit 数据类（坐标、所属方、行动状态、移动力）
2. 实现 BFS 移动范围计算（考虑地形消耗）
3. 移动范围可视化（可达格/不可达格/当前格不同颜色）
4. 实现单位选择与取消选择
5. 实现单位移动动画（格间过渡）
6. 实现友方单位阻挡（不可穿越其他单位所在格）

## 关键技术

- 路径搜索：BFS 优先于 Dijkstra/A*（等权边，无需优先队列）
- 单位碰撞：单位占用格不可通行；突击兵种可进入核心据点
- 行动标记：`hasActed` 状态控制，回合结束时重置

## 验收标准

- [ ] 点击己方单位显示移动范围
- [ ] 移动力 4 的步兵在平原上可达 4 格
- [ ] 河流消耗 4 移动力，步兵无法穿越
- [ ] 友方单位格不可通行
- [ ] 移动后单位标记为已行动

## 参考

- qtgame-war `src/studio/lib/models/game.dart` GameState
- qtgame-war `src/studio/lib/models/unit.dart` Unit
