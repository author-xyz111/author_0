# 第十一章 · 无限 Galois 理论

---

## 本章定位

到目前为止，我们的 Galois 理论都建立在**有限扩张**之上。但数学中最重要的 Galois 群——如 $\operatorname{Gal}(\overline{\mathbb{Q}}/\mathbb{Q})$（$\mathbb{Q}$ 的绝对 Galois 群）——都是无限群。如何将有限理论推广到无限情形？

答案是：给 Galois 群赋予一种**拓扑**。在 Krull 拓扑下，无限 Galois 群成为紧的、完全不连通的 profinite 群。Galois 对应不再涉及"所有子群"，而只涉及**闭子群**。这一看似微小的技术修正，打开了通向现代数论和代数几何的大门。

::: tip 核心思想
有限 Galois 理论：$\operatorname{Gal}(L/K)$ 是有限群，中间域 ↔ 所有子群。

无限 Galois 理论：$\operatorname{Gal}(L/K)$ 是 profinite 群，中间域 ↔ **闭**子群。

Krull 拓扑不是人为添加的结构，而是从域扩张本身**自然涌现**的：两个自同构"接近"当且仅当它们在某个有限子扩张上的限制相同。
:::

---

## 本章导航

| 节 | 主题 | 核心内容 | 关键概念 |
|:--|:-----|:---------|:---------|
| §11.1 | [Krull 拓扑](11.1-krull-topology) | 逆极限、profinite 群的定义与等价刻画、Krull 拓扑的构造与性质、紧 Hausdorff 完全不连通性 | Krull 拓扑, profinite 群, $\varprojlim$, 逆极限拓扑 |
| §11.2 | [无穷 Galois 对应](11.2-galois-correspondence) | 无穷 Galois 对应定理（闭子群 ↔ 中间域）、有限 Galois 扩张 ↔ 开子群、Galois 下降、绝对 Galois 群 | 闭子群, 开子群, Galois 下降, $G_\mathbb{Q}$, $G_{\mathbb{F}_p}$ |

---

## 知识网络

```
         ┌───────────────────────────┐
         │  有限 Galois 对应 (Ch8)    │
         │  中间域 ↔ 子群（双射）     │
         └─────────┬─────────────────┘
                   │  如何推广到无限扩张？
         ┌─────────┴─────────────────┐
         │  代数闭包 (Ch6)             │
         │  L/K = 所有代数元的扩张     │
         └─────────┬─────────────────┘
                   │
      ┌────────────┴────────────┐
      │  ★ 第十一章：无限 Galois │
      │                          │
      │  §11.1 Krull 拓扑        │
      │  profinite 群 = 逆极限    │
      │  紧 + 完全不连通 + Hausdorff│
      │                          │
      │  §11.2 无穷 Galois 对应   │
      │  闭子群 ↔ 中间域           │
      │  开子群 ↔ 有限扩张         │
      │  Galois 下降               │
      └────────────┬────────────┘
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ 绝对Galois│ │ Galois   │ │ 代数几何  │
│ 群 G_Q   │ │ 表示     │ │ 平展基本  │
│ §11.2    │ │ (Ch12)   │ │ 群 (Ch12)│
└──────────┘ └──────────┘ └──────────┘
```

---

## 阅读路径

**快速路径**（30 分钟）：理解 Krull 拓扑的定义（§11.1 {def-krull-topology}）和无穷 Galois 对应定理的陈述（§11.2 {thm-infinite-galois-correspondence}）。关键是掌握"闭子群取代所有子群"这一核心修正。

**标准路径**（1.5 小时）：完整阅读 §11.1，理解 profinite 群的三种等价定义和 Krull 拓扑的基本性质定理（{thm-krull-properties}）。然后阅读 §11.2，学习无穷 Galois 对应的完整证明，以及 Galois 下降定理的应用。

**深入路径**（2.5 小时）：在标准路径基础上，研究绝对 Galois 群 $G_\mathbb{Q}$ 和 $G_{\mathbb{F}_p}$ 的具体性质，理解非闭子群的反例（{ex-non-closed-subgroup}），并思考 Galois 下降与 Grothendieck Galois 范畴的联系。

---

## 核心定理速览

| 定理 | 内容 | 直觉 |
|:-----|:-----|:-----|
| {thm-krull-properties} | $\operatorname{Gal}(L/K)$ 在 Krull 拓扑下是紧 Hausdorff profinite 群 | 无限 Galois 群是有限群的"极限" |
| {thm-infinite-galois-correspondence} | 中间域与**闭**子群的反序双射 | "闭性"是无限理论的核心条件 |
| {thm-galois-descent-vector-space} | $V^G \otimes_K L \cong V$（Galois 下降） | $L$-结构 + $G$-对称性 = $K$-结构 |
| {def-absolute-galois-group} | $G_{\mathbb{F}_q} \cong \hat{\mathbb{Z}}$，$G_\mathbb{Q}$ 极其复杂 | 有限域简单，有理数域复杂 |

---

## 典型例子一览

| Galois 扩张 $L/K$ | Galois 群 | 拓扑结构 | 闭子群 ↔ 中间域 |
|:---|:---|:---|:---|
| $\overline{\mathbb{F}}_p/\mathbb{F}_p$ | $\hat{\mathbb{Z}}$ | profinite 完成 | $n\hat{\mathbb{Z}} \leftrightarrow \mathbb{F}_{p^n}$ |
| $\mathbb{Q}(\zeta_{p^\infty})/\mathbb{Q}$ | $\mathbb{Z}_p^\times$ | $p$-进单位 | 子群 ↔ 分圆子扩张 |
| $\overline{\mathbb{Q}}/\mathbb{Q}$ | $G_\mathbb{Q}$（极复杂） | profinite | 所有数域的 Galois 理论 |

::: warning 非闭子群的教训
在有限 Galois 理论中，每个子群都对应一个中间域。在无限理论中，**只有闭子群**才能对应中间域。例如 $\mathbb{Z} \hookrightarrow \hat{\mathbb{Z}}$（由 $1 \mapsto \operatorname{Frob}_p$）给出的子群**不是闭的**——它在 $\hat{\mathbb{Z}}$ 中稠密，但不等于 $\hat{\mathbb{Z}}$。这个子群不对应任何中间域。见 {ex-non-closed-subgroup}。
:::

---

## 前置知识

- **必需**：[第八章 · Galois 对应](/chapters/08-galois-correspondence/)（有限 Galois 对应是本章的出发点）、[第六章 · 代数闭包](/chapters/06-algebraic-closure/)（无限扩张的动机）、[第一章 · 群论](/chapters/01-groups/)（群的基本语言）
- **推荐**：[第十章 · 有限域](/chapters/10-finite-fields/)（$\mathbb{F}_{p^n}$ 的 Galois 群是 $\hat{\mathbb{Z}}$ 的有限商）

---

## 后续指向

- **第十二章**：无限 Galois 理论是通往现代数论的桥梁——绝对 Galois 群 $G_\mathbb{Q}$ 的表示论是 Langlands 纲领的核心；profinite 群的范畴化推广（Galois 范畴、平展基本群）是代数几何的基石

---

<div class="chapter-nav">
  <span>← [第十章 · 有限域](/chapters/10-finite-fields/)</span>
  <span>[§11.1 Krull 拓扑 →](11.1-krull-topology)</span>
</div>
