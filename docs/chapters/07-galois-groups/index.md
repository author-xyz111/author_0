# 第七章 · Galois 群

---

## 本章定位

Galois 群是整套理论的**核心对象**。前六章建立的所有工具——群、环、域、多项式、分裂域、正规扩张、可分性、代数闭包——最终都服务于一个目标：**为 Galois 群的定义和计算铺平道路**。

Galois 的天才洞察是：一个多项式方程的**根的代数关系**，可以通过一个**群的结构**来完全编码。这不是一个比喻，而是一个精确的数学定理——它将贯穿本书余下所有章节。

::: tip 为什么 Galois 群如此重要？
在 Galois 之前，数学家们已经知道二次、三次、四次方程的根式解法，但不知道为什么五次方程"不行"。Galois 群给出了**精确的判据**：方程是否根式可解，完全取决于其 Galois 群的群论性质（是否"可解群"）。这是代数学历史上第一次，**一个看似困难的代数问题被转化为一个结构清晰的群论问题**。
:::

---

## 本章导航

| 节 | 主题 | 核心内容 | 关键概念 |
|:--|:-----|:---------|:---------|
| §7.1 | [Galois 群的定义与基本性质](7.1-definition-and-examples) | $K$-自同构群、Galois 群的定义、根的置换、嵌入对称群 | $\operatorname{Gal}(L/K)$, $K$-自同构, 忠实作用, 传递性 |
| §7.2 | [Galois 群的计算](7.2-computation) | 具体多项式的 Galois 群计算方法、判别式法、模 $p$ 约化 | 判别式, 降次, 模约化, $n \leq 4$ 分类 |

---

## 知识网络

```
                    ┌─────────────────────┐
                    │     群论 Ch1         │
                    │  (子群、正规子群、   │
                    │   商群、同态定理)     │
                    └────────┬────────────┘
                             │
                    ┌────────┴────────────┐
                    │  分裂域 Ch5          │
                    │  (存在性、唯一性、   │
                    │   正规扩张、可分性)   │
                    └────────┬────────────┘
                             │
                ┌────────────┴────────────┐
                │    ★ 第七章：Galois 群   │
                │  Gal(L/K) = Aut(L/K)    │
                │  根的置换、阶的上界      │
                └────────────┬────────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │  Ch8         │  │  Ch9         │  │  Ch10        │
    │  Galois 对应  │  │  可解性       │  │  有限域       │
    │  (子群 ↔     │  │  (可解群 ↔   │  │  (Frobenius  │
    │   中间域)     │  │   根式可解)   │  │   自同构)     │
    └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 阅读路径

**快速路径**（30 分钟）：只读 §7.1 的定义部分（{def-galois-group}）和前三个例子（{ex-galois-c-r}, {ex-galois-q-sqrt2}, {ex-galois-q-cbrt2}），获得 Galois 群的基本直觉。

**标准路径**（2 小时）：完整阅读 §7.1，理解 Galois 群嵌入对称群的定理（{thm-galois-embeds-symmetric}）和函子性（{prop-restriction}），然后阅读 §7.2 掌握计算方法。

**深入路径**（3 小时）：在标准路径基础上，仔细验证 §7.1 中所有例子的计算细节，特别是 $x^4 - 2$ 的 $D_4$ 计算（{ex-galois-x4-2}）和分圆扩张的 Galois 群（{ex-galois-cyclotomic}），并尝试 §7.2 中的高次多项式 Galois 群判定。

---

## 核心定理速览

| 定理 | 内容 | 直觉 |
|:-----|:-----|:-----|
| {prop-galois-permutes-roots} | Galois 群忠实地作用在多项式的根上 | 自同构把根映为根，且由根上的作用唯一决定 |
| {thm-galois-embeds-symmetric} | 不可约 $n$ 次多项式的 Galois 群嵌入 $S_n$，且在根上是传递的 | 不可约性保证"所有根地位平等" |
| {prop-galois-group-order} | $\|\operatorname{Gal}(L/K)\| \leq [L:K]$，等号当且仅当 Galois 扩张 | Galois 群的阶被扩张次数"天花板"控制 |
| {prop-restriction} | 限制映射 $\operatorname{Gal}(M/K) \twoheadrightarrow \operatorname{Gal}(L/K)$（当 $L/K$ Galois） | "大域"的对称性可以"投影"到"小域"上 |

---

## 典型例子一览

本章计算了以下域扩张的 Galois 群，这些例子将贯穿后续所有章节：

| 域扩张 | Galois 群 | 群论结构 | 关键观察 |
|:-------|:----------|:---------|:---------|
| $\mathbb{C}/\mathbb{R}$ | $\mathbb{Z}/2\mathbb{Z}$ | 二阶循环群 | 复共轭是唯一的非平凡自同构 |
| $\mathbb{Q}(\sqrt{2})/\mathbb{Q}$ | $\mathbb{Z}/2\mathbb{Z}$ | 二阶循环群 | $\sqrt{2} \mapsto -\sqrt{2}$ |
| $\mathbb{Q}(\sqrt[3]{2})/\mathbb{Q}$ | $\{e\}$ | 平凡群 | **非 Galois 扩张**——根不全在域中 |
| $\mathbb{Q}(\sqrt[4]{2}, i)/\mathbb{Q}$ | $D_4$ | 二面体群，阶 8 | 旋转 $\sigma$ + 反射 $\tau$ |
| $\mathbb{Q}(\zeta_p)/\mathbb{Q}$ | $(\mathbb{Z}/p\mathbb{Z})^\times$ | 循环群，阶 $p-1$ | 分圆扩张是 Abel 扩张 |
| $\mathbb{Q}(\sqrt{2}, \sqrt{3})/\mathbb{Q}$ | $V_4$ | Klein 四元群 | 两个独立二次扩张的复合 |

::: warning $\mathbb{Q}(\sqrt[3]{2})/\mathbb{Q}$ 的教训
这是理解 Galois 群的关键反例。$x^3 - 2$ 有三个根 $\sqrt[3]{2}, \omega\sqrt[3]{2}, \omega^2\sqrt[3]{2}$，但 $\mathbb{Q}(\sqrt[3]{2}) \subset \mathbb{R}$ 不包含后两个复数根。因此 $\operatorname{Gal}(\mathbb{Q}(\sqrt[3]{2})/\mathbb{Q}) = \{e\}$——域"太小"，没有非平凡对称性。这直接引出了第 5 章为什么要研究**分裂域**（包含全部根的最小扩域）。
:::

---

## 前置知识

- **必需**：[第一章 · 群论](/chapters/01-groups/)（群、子群、正规子群、商群、群同态）、[第三章 · 域论](/chapters/03-fields/)（域扩张、扩张次数、代数元）、[第五章 · 分裂域](/chapters/05-splitting-fields/)（分裂域的存在唯一性、正规扩张、嵌入扩张引理）
- **推荐**：[第四章 · 多项式](/chapters/04-polynomials/)（可分性、判别式）

---

## 后续指向

- **第八章**：Galois 群与中间域的**完美对应**（Galois 对应定理）——这是 Galois 理论的核心定理
- **第九章**：Galois 群的**可解性**等价于方程的**根式可解性**——这是 Galois 理论的原初动机
- **第十章**：有限域上的 Galois 群由 **Frobenius 自同构**生成——有限域的 Galois 理论最为优美
- **第十一章**：无限扩张的 Galois 群需要**Krull 拓扑**——从有限到无限的推广

---

<div class="chapter-nav">
  <span>← [第六章 · 代数闭包](/chapters/06-algebraic-closure/)</span>
  <span>[§7.1 Galois 群的定义与基本性质 →](7.1-definition-and-examples)</span>
</div>
