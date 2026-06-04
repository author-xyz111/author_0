# 知识地图

<div class="knowledge-map-hero">
  <p class="knowledge-map-subtitle">
    交互式探索 Galois 理论的逻辑结构 — 概念之间的依赖、联系和层次
  </p>
</div>

## 交互式依赖图

下方是全站知识依赖的**交互式有向图**。拖拽平移、滚轮缩放、点击节点跳转到对应章节。

<DependencyGraph />

---

## 定理与定义浏览器

按类型、章节搜索和筛选全站的所有数学环境（定义、定理、引理、命题等）：

<TheoremExplorer />

---

## 概念依赖图（静态）

以下 SVG 以静态方式展示从基本代数结构到 Galois 理论核心定理的概念路径：

<div class="knowledge-map-container">
  <svg class="knowledge-graph-svg" viewBox="0 0 900 700" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/>
      </marker>
    </defs>

    <!-- Edges (drawn first, behind nodes) -->
    <!-- Group Theory -->
    <line class="edge" x1="450" y1="38" x2="200" y2="108"/>
    <line class="edge" x1="450" y1="38" x2="450" y2="108"/>
    <line class="edge" x1="450" y1="38" x2="700" y2="108"/>
    <line class="edge" x1="200" y1="108" x2="100" y2="198"/>
    <line class="edge" x1="200" y1="108" x2="300" y2="198"/>
    <line class="edge" x1="450" y1="108" x2="450" y2="198"/>
    <line class="edge" x1="700" y1="108" x2="700" y2="198"/>
    <!-- Field Theory -->
    <line class="edge" x1="300" y1="198" x2="300" y2="288"/>
    <line class="edge" x1="450" y1="198" x2="450" y2="288"/>
    <line class="edge" x1="700" y1="198" x2="600" y2="288"/>
    <line class="edge" x1="700" y1="198" x2="800" y2="288"/>
    <!-- Extensions -->
    <line class="edge" x1="300" y1="288" x2="200" y2="378"/>
    <line class="edge" x1="450" y1="288" x2="400" y2="378"/>
    <line class="edge" x1="600" y1="288" x2="400" y2="378"/>
    <line class="edge" x1="200" y1="378" x2="300" y2="468"/>
    <line class="edge" x1="400" y1="378" x2="300" y2="468"/>
    <line class="edge" x1="400" y1="378" x2="600" y2="468"/>
    <line class="edge" x1="800" y1="288" x2="600" y2="378"/>
    <!-- Galois -->
    <line class="edge" x1="300" y1="468" x2="450" y2="558"/>
    <line class="edge" x1="600" y1="468" x2="450" y2="558"/>
    <line class="edge" x1="600" y1="378" x2="700" y2="468"/>
    <line class="edge" x1="450" y1="558" x2="450" y2="648"/>
    <line class="edge" x1="700" y1="468" x2="700" y2="558"/>

    <!-- Nodes -->
    <a href="/chapters/01-groups/1.1-basic-definitions">
      <g class="node" transform="translate(450,28)">
        <rect width="100" height="30" fill="#eff6ff" stroke="#3b82f6"/>
        <text x="50" y="15" fill="#1e40af">群 (Group)</text>
      </g>
    </a>
    <a href="/chapters/01-groups/1.2-subgroups">
      <g class="node" transform="translate(150,98)">
        <rect width="120" height="30" fill="#faf5ff" stroke="#9333ea"/>
        <text x="60" y="15" fill="#581c87">子群 (Subgroup)</text>
      </g>
    </a>
    <a href="/chapters/02-rings/">
      <g class="node" transform="translate(400,98)">
        <rect width="100" height="30" fill="#fffbeb" stroke="#f59e0b"/>
        <text x="50" y="15" fill="#78350f">环 (Ring)</text>
      </g>
    </a>
    <a href="/chapters/03-fields/">
      <g class="node" transform="translate(650,98)">
        <rect width="100" height="30" fill="#f0fdfa" stroke="#14b8a6"/>
        <text x="50" y="15" fill="#134e4a">域 (Field)</text>
      </g>
    </a>
    <a href="/chapters/01-groups/1.3-normal-subgroups">
      <g class="node" transform="translate(50,188)">
        <rect width="120" height="30" fill="#faf5ff" stroke="#9333ea"/>
        <text x="60" y="15" fill="#581c87">正规子群</text>
      </g>
    </a>
    <a href="/chapters/01-groups/1.4-homomorphisms">
      <g class="node" transform="translate(230,188)">
        <rect width="160" height="30" fill="#fefce8" stroke="#ca8a04"/>
        <text x="80" y="15" fill="#713f12">群同态基本定理</text>
      </g>
    </a>
    <a href="/chapters/02-rings/2.1-basic-definitions">
      <g class="node" transform="translate(380,188)">
        <rect width="140" height="30" fill="#f0fdf4" stroke="#22c55e"/>
        <text x="70" y="15" fill="#14532d">商环 / 理想</text>
      </g>
    </a>
    <a href="/chapters/03-fields/3.1-basic-definitions">
      <g class="node" transform="translate(650,188)">
        <rect width="100" height="30" fill="#f0fdfa" stroke="#14b8a6"/>
        <text x="50" y="15" fill="#134e4a">域特征</text>
      </g>
    </a>
    <a href="/chapters/04-polynomials/">
      <g class="node" transform="translate(240,278)">
        <rect width="120" height="30" fill="#ecfeff" stroke="#06b6d4"/>
        <text x="60" y="15" fill="#155e75">多项式环</text>
      </g>
    </a>
    <a href="/chapters/04-polynomials/">
      <g class="node" transform="translate(400,278)">
        <rect width="120" height="30" fill="#ecfeff" stroke="#06b6d4"/>
        <text x="60" y="15" fill="#155e75">不可约多项式</text>
      </g>
    </a>
    <a href="/chapters/05-splitting-fields/">
      <g class="node" transform="translate(550,278)">
        <rect width="120" height="30" fill="#eef2ff" stroke="#6366f1"/>
        <text x="60" y="15" fill="#312e81">域扩张基础</text>
      </g>
    </a>
    <a href="/chapters/05-splitting-fields/">
      <g class="node" transform="translate(750,278)">
        <rect width="120" height="30" fill="#eef2ff" stroke="#6366f1"/>
        <text x="60" y="15" fill="#312e81">代数与超越扩张</text>
      </g>
    </a>
    <a href="/chapters/04-polynomials/">
      <g class="node" transform="translate(130,368)">
        <rect width="140" height="30" fill="#fff1f2" stroke="#f43f5e"/>
        <text x="70" y="15" fill="#881337">根式可解</text>
      </g>
    </a>
    <a href="/chapters/05-splitting-fields/">
      <g class="node" transform="translate(340,368)">
        <rect width="130" height="30" fill="#fef2f2" stroke="#ef4444"/>
        <text x="65" y="15" fill="#7f1d1d">分裂域</text>
      </g>
    </a>
    <a href="/chapters/05-splitting-fields/">
      <g class="node" transform="translate(550,368)">
        <rect width="130" height="30" fill="#fef2f2" stroke="#ef4444"/>
        <text x="65" y="15" fill="#7f1d1d">正规 / 可分扩张</text>
      </g>
    </a>
    <a href="/chapters/07-galois-groups/">
      <g class="node" transform="translate(240,458)">
        <rect width="140" height="30" fill="#fefce8" stroke="#ca8a04"/>
        <text x="70" y="15" fill="#713f12">Galois 群</text>
      </g>
    </a>
    <a href="/chapters/07-galois-groups/">
      <g class="node" transform="translate(540,458)">
        <rect width="140" height="30" fill="#fefce8" stroke="#ca8a04"/>
        <text x="70" y="15" fill="#713f12">可分闭包</text>
      </g>
    </a>
    <a href="/chapters/08-galois-correspondence/">
      <g class="node" transform="translate(370,548)">
        <rect width="180" height="30" fill="#fefce8" stroke="#ca8a04" stroke-width="3"/>
        <text x="90" y="15" fill="#713f12">Galois 对应 (基本定理)</text>
      </g>
    </a>
    <a href="/chapters/09-solvability/">
      <g class="node" transform="translate(640,458)">
        <rect width="140" height="30" fill="#fff1f2" stroke="#f43f5e"/>
        <text x="70" y="15" fill="#881337">可解群</text>
      </g>
    </a>
    <a href="/chapters/09-solvability/">
      <g class="node" transform="translate(370,638)">
        <rect width="180" height="30" fill="#fff1f2" stroke="#f43f5e"/>
        <text x="90" y="15" fill="#881337">五次不可解 / 尺规作图</text>
      </g>
    </a>
    <a href="/chapters/10-finite-fields/">
      <g class="node" transform="translate(640,548)">
        <rect width="140" height="30" fill="#f0fdfa" stroke="#14b8a6"/>
        <text x="70" y="15" fill="#134e4a">有限域 GF(q)</text>
      </g>
    </a>
  </svg>
</div>

---

## Galois 对应：核心对称性

Galois 理论的核心在于如下**反序双射**：

$$\boxed{\{\text{中间域 } E : F \subseteq E \subseteq K\} \quad \underset{\text{反序}}{\longleftrightarrow} \quad \{\text{子群 } H : H \leq \operatorname{Gal}(K/F)\}}$$

具体而言，Galois 对应基本定理（{thm:fundamental-galois}）建立了一一对应：

| 域侧 | 群侧 | 方向 |
|------|------|------|
| 中间域 $E$ | $\operatorname{Gal}(K/E) = \{\sigma \in G \mid \sigma\|_E = \mathrm{id}\}$ | 域 → 群 |
| 子群 $H$ | $K^H = \{x \in K \mid \sigma(x) = x,\, \forall \sigma \in H\}$ | 群 → 域 |
| $E_1 \subseteq E_2$ | $\operatorname{Gal}(K/E_1) \supseteq \operatorname{Gal}(K/E_2)$ | 反序 |
| $[E:F]$ | $[G : H]$ | 指数对应 |
| $E/F$ 正规 | $H \trianglelefteq G$ | 结构对应 |

**双向逆映射**：对 Galois 扩张 $K/F$，有
$$\operatorname{Gal}(K/K^H) = H, \quad K^{\operatorname{Gal}(K/E)} = E.$$

---

## 核心概念层级

| 层级 | 概念 | 出处 | 向上连接 |
|------|------|------|----------|
| 0 | 群、环、域 | §1.1, §2.1, §3.1 | 正规子群、理想 |
| 1 | 正规子群、商群、理想 | §1.3, §2.1 | 群同态基本定理 |
| 2 | 群同态基本定理 | §1.4 | Galois 群构造 |
| 3 | 域扩张、多项式环 | §5.1, §4.1 | 分裂域、不可约性 |
| 4 | 分裂域、正规扩张、可分扩张 | §6.1–6.3 | Galois 扩张 |
| 5 | Galois 群 | §7.1 | Galois 对应 |
| 6 | **Galois 对应** | §8.1 | 一切的统一 |
| 7 | 可解性、尺规作图 | §9.1–9.3 | 终极应用 |
| ∞ | 无限 Galois 理论、代数闭包 | §11, §12 | 现代观点 |

---

## 关键定理依赖链

```
Lagrange 定理 (§1.2)
    ↓
群同态基本定理 (§1.4)
    ↓
正规扩张 ↔ 群论条件 (§6.2)
    ↓
固定域定理 (§7.1)
    ↓
Galois 理论基本定理 (§8.1)
    ↓
可解性判据 (§9.1) ←→ 可解群 (§1.4)
    ↓
五次方程不可解 (§9.2)
```

---

## 如何使用本教程

::: tip 建议的阅读路径
1. **线性阅读**：按章节顺序 1 → 12 学习，适合首次阅读。
2. **概念驱动**：从 [Galois 对应基本定理](/chapters/08-galois-correspondence/) 出发，反向追溯需要的工具。
3. **应用导向**：从 [尺规作图](/chapters/09-solvability/) 或 [有限域](/chapters/10-finite-fields/) 出发，按需补充理论基础。
4. **交互探索**：使用上方的 **依赖图** 和 **定理浏览器** 导航。
:::

::: info 交叉引用
页面中的 <span class="crossref crossref--thm">[定理]</span>、<span class="crossref crossref--def">[定义]</span> 等链接可以**悬停预览**内容摘要（需鼠标悬停），并**点击跳转**到完整定义/定理。
:::
