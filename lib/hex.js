// ---- 六角格坐标系统 ----
// 立方体坐标 (q, r, s) where s = -q - r
// pointy_top 布局

const Hex = (() => {

  // 六邻偏移（pointy_top）
  const NEIGHBORS = [
    { q:  1, r:  0 }, { q: -1, r:  0 },
    { q:  0, r:  1 }, { q:  0, r: -1 },
    { q:  1, r: -1 }, { q: -1, r:  1 },
  ];

  // 立方体坐标取整
  function cubeRound(q, r) {
    const s = -q - r;
    let rq = Math.round(q), rr = Math.round(r), rs = Math.round(s);
    const dq = Math.abs(rq - q), dr = Math.abs(rr - r), ds = Math.abs(rs - s);
    if (dq > dr && dq > ds) rq = -rr - rs;
    else if (dr > ds) rr = -rq - rs;
    return { q: rq, r: rr };
  }

  // 六角格中心 → 像素坐标
  function hexToPixel(q, r, hexSize) {
    const x = hexSize * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
    const y = hexSize * (1.5 * r);
    return {
      x: x + hexSize * Math.sqrt(3) / 2 + 1,
      y: y + hexSize + 1,
    };
  }

  // 像素坐标 → 六角格
  function pixelToHex(px, py, hexSize) {
    const x = px - hexSize * Math.sqrt(3) / 2 - 1;
    const y = py - hexSize - 1;
    const q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / hexSize;
    const r = (2 / 3 * y) / hexSize;
    return cubeRound(q, r);
  }

  // 六角格 6 个顶点（pointy_top）
  function corners(cx, cy, hexSize) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 180 * (60 * i - 30);
      pts.push({ x: cx + hexSize * Math.cos(a), y: cy + hexSize * Math.sin(a) });
    }
    return pts;
  }

  // 计算画布尺寸
  function canvasSize(cols, rows, hexSize) {
    const w = hexSize * Math.sqrt(3) * (cols + 0.5);
    const h = hexSize * 1.5 * rows + hexSize / 2;
    return { width: Math.ceil(w) + 2, height: Math.ceil(h) + 2 };
  }

  // 绘制六角格路径（不填充/描边，只建 path）
  function path(ctx, cx, cy, hexSize) {
    const pts = corners(cx, cy, hexSize);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < 6; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
  }

  // 遍历所有格子
  function eachCell(cols, rows, fn) {
    for (let r = 0; r < rows; r++)
      for (let q = 0; q < cols; q++)
        fn(q, r);
  }

  return {
    NEIGHBORS,
    cubeRound,
    hexToPixel,
    pixelToHex,
    corners,
    canvasSize,
    path,
    eachCell,
  };
})();
