# 第八章 · Galois 对应

---

## 本章定位

Galois 对应是 Galois 理论的**核心定理**。它揭示了域扩张内部结构与群论结构之间的**完美反序一一对应**：

$$\boxed{\text{中间域 } M \;\longleftrightarrow\; \text{子群 } H = \operatorname{Gal}(L/M)}$$

这个对应不仅仅是技术性的结论——它是整个 Galois 理论的力量之源。通过这个对应，**域论问题可以转化为群论问题**，而群论往往更易于处理。

::: tip Galois 对应的哲学意义
Galois 对应是数学中"对偶性"的一个原型范例：两个看似完全不同的数学世界（域扩张的内部结构 vs. 群的子群格）之间存在**反变等价**。这种思想后来在数学中反复出现——Pontryagin 对偶、Stone 对偶、Gelfand 对偶、Grothendieck 的 Galois 范畴等都是这一思想的后继者。
:::

---

## 本章导航

| 节 | 主题 | 核心内容 | 关键概念 |
|:--|:-----|:---------|:---------|
| §8.1 | [基本 Galois 对应](8.1-fundamental-theorem) | 中间域 ↔ 子群的反序双射、Artin 引理、正规子群 ↔ 正规扩张、商群 ↔ 限制 Galois 群 | $\operatorname{Gal}(L/M)$, $L^H$, Artin 引理, 反序双射 |
| §8.2 | [Galois 扩张的刻画](8.2-galois-extensions) | Galois 扩张的多种等价定义、正规+可分 $\Leftrightarrow$ Galois、Galois 扩张的闭包性质 | Galois 扩张, 正规性, 可分性, 本原元定理 |

---

## 知识网络

```
         ┌───────────────────────────┐
         │   正规扩张 (Ch5 §5.2)     │
         │   可分扩张 (Ch4 §4.3)     │
         └─────────┬─────────────────┘
                   │
         ┌─────────┴─────────────────┐
         │    Galois 群 (Ch7)         │
         │  Gal(L/K) = Aut(L/K)      │
         └─────────┬─────────────────┘
                   │
      ┌────────────┴────────────┐
      │  ★ 第八章：Galois 对应   │
      │  中间域 ←反序双射→ 子群  │
      │  正规扩张 ↔ 正规子群     │
      │  Gal(M/K) ≅ Gal(L/K)/H  │
      └────────────┬────────────┘
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Ch9      │ │ Ch10     │ │ Ch11     │
│ 可解性    │ │ 有限域    │ │ 无限      │
│ (Galois  │ │ (子域格  │ │ Galois   │
│  判据)    │ │  ↔ 子群) │ │ (Krull)  │
└──────────┘ └──────────┘ └──────────┘
```

---

## 阅读路径

**快速路径**（30 分钟）：只读 §8.1 的核心定理（{thm-galois-correspondence} 的陈述，不读证明）和 $V_4$ 的图示例子（{ex-galois-sqrt2-sqrt3}），理解"中间域越大，对应子群越小"的反序直觉。

**标准路径**（2 小时）：完整阅读 §8.1，理解 Artin 引理（{thm-artin}）的线性代数证明和四个关键步骤。然后阅读 §8.2，掌握 Galois 扩张的多种等价刻画。

**深入路径**（3 小时）：在标准路径基础上，仔细研究 §8.1 中正规子群对应正规扩张的完整证明（{thm-normal-characterization}），验证 $D_4$ 的 Galois 对应图，并思考 §8.2 中 Galois 扩张闭包性质的推论。

---

## 核心定理速览

| 定理 | 内容 | 直觉 |
|:-----|:-----|:-----|
| {thm-artin} | $[L : L^H] = \|H\|$（Artin 引理） | 群的大小恰好"控制"了域的大小 |
| {thm-galois-correspondence} | 中间域与子群的反序双射、指数等于次数 | Galois 理论的"基本定理" |
| {thm-normal-characterization} | $M/K$ 正规 $\Leftrightarrow$ $\operatorname{Gal}(L/M) \trianglelefteq \operatorname{Gal}(L/K)$ | 正规性在域和群两侧完美翻译 |
| {thm-galois-equivalent} | Galois 扩张 $\Leftrightarrow$ 正规 + 可分 | Galois 扩张的"实用判据" |

---

## Galois 对应一览

| 一般定理 | 域论侧 | 群论侧 |
|:---------|:-------|:-------|
| 反序双射 | 中间域 $K \subseteq M \subseteq L$ | 子群 $H \leq G$ |
| 指数公式 | $[M : K]$ | $[G : H]$（陪集数） |
| 阶公式 | $[L : M]$ | $\|H\|$ |
| 正规扩张 ↔ 正规子群 | $M/K$ 正规扩张 | $\operatorname{Gal}(L/M) \trianglelefteq G$ |
| 商群 ↔ 限制 Galois 群 | $\operatorname{Gal}(M/K)$ | $G / \operatorname{Gal}(L/M)$ |

::: warning 反序的重要性
初学者常犯的错误是忽略"反序"——域越大，对应的子群越**小**。$\operatorname{Gal}(L/L) = \{e\}$（最大域对应最小子群），$\operatorname{Gal}(L/K) = G$（最小域对应最大群）。记住：**域和子群的"包含方向"是相反的**。
:::

---

## 前置知识

- **必需**：[第七章 · Galois 群](/chapters/07-galois-groups/)（$K$-自同构群、根的置换）、[第五章 · 分裂域](/chapters/05-splitting-fields/)（正规扩张、嵌入扩张引理、本原元定理）、[第一章 · 群论](/chapters/01-groups/)（正规子群、商群、第一同构定理）
- **推荐**：[第四章 · 多项式](/chapters/04-polynomials/)（可分性）

---

## 后续指向

- **第九章**：当 Galois 群是**可解群**时，方程可以根式求解——Galois 对应将群的可解性翻译为域的"根式塔"
- **第十章**：有限域 $\mathbb{F}_{p^n}/\mathbb{F}_p$ 的 Galois 对应——子域与 $n$ 的因子一一对应
- **第十一章**：无限 Galois 对应需要**闭子群**（Krull 拓扑）——有限与无限的本质区别
- **第十二章**：Galois 对应的范畴论推广（Galois 范畴、profinite 群）

---

<div class="chapter-nav">
  <span>← [第七章 · Galois 群](/chapters/07-galois-groups/)</span>
  <span>[§8.1 基本 Galois 对应 →](8.1-fundamental-theorem)</span>
</div>
