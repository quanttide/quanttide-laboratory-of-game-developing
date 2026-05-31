// ---- 单位模型与 BFS 移动 ----

const UnitLib = (() => {

  const SIDES = { BLUE: 0, RED: 1 };
  const COLORS = ['#4488cc', '#cc4444'];

  let _nextId = 0;

  function create(side, q, r, movePts) {
    return { id: _nextId++, side, q, r, movePoints: movePts, hasActed: false, alive: true };
  }

  function resetIdCounter() { _nextId = 0; }

  function occupiedSet(units) {
    const s = new Set();
    for (const u of units) if (u.alive) s.add(`${u.q},${u.r}`);
    return s;
  }

  function findAt(q, r, units) {
    return units.find(u => u.q === q && u.r === r && u.alive) || null;
  }

  // BFS 移动范围
  // getTerrainCost(q, r) 返回该格地形消耗
  function moveRange(unit, units, cols, rows, getTerrainCost) {
    const occ = occupiedSet(units);
    const visited = new Map();
    const key = (q, r) => `${q},${r}`;
    visited.set(key(unit.q, unit.r), 0);
    const queue = [{ q: unit.q, r: unit.r }];

    while (queue.length) {
      const cur = queue.shift();
      const curC = visited.get(key(cur.q, cur.r));
      for (const nb of Hex.NEIGHBORS) {
        const nq = cur.q + nb.q, nr = cur.r + nb.r;
        if (nq < 0 || nq >= cols || nr < 0 || nr >= rows) continue;
        if (occ.has(key(nq, nr)) && !(nq === unit.q && nr === unit.r)) continue;
        const cost = curC + getTerrainCost(nq, nr);
        const k = key(nq, nr);
        if (cost <= unit.movePoints && (!visited.has(k) || cost < visited.get(k))) {
          visited.set(k, cost);
          queue.push({ q: nq, r: nr });
        }
      }
    }
    return visited;
  }

  // 绘制单位圆
  function draw(ctx, u, hexSize, highlight) {
    const c = Hex.hexToPixel(u.q, u.r, hexSize);
    const r = hexSize * 0.35;

    // 阴影
    ctx.beginPath();
    ctx.arc(c.x + 1, c.y + 1, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // 本体
    ctx.beginPath();
    ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
    ctx.fillStyle = COLORS[u.side];
    ctx.fill();
    ctx.strokeStyle = highlight ? '#ffff88' : '#fff';
    ctx.lineWidth = highlight ? 3 : 1;
    ctx.stroke();

    // 已行动标记
    if (u.hasActed && u.side === SIDES.BLUE) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, r + 3, 0, Math.PI * 2);
      ctx.strokeStyle = '#ff8800';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 移动力文字
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(hexSize * 0.35)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(u.movePoints, c.x, c.y);
  }

  return { SIDES, COLORS, create, resetIdCounter, occupiedSet, findAt, moveRange, draw };
})();
