# 第六章 · 代数闭包

::: intuition
代数闭包是将一个域的所有代数元"收集齐全"后的结果。它是 Galois 理论中绝对 Galois 群的基础，也是理解分裂域和 Galois 对应的关键桥梁。
:::

## 本章概要

本章建立代数闭包的存在性、唯一性及其基本性质。代数闭包的存在性是整个 Galois 理论的基石——有了代数闭包，我们才能精确地定义 Galois 群。

### 核心内容

- **§6.1 代数闭域** — 代数闭域的定义与等价刻画
- **§6.2 代数闭包的定义与存在性** — Zorn 引理在代数中的经典应用
- **§6.3 代数闭包的唯一性** — 嵌入扩张引理的精彩推论
- **§6.4 代数基本定理** — $\mathbb{C}$ 代数闭性的纯代数证明
- **§6.5 基数与实例** — $\overline{\mathbb{Q}}$ 的可数性

## 章节导航

<a class="chapter-card" href="/chapters/06-algebraic-closure/6.1-algebraic-closure">
  <div class="chapter-card__number">§6.1–6.5</div>
  <div class="chapter-card__title">代数闭包完整理论</div>
  <div class="chapter-card__desc">代数闭域、存在性与唯一性、代数基本定理、基数</div>
</a>

## 知识依赖

本章以以下内容为基础：

- **多项式环**（第二章）：不可约性、因式分解
- **域的代数扩张**（第三章）：代数元、极小多项式、扩张次数、塔公式
- **多项式理论**（第四章）：可分性、判别式
- **分裂域**（第五章）：分裂域的存在唯一性

## 核心工具

| 定理 | 作用 |
|------|------|
| Zorn 引理 | 证明极大代数扩张（代数闭包）的存在性 |
| {lem-embedding-extension} | 证明代数闭包的唯一性 |
| 塔公式 {thm-algebraic-tower} | 控制扩张的次数 |
| 代数闭域的等价刻画 | 连接"多项式有根"与"无真代数扩张" |

## 下一步

代数闭包为第七章的 **Galois 群**提供了舞台。有了代数闭包 $\bar{K}$，我们可以对任意多项式 $f \in K[x]$ 定义其 Galois 群 $\mathrm{Gal}(f / K)$，并研究其与域扩张的深刻对应关系。

→ 进入 [§6.1 代数闭包的完整理论](/chapters/06-algebraic-closure/6.1-algebraic-closure)
