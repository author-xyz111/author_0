# 第四章 · 多项式 {#ch-polynomials}

::: intuition 为什么需要多章来讲多项式？
多项式是连接[环论](/chapters/02-rings/)与[分裂域与正规扩张](/chapters/05-splitting-fields/)的桥梁。域扩张的"砖块"——代数元——正是多项式的根。理解多项式的结构（不可约分解、根的重数、分裂域），就是理解域扩张如何从多项式中"生长"出来。多项式的对称性（根的置换）最终演化为 Galois 群。
:::

## 本章结构

<div class="chapter-overview">

- [**§4.1 多项式的一般理论**](/chapters/04-polynomials/4.1-general-theory) — 环 $K[X]$ 的 Euclid 算法、GCD、不可约分解、UFD 性质
- [**§4.2 不可约性判据**](/chapters/04-polynomials/4.2-irreducibility) — Eisenstein 判据、分圆多项式、有理根定理
- [**§4.3 根的重数与可分性**](/chapters/04-polynomials/4.3-separability) — 形式导数、重根判别、可分多项式与可分扩张

</div>

## 核心定理速览 {#thm-overview}

| 定理 | 章节 | 意义 |
|------|------|------|
| [Euclid 算法](/chapters/04-polynomials/4.1-general-theory#thm-euclidean-algorithm) | §4.1 | $K[X]$ 是 Euclid 整环 |
| [唯一分解](/chapters/04-polynomials/4.1-general-theory#thm-ufd) | §4.1 | $K[X]$ 是唯一分解整环 |
| [Eisenstein 判据](/chapters/04-polynomials/4.2-irreducibility#thm-eisenstein) | §4.2 | 不可约性的强力工具 |
| [分圆多项式不可约](/chapters/04-polynomials/4.2-irreducibility#thm-cyclotomic-irreducible) | §4.2 | $\Phi_n(x)$ 在 $\mathbb{Q}$ 上不可约 |
| [重根判别](/chapters/04-polynomials/4.3-separability#thm-multiple-root-criterion) | §4.3 | $\alpha$ 重根 $\Leftrightarrow$ $f'(\alpha) = 0$ |
| [可分多项式](/chapters/04-polynomials/4.3-separability#thm-separable-polynomial) | §4.3 | 特征零上所有多项式可分 |

## 关键概念网络

```
K[X] 是 Euclid 整环
    ↓
唯一分解 → 不可约分解 → 极小多项式
    ↓                        ↓
Eisenstein 判据          代数元的次数
    ↓                        ↓
分圆多项式              域扩张的阶
    ↓                        ↓
    └──→ 根与分裂域 ←────────┘
              ↓
         Galois 群 (第七章)
```

## 前置知识

本章假设读者已熟悉：
- [第一章 · 群论基础](/chapters/01-groups/) — 正规子群、商群、同态
- [第二章 · 环与理想](/chapters/02-rings/) — 整环、主理想整环、唯一分解整环
- [第三章 · 域论基础](/chapters/03-fields/) — 域的特征、域扩张、极小多项式

## 推荐阅读顺序

::: tip 三条路径
1. **标准路径**：§4.1 → §4.2 → §4.3，然后进入[第五章 · 分裂域与正规扩张](/chapters/05-splitting-fields/)
2. **速通路径**：仅 §4.1（多项式环的 UFD 性质）和 §4.3（可分性），因为它们是后续章节的核心工具
3. **应用导向**：§4.2（不可约性判据）→ §4.3（可分性），直接进入[分裂域](/chapters/05-splitting-fields/)
:::

---

<div class="chapter-nav">
  <span>← [第三章 · 域论基础](/chapters/03-fields/)</span>
  <span>[第五章 · 分裂域与正规扩张 →](/chapters/05-splitting-fields/)</span>
</div>
