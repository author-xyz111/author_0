# 第九章 · 可解性与作图

---

## 本章定位

本章回答 Galois 理论的**原初问题**：为什么有些方程可以用根式求解，而有些不行？

答案的优美程度超乎想象——它完全由一个群论条件决定：

$$\boxed{f = 0 \text{ 根式可解} \iff \operatorname{Gal}(f/K) \text{ 是可解群}}$$

Galois 的这一判据不仅解释了为什么二次、三次、四次方程有根式解法，还解释了为什么五次及以上一般方程没有。更进一步，它将古老的**尺规作图问题**（如三等分角、倍立方）也归结为 Galois 群的结构分析。

::: tip 从"能不能解"到"为什么能解"
在 Galois 之前，数学家们花了几百年寻找五次方程的根式解——Ruffini 和 Abel 证明了它不存在，但 Galois 的理论远比这个否定结果深刻得多。Galois 告诉我们**在什么条件下**根式解法存在，从而给出了一个**正面的结构理论**，而非仅仅是"不行"。
:::

---

## 本章导航

| 节 | 主题 | 核心内容 | 关键概念 |
|:--|:-----|:---------|:---------|
| §9.1 | [可解群与 Abel 群](9.1-solvable-groups) | 可解群的定义、Abel-Ruffini 定理、根式扩张、Galois 可解性判据、Kummer 理论、Artin-Schreier 理论 | 可解群, 导出列, 根式扩张, Kummer 扩张, Lagrange 预解式 |
| §9.2 | [尺规作图与域扩张](9.2-constructibility) | 可作图数的域论刻画、三大古典难题的否定解答、正 $n$ 边形的作图条件 (Gauss-Wantzel) | 可作图数, 二次扩张塔, Gauss-Wantzel 定理 |

---

## 知识网络

```
         ┌───────────────────────────┐
         │  群论 Ch1                 │
         │  (可解群、导出列、A₅单性) │
         └─────────┬─────────────────┘
                   │
         ┌─────────┴─────────────────┐
         │  Galois 对应 (Ch8)         │
         │  (反序双射、正规子群 ↔    │
         │   正规扩张、商群同构)       │
         └─────────┬─────────────────┘
                   │
      ┌────────────┴────────────┐
      │  ★ 第九章：可解性与作图   │
      │  根式可解 ⇔ Gal群可解     │
      │  尺规可作 ⇔ 域度为2的幂   │
      └────────────┬────────────┘
                   │
         ┌─────────┴─────────────────┐
         │  后续应用                   │
         │  • Ch10: 有限域 Abel 扩张   │
         │  • Ch12: 逆 Galois 问题     │
         └───────────────────────────┘
```

---

## 阅读路径

**快速路径**（30 分钟）：只读 §9.1 中可解群的定义（{def-solvable-group}）、Abel-Ruffini 定理（{thm-abel-ruffini}）的陈述和证明概要，以及 $x^5 - 4x + 2$ 的具体例子（{ex-nonsolvable}）。理解"可解群 ↔ 根式可解"的核心直觉。

**标准路径**（2 小时）：完整阅读 §9.1，重点理解 Galois 可解性判据（{thm-galois-solvability-criterion}）的双向证明中"可解群 → 根式塔"的关键步骤。然后阅读 §9.2 掌握尺规作图的域论刻画。

**深入路径**（3 小时）：在标准路径基础上，仔细研究 §9.1 中 Kummer 理论（{thm-kummer}）的完整证明，包括 Lagrange 预解式和 Hilbert 定理 90 的运用，以及 Artin-Schreier 理论在特征 $p$ 情形的类比。

---

## 核心定理速览

| 定理 | 内容 | 直觉 |
|:-----|:-----|:-----|
| {thm-abel-ruffini} | 一般五次及以上方程不是根式可解的 | $S_5$ 不可解（$A_5$ 是单群） |
| {thm-galois-solvability-criterion} | $f$ 根式可解 $\iff$ $\operatorname{Gal}(f/K)$ 是可解群 | 群的可解性完全控制方程的根式可解性 |
| {thm-kummer} | 含 $n$ 次单位根时，Abel 扩张 ↔ $K^\times/(K^\times)^n$ 的子群 | Kummer 理论给出 Abel 扩张的完整分类 |
| {thm-gauss-wantzel} | 正 $n$ 边形可尺规作图 $\iff$ $n = 2^k p_1 \cdots p_r$（$p_i$ 互异 Fermat 素数） | 可作图性等价于扩张次数为 2 的幂 |

---

## 关键概念对比

| 概念 | 定义 | Galois 群侧 | 域扩张侧 |
|:-----|:-----|:------------|:---------|
| 可解群 | 有正规列使商群均为 Abel | $G = G_0 \rhd G_1 \rhd \cdots \rhd \{e\}$, $G_i/G_{i+1}$ Abel | — |
| 根式扩张 | 逐次添加根式 | — | $K = K_0 \subseteq K_1 \subseteq \cdots$, $K_{i+1} = K_i(\alpha^{1/n_i})$ |
| 可解判据 | $f$ 根式可解 $\iff$ Gal 群可解 | 群的导出列终止 | 域塔可以分解为根式扩张 |
| 可作图数 | 可尺规构造的长度 | — | 包含在二次扩张塔中 |
| 作图判据 | 正 $n$ 边形可作 $\iff$ 特殊条件 | $\varphi(n)$ 是 2 的幂 | $[\mathbb{Q}(\zeta_n):\mathbb{Q}]$ 是 2 的幂 |

::: warning 三次方程的根式解法为什么"有效"？
对于三次方程 $x^3 + px + q = 0$，Cardano 公式给出了根式解。从 Galois 理论角度看，这是因为 $S_3$ 是可解群（$S_3 \rhd A_3 \rhd \{e\}$，商群分别为 $\mathbb{Z}/2$ 和 $\mathbb{Z}/3$）。而四次方程对应的 $S_4$ 也是可解群（$S_4 \rhd A_4 \rhd V_4 \rhd \{e\}$）。但 $S_5$ 不可解——$A_5$ 是阶 60 的单群，无法进一步分解为 Abel 商。
:::

---

## 前置知识

- **必需**：[第八章 · Galois 对应](/chapters/08-galois-correspondence/)（反序双射、正规子群 ↔ 正规扩张、商群同构）、[第一章 · 群论](/chapters/01-groups/)（可解群、正规子群、商群、$A_5$ 的单性）
- **推荐**：[第七章 · Galois 群](/chapters/07-galois-groups/)（Galois 群的定义和计算）、[第四章 · 多项式](/chapters/04-polynomials/)（可分性、Eisenstein 判据）

---

## 后续指向

- **第十章**：有限域上的 Galois 群——有限域的 Abel 扩张完全由 Kummer 理论和 Frobenius 自同构控制
- **第十二章**：逆 Galois 问题——是否每个有限群都是某个 $\mathbb{Q}$-多项式的 Galois 群？

---

<div class="chapter-nav">
  <span>← [第八章 · Galois 对应](/chapters/08-galois-correspondence/)</span>
  <span>[§9.1 可解群与 Abel 群 →](9.1-solvable-groups)</span>
</div>
