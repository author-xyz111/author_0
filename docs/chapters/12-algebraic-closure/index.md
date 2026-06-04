# 前沿方向与现代 Galois 理论 {#sec-modern-directions}

::: intuition 从经典到现代
Galois 理论在 19 世纪诞生以来，已经从解决多项式方程的工具，成长为连接代数、几何、拓扑和数论的宏大框架。本章介绍 Galois 理论的几个前沿方向，展示它在现代数学中的深远影响。
:::

---

## 逆 Galois 问题 {#inverse-galois}

::: question 逆 Galois 问题 {#qst-inverse-galois}
**逆 Galois 问题：** 给定有限群 $G$，是否存在 Galois 扩张 $L/\mathbb{Q}$ 使得 $\operatorname{Gal}(L/\mathbb{Q}) \cong G$？
:::

::: theorem 已知结果 {#thm-inverse-galois-known}
**(i)** 所有**可解群**都是 $\mathbb{Q}$ 上的 Galois 群（Shafarevich, 1954）。

**(ii)** 所有**对称群** $S_n$ 和**交错群** $A_n$ 都是 $\mathbb{Q}$ 上的 Galois 群。

**(iii)** 所有**散在单群**（包括最大的 Mathieu 群和 Monster 群）都是 $\mathbb{Q}$ 上的 Galois 群。

**(iv)** 逆 Galois 问题对所有有限群仍然**开放**。
:::

::: intuition Hilbert 不可约定理 {#intuition-hilbert-irreducibility}
逆 Galois 问题的正面部分主要基于 **Hilbert 不可约定理**：设 $f(t, x) \in \mathbb{Q}(t)[x]$ 不可约。则存在无穷多个 $t_0 \in \mathbb{Q}$ 使得 $f(t_0, x)$ 在 $\mathbb{Q}[x]$ 中不可约，且 $\operatorname{Gal}(f(t_0, x)/\mathbb{Q}) \cong \operatorname{Gal}(f(t, x)/\mathbb{Q}(t))$。

这意味着：如果我们能在 $\mathbb{Q}(t)$（有理函数域）上实现群 $G$ 为 Galois 群，就能在 $\mathbb{Q}$ 上实现。这将逆 Galois 问题转化为一个**参数化问题**。
:::

---

## Grothendieck 的 Galois 理论 {#grothendieck-galois}

::: definition Galois 范畴 {#def-galois-category}
一个**Galois 范畴** $\mathcal{C}$ 是满足以下公理的范畴（Grothendieck, 1960s）：

**(G1)** $\mathcal{C}$ 有有限逆极限。

**(G2)** $\mathcal{C}$ 有有限余积（不交并），且余积是严格的。

**(G3)** 每个对象有唯一的"连通分支"分解。

**(G4)** 存在一个纤维函子 $F: \mathcal{C} \to (\text{有限集合})$。

**定理（Galois）：** 每个 Galois 范畴等价于某个 profinite 群 $G$ 的有限连续 $G$-集合的范畴。$G$ 由纤维函子 $F$ 的自同构群给出。
:::

::: intuition Grothendieck 的革命
经典 Galois 理论处理域扩张。Grothendieck 将其抽象为**范畴论框架**——Galois 范畴。这个框架适用于：

- **有限 étale 态射**：$X$ 上的有限 étale 覆盖构成 Galois 范畴，基本群 $\pi_1^{\text{ét}}(X)$ 取代了 Galois 群。
- **代数基本群**：对概形 $X$，étale 基本群 $\pi_1^{\text{ét}}(X, \bar{x})$ 是 profinite 群，编码了 $X$ 的所有有限覆盖的信息。
- **Tannakian 范畴**：表示论中 Tannakian 范畴通过 Galois 理论恢复群。

经典 Galois 对应成为 Grothendieck 框架的特殊情形：$X = \operatorname{Spec} K$ 时，$\pi_1^{\text{ét}}(\operatorname{Spec} K) = G_K$（绝对 Galois 群）。
:::

---

## Étale 基本群 {#etale-fundamental-group}

::: definition Étale 基本群 {#def-etale-pi1}
设 $X$ 是连通概形，$\bar{x}$ 是几何点。$X$ 的 **étale 基本群**定义为：
$$
\pi_1^{\text{ét}}(X, \bar{x}) = \text{纤维函子 } F_{\bar{x}}: (\text{有限 étale } X\text{-覆盖}) \to (\text{有限集合}) \text{ 的自同构群}.
$$
$\pi_1^{\text{ét}}(X, \bar{x})$ 是 profinite 群。
:::

::: theorem étale 基本群的经典对应 {#thm-etale-classical}
**(i)** 若 $X = \operatorname{Spec} K$，则 $\pi_1^{\text{ét}}(X) = G_K = \operatorname{Gal}(\overline{K}/K)$。

**(ii)** 若 $X = \operatorname{Spec} \mathbb{F}_q$，则 $\pi_1^{\text{ét}}(X) = \hat{\mathbb{Z}}$（由 Frobenius 生成）。

**(iii)** 若 $X = \mathbb{A}^1_{\mathbb{C}} = \operatorname{Spec} \mathbb{C}[t]$（仿射直线），则 $\pi_1^{\text{ét}}(X) = \{e\}$（代数基本群平凡——这与拓扑基本群 $\pi_1^{\text{top}}(\mathbb{C}) = \{e\}$ 一致）。

**(iv)** 若 $X = \mathbb{A}^1_{\mathbb{C}} \setminus \{0\} = \operatorname{Spec} \mathbb{C}[t, t^{-1}]$，则 $\pi_1^{\text{ét}}(X) = \hat{\mathbb{Z}}$（对应代数拓扑中的 $\pi_1^{\text{top}}(\mathbb{C}^\times) = \mathbb{Z}$ 的 profinite 完成）。
:::

::: intuition Étale 拓扑与拓扑的类比
étale 基本群是 Grothendieck 对"拓扑覆盖空间理论"的代数推广。在复几何中，étale 覆盖对应于拓扑覆盖（有限叶分歧覆盖），étale 基本群对应于拓扑基本群的 profinite 完成。但在正特征下，étale 理论给出了全新的信息（如 Artin–Schreier 覆盖、纯不可分现象等），是拓扑方法无法触及的。
:::

---

## Anabelian 几何 {#anabelian-geometry}

::: definition Anabelian 群 {#def-anabelian}
一个 profinite 群 $G$ 称为 **anabelian**，如果它"足够非阿贝尔"——具体地，$G$ 没有大的阿贝尔商。
:::

::: theorem Grothendieck 的 Anabelian 猜想 {#thm-anabelian}
**Grothendieck 的 Anabelian 猜想（部分已证）：** 对某些"anabelian"的代数簇 $X$（如亏格 $\geq 2$ 的曲线），$X$ 可以从其基本群 $\pi_1^{\text{ét}}(X, \bar{x})$ **完全恢复**。

即：如果 $X$ 和 $Y$ 是 $\overline{\mathbb{Q}}$ 上的 anabelian 簇，且 $\pi_1^{\text{ét}}(X) \cong \pi_1^{\text{ét}}(Y)$（作为外自同构类），则 $X \cong Y$。
:::

::: theorem Mochizuki 的工作 {#thm-mochizuki}
**(i)** **Neukirch–Uchida 定理（1970s）：** 数域可以从其绝对 Galois 群恢复。即若 $K, L$ 是数域，$G_K \cong G_L$（作为拓扑群的外自同构类），则 $K \cong L$。

**(ii)** **Mochizuki（1999）：** $\overline{\mathbb{Q}}$ 上亏格 $\geq 2$ 的曲线可以从其 étale 基本群恢复。

**(iii)** **Mochizuki 的 IUT（Inter-universal Teichmüller Theory, 2012–）：** 试图用 anabelian 几何的方法证明 ABC 猜想。其证明仍然极具争议。
:::

---

## Galois 上同调 {#galois-cohomology}

::: definition Galois 上同调 {#def-galois-cohomology}
设 $G = \operatorname{Gal}(L/K)$（$L/K$ 为 Galois 扩张），$A$ 为连续 $G$-模。**Galois 上同调**定义为群上同调：
$$
H^n(L/K, A) = H^n(G, A) = \operatorname{Ext}^n_{\mathbb{Z}[G]}(\mathbb{Z}, A).
$$
低阶上同调有具体解释：
- $H^0(G, A) = A^G$（$G$-不动元）。
- $H^1(G, A) = $ **交叉同态**模主交叉同态（分类 $A$-扭子）。
- $H^2(G, A) = $ **群扩张**的等价类（分类 $A$-中心扩张）。
:::

::: theorem Hilbert 定理 90 {#thm-hilbert-90}
设 $L/K$ 是有限 Galois 扩张，$G = \operatorname{Gal}(L/K)$。

**(i)** $H^1(G, L^\times) = 0$（Hilbert 定理 90）。

**(ii)** 若 $\operatorname{char} K \nmid [L:K]$（或更一般地，$L/K$ 可分），则 $H^2(G, L^\times)$ 分类 $L/K$ 上的**中心单代数**（Brauer 群的元素）。
:::

<ProofToggle>

**证明（Hilbert 90 的原始形式）.** 设 $\alpha \in L$ 满足 $N_{L/K}(\alpha) = \operatorname{N}_{L/K}(\alpha) = 1$。需证存在 $\beta \in L^\times$ 使得 $\alpha = \beta / \sigma(\beta)$（$\sigma$ 为 $G$ 的生成元，$L/K$ 循环扩张的情形）。

由 Dedekind 引理（线性无关性），$\{1, \sigma, \ldots, \sigma^{n-1}\}$ 作为 $L$-值函数在 $L$ 上线性无关。故存在 $\gamma \in L$ 使得 $\beta = \gamma + \alpha\sigma(\gamma) + \alpha\sigma(\alpha)\sigma^2(\gamma) + \cdots + \alpha\sigma(\alpha)\cdots\sigma^{n-2}(\alpha)\sigma^{n-1}(\gamma) \neq 0$。直接验证 $\alpha = \beta/\sigma(\beta)$。$\blacksquare$

</ProofToggle>

::: example Brauer 群 {#ex-brauer}
$\operatorname{Br}(K) = H^2(G_K, \overline{K}^\times)$（连续上同调）分类 $K$ 上的中心单代数。

- $\operatorname{Br}(\mathbb{R}) = \mathbb{Z}/2\mathbb{Z}$（Hamilton 四元数 $\mathbb{H}$ 是唯一的非平凡 Brauer 类）。
- $\operatorname{Br}(\mathbb{F}_q) = 0$（Wedderburn 小定理：有限除环都是域）。
- $\operatorname{Br}(\mathbb{Q})$ 的结构由 Albert–Brauer–Hasse–Noether 定理给出（局部-整体原理）。
:::

---

## 现代数论中的 Galois 表示 {#galois-representations}

::: definition $\ell$-进 Galois 表示 {#def-l-adic-representation}
设 $K$ 为数域，$\ell$ 为素数。一个 **$\ell$-进 Galois 表示**是连续同态：
$$
\rho: G_K \to \operatorname{GL}_n(\mathbb{Q}_\ell),
$$
其中 $G_K = \operatorname{Gal}(\overline{K}/K)$ 赋予 Krull 拓扑，$\operatorname{GL}_n(\mathbb{Q}_\ell)$ 赋予 $\ell$-进拓扑。
:::

::: theorem 椭圆曲线的 Galois 表示 {#thm-elliptic-galois}
设 $E/\mathbb{Q}$ 为椭圆曲线。$E$ 的 $\ell$-分挠点 $E[\ell] \cong (\mathbb{Z}/\ell\mathbb{Z})^2$ 上的 $G_\mathbb{Q}$ 作用给出 $\ell$-进 Galois 表示：
$$
\rho_{E,\ell}: G_\mathbb{Q} \to \operatorname{GL}_2(\mathbb{Z}_\ell) \hookrightarrow \operatorname{GL}_2(\mathbb{Q}_\ell).
$$

**Serre 的开放像定理：** 若 $E$ 没有复乘法（CM），则对所有充分大的 $\ell$，$\rho_{E,\ell}$ 的像在 $\operatorname{GL}_2(\mathbb{Z}_\ell)$ 中是开的。

**Modularity 定理（Wiles 等，1995–2001）：** 每条有理数域上的椭圆曲线是模的。这是证明 Fermat 大定理的关键。
:::

::: intuition Galois 表示的深远意义
Galois 表示是现代代数数论的核心语言。它们将算术信息（如椭圆曲线的点、模形式的系数）编码为线性代数（矩阵），使得我们可以用表示论的工具研究算术。Langlands 纲领的核心思想就是：$G_\mathbb{Q}$ 的 $n$ 维 Galois 表示与 $\operatorname{GL}_n$ 的自守形式之间存在深刻联系。
:::

---

## 类域论 {#class-field-theory}

::: theorem 类域论（概述） {#thm-class-field-theory}
**类域论**（class field theory）是关于数域的 Abel 扩张（Galois 群为阿贝尔群的扩张）的完整理论。

设 $K$ 为数域。则 $K$ 的 Abel 扩张与 $K$ 的**理想类群**（或更精确地，**idele 类群** $C_K = \mathbb{A}_K^\times / K^\times$）的商一一对应。

**Artin 互反律：** 存在连续同态
$$
\operatorname{Art}_K: C_K \to G_K^{\text{ab}} = \operatorname{Gal}(K^{\text{ab}}/K),
$$
它是满射，核为连通分支。这给出了 $K$ 的 Abel 扩张与 $C_K$ 的开子群之间的一一对应。

**特例：**
- $\mathbb{Q}$ 的 Abel 扩张恰好是分圆域 $\mathbb{Q}(\zeta_n)$ 的子域（Kronecker–Weber 定理）。$G_\mathbb{Q}^{\text{ab}} \cong \hat{\mathbb{Z}}^\times$。
- 虚二次域的类域论（Hilbert 第 12 问题）涉及椭圆函数和模函数。
:::

---

## Langlands 纲领 {#langlands-program}

::: intuition Langlands 纲领
**Langlands 纲领**（Langlands program, 1967–）是类域论的非阿贝尔推广。它的核心愿景是：

> $n$ 维 Galois 表示与 $\operatorname{GL}_n$ 的自守表示之间存在一一对应。

对 $n = 1$，这就是类域论（Abel 对应）。对 $n = 2$，涉及模形式、椭圆曲线和 Shimura 簇。一般 $n$ 的情形远未完全解决。

**里程碑：**
- **Fermat 大定理（Wiles, 1995）：** 通过证明半稳定椭圆曲线的 modularity 定理。
- **局部 Langlands 对应（Harris–Taylor, 2001; Henniart, 2000）：** 局部域上的完整证明。
- **几何 Langlands（Frenkel–Gaitsgory 等）：** 用 étale 基本群和表示论的语言重新表述。
:::

---

## 覆盖空间与 Galois 理论的拓扑类比 {#topology-analogy}

::: proposition 拓扑覆盖与 Galois 对应 {#prop-topology-galois}
拓扑覆盖空间理论与 Galois 理论有深刻的类比：

| **拓扑** | **代数** |
|:---:|:---:|
| 连通空间 $X$ | 域 $K$ |
| 基本群 $\pi_1(X, x_0)$ | 绝对 Galois 群 $G_K$ |
| $n$-叶覆盖 | $n$ 次域扩张 |
| 正规覆盖 | Galois 扩张 |
| $\pi_1(\tilde{X}) \trianglelefteq \pi_1(X)$ | $\operatorname{Gal}(L/M) \trianglelefteq \operatorname{Gal}(L/K)$ |
| Galois 对应（覆盖空间 ↔ 子群） | Galois 对应（中间域 ↔ 子群） |

这个类比在 Grothendieck 的 étale 理论中被完全形式化。
:::

---

## 与前面章节的联系 {#cross-refs}

- 有限 Galois 对应在 [§8.1](/chapters/08-galois-correspondence/8.1-fundamental-theorem)。
- 无限 Galois 理论在 [第十一章](/chapters/11-infinite-galois/)。
- 可解群与逆 Galois 问题在 [§9.1](/chapters/09-solvability/9.1-solvable-groups)。
- 有限域的 Frobenius 自同构在 [§10.2](/chapters/10-finite-fields/)。
- 代数闭包的构造在 [§6.1](/chapters/06-algebraic-closure/)。
- 分圆域与 Kronecker–Weber 定理需要 [§4.2 分圆多项式](/chapters/04-polynomials/4.2-irreducibility)。

---

<div class="chapter-nav">
  <span>← [第十一章 · 无限 Galois 理论](/chapters/11-infinite-galois/)</span>
  <span>[参考文献 →](/reference/bibliography)</span>
</div>
