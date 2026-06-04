# 第五章 · 分裂域与正规扩张 {#ch-splitting-fields}

::: theorem 章节概述
**分裂域**是将多项式的根"完全展开"的最小扩张。**正规扩张**是恰好是一族多项式之分裂域的扩张。这两个概念是 Galois 理论的基石：Galois 对应只在正规扩张上完美运作。
:::

## §5 分裂域与正规扩张 {#sec-5-overview}

本章是 Galois 理论的预备核心。我们将：

1. **构造分裂域**：证明每个多项式都存在唯一的（在同构意义下）分裂域。
2. **定义正规扩张**：正规扩张 = 某族多项式的分裂域。
3. **证明正规扩张的基本性质**：嵌入定理、塔的正规性判定。
4. **连接 Galois 理论**：正规扩张 + 可分扩张 = Galois 扩张。

## 内容结构 {#structure}

| 小节 | 主题 | 核心结果 |
|------|------|----------|
| §5.1 | 分裂域的存在与唯一性 | Krull 定理：分裂域在同构下唯一 |
| §5.2 | 正规扩张 | 正规 ⇔ 嵌入不变 |

## 前置知识 {#prerequisites}

- [§3.1 域的定义与基本性质](/chapters/03-fields/3.1-basic-definitions) — 域同构、域扩张
- [§3.2 域的基本扩张](/chapters/03-fields/3.2-basic-extensions) — 单扩张、维度
- [§3.3 代数元素与极小多项式](/chapters/03-fields/3.3-algebraic-elements) — 极小多项式、代数扩张
- [§4.1 多项式的一般理论](/chapters/04-polynomials/4.1-general-theory) — 不可约多项式
- [§4.3 可分性](/chapters/04-polynomials/4.3-separability) — 可分多项式、形式导数

## 后续应用 {#forward}

- [§6 代数闭包](/chapters/06-algebraic-closure/) — 分裂域的极限
- [§7 Galois 理论基本定理](/chapters/07-galois-correspondence/) — 正规扩张上的 Galois 对应

---

## 核心概念速览 {#quick-ref}

### 分裂域

设 $f \in K[X]$ 是非常数多项式。$f$ 在 $K$ 上的**分裂域**是满足以下条件的最小域扩张 $L/K$：

1. $f$ 在 $L[X]$ 中完全分解为一次因子：$f = c(X - \alpha_1)(X - \alpha_2) \cdots (X - \alpha_n)$
2. $L = K(\alpha_1, \ldots, \alpha_n)$

### 正规扩张

代数扩张 $L/K$ 是**正规的**，如果：每个在 $K$ 上不可约且在 $L$ 中有一个根的多项式，在 $L$ 中完全分裂。

等价地：$L$ 是 $K$ 上某族多项式的分裂域。

### 正规性的等价条件

设 $L/K$ 是有限代数扩张。则以下等价：

1. $L/K$ 是正规扩张。
2. 若 $f \in K[X]$ 不可约且在 $L$ 中有根，则 $f$ 在 $L[X]$ 中完全分裂。
3. 对每个 $K$-嵌入 $\sigma: L \hookrightarrow \bar{K}$，有 $\sigma(L) = L$。
4. $L$ 是 $K$ 上某族多项式的分裂域。

---

## 阅读路径 {#reading-paths}

**快速路径**（30 分钟）：§5.1（分裂域的存在性 + 唯一性）→ §5.2（正规性的定义 + 嵌入判据）

**完整路径**（2 小时）：§5.1 全部 → §5.2 全部，包括所有证明

**直觉优先路径**：§5.1 的例子 → §5.2 的例子与反例 → 正规性的等价刻画 → 证明

---

## 与其他章节的联系 {#cross-refs}

- 分裂域依赖[多项式理论](/chapters/04-polynomials/)（不可约多项式、根的存在性）。
- 正规扩张是[代数闭包](/chapters/06-algebraic-closure/)的核心输入。
- 正规性 + 可分性 = [Galois 扩张](/chapters/07-galois-correspondence/)。
- [有限域](/chapters/08-finite-fields/)的结构定理依赖分裂域理论。

---

## 本章定理索引 {#theorem-index}

| 编号 | 名称 | 类型 |
|------|------|------|
| {thm-splitting-field-exist} | 分裂域的存在性 | 定理 |
| {thm-splitting-field-unique} | 分裂域的唯一性（Krull） | 定理 |
| {thm-normal-embeddings} | 正规性 ⇔ 嵌入不变 | 定理 |
| {thm-normal-tower} | 正规扩张的塔性质 | 命题 |

---

<div class="chapter-nav">
  <span>← [第四章 · 多项式](/chapters/04-polynomials/)</span>
  <span>[§5.1 分裂域的存在与唯一性 →](5.1-splitting-fields)</span>
</div>
