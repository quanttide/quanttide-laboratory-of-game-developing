// ---- 地形系统 ----

const TerrainLib = (() => {

  const TYPES = {
    PLAIN:     { id: 'PLAIN',     name: '平原',   color: '#5a8a5a', moveCost: 1, defense: 0, fullCover: false, icon: '' },
    VILLAGE:   { id: 'VILLAGE',   name: '村庄',   color: '#8a7a5a', moveCost: 1, defense: 1, fullCover: false, icon: '•' },
    TOWN:      { id: 'TOWN',      name: '城镇',   color: '#7a6a4a', moveCost: 2, defense: 2, fullCover: false, icon: '■' },
    RIVER:     { id: 'RIVER',     name: '河流',   color: '#4a6a8a', moveCost: 4, defense: 0, fullCover: false, icon: '≈' },
    CORE_FORT: { id: 'CORE_FORT', name: '核心据点', color: '#8a4a4a', moveCost: 3, defense: 4, fullCover: true,  icon: '◆' },
  };

  const LIST = Object.values(TYPES);
  const INDEX = [TYPES.PLAIN, TYPES.VILLAGE, TYPES.TOWN, TYPES.RIVER, TYPES.CORE_FORT];

  // 从数字索引数组获取地形
  function fromIndex(map, q, r) {
    return INDEX[map[r]?.[q] ?? 0];
  }

  // 预设地图 9x11（默认平原，带一些特征）
  function defaultMap9x11() {
    const m = [];
    for (let r = 0; r < 11; r++) m.push(Array(9).fill(0));
    // 河流线
    for (let q = 2; q <= 4; q++) { m[3][q] = 3; m[4][q] = 3; }
    // 城镇
    m[7][5] = 2; m[7][6] = 2;
    // 村庄
    m[2][7] = 1; m[8][1] = 1; m[1][7] = 1; m[6][0] = 1; m[5][4] = 1;
    // 核心据点
    m[5][4] = 4;
    return m;
  }

  // 预设地图 9x7（小地图）
  function defaultMap9x7() {
    const m = [];
    for (let r = 0; r < 7; r++) m.push(Array(9).fill(0));
    m[1][1] = 1;
    m[2][2] = 3; m[3][2] = 3; m[4][2] = 3;
    m[3][3] = 4;
    m[2][7] = 2; m[3][7] = 2;
    m[3][5] = 1; m[5][1] = 1; m[5][6] = 1;
    return m;
  }

  // 图例 HTML
  function legendHTML() {
    return LIST.map(t =>
      `<span style="display:inline-flex;align-items:center;gap:3px;font-size:12px;color:#aaa">
        <span style="width:12px;height:12px;background:${t.color};border:1px solid #555;border-radius:2px"></span>
        ${t.name}
      </span>`
    ).join(' ');
  }

  return { TYPES, LIST, INDEX, fromIndex, defaultMap9x11, defaultMap9x7, legendHTML };
})();
