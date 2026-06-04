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


## 微分 Galois 理论 {#differential-galois}

::: intuition 从代数到微分
经典 Galois 理论研究多项式方程的对称性。**微分 Galois 理论**将这一思想推广到**线性微分方程**：它研究的是微分域（带导算子的域）的扩张，而非代数域扩张。
:::

::: definition 微分域与微分扩张 {#def-differential-field}
一个**微分域** $(K, \partial)$ 是一个域 $K$ 带有一个导算子 $\partial: K \to K$（满足 Leibniz 法则和加法线性性）。

典型例子：$K = \mathbb{C}(t)$，$\partial = d/dt$（有理函数域上的通常导数）。

**Picard–Vessiot 扩张**是微分 Galois 理论中"Galois 扩张"的类比：它是包含线性微分方程所有解的最小微分扩张，且满足可分性条件。
:::

::: theorem 微分 Galois 对应 {#thm-differential-galois}
设 $L/K$ 是 Picard–Vessiot 扩张。则存在**微分 Galois 群** $\operatorname{DGal}(L/K)$（一个线性代数群），使得：

**(i)** $L^{\operatorname{DGal}(L/K)} = K$（不动域恰好是基域）。

**(ii)** 存在中间微分域与 $\operatorname{DGal}(L/K)$ 的闭子群之间的反序一一对应（微分 Galois 对应）。

**(iii)** $L/K$ 是"微分 Galois 的"当且仅当 $\operatorname{DGal}(L/K)$ 是线性代数群。
:::

::: example 指数方程 {#ex-differential-exp}
考虑微分方程 $y' = ay$（$a \in K$）。解为 $y = ce^{\int a}$。

- 若 $a = 1$，$K = \mathbb{C}(t)$，则解涉及 $e^t$。微分 Galois 群为 $\mathbb{G}_m = \operatorname{GL}_1$（乘法群），因为解空间是一维的，$e^t$ 不在 $\mathbb{C}(t)$ 中。
- 若 $a = 0$，则解在 $K$ 中，Galois 群平凡。
- **Liouville 定理（1835）：** $\int e^{-t^2} dt$（误差函数）不能用初等函数表示，对应于 Galois 群 $\operatorname{GL}_1$ 非平凡。
:::

::: intuition 算法不可积性
微分 Galois 理论提供了"**不可积性**"的精确判据：一个线性微分方程有初等解当且仅当其微分 Galois 群可解（在适当的代数群意义下）。这与经典 Galois 理论中"五次方程无根式解"的定理完全类比。
:::

---

## Tannakian 范畴与重建定理 {#tannakian}

::: definition Tannakian 范畴 {#def-tannakian}
一个**Tannakian 范畴**是一个具有张量积结构的 Abel 范畴 $\mathcal{C}$，满足：

**(T1)** $\mathcal{C}$ 是 $k$-线性的（$k$ 为域）。

**(T2)** $\mathcal{C}$ 有对称幺半张量积结构 $\otimes$ 和单位对象 $\mathbf{1}$。

**(T3)** 每个对象的对偶存在（刚性条件）。

**(T4)** 存在一个"纤维函子" $\omega: \mathcal{C} \to \operatorname{Vec}_k$（忠实、精确的 $k$-线性张量函子）。
:::

::: theorem Tannaka 重建定理 {#thm-tannaka-reconstruction}
**（Tannaka–Krein–Deligne）** 设 $(\mathcal{C}, \otimes, \omega)$ 是 Tannakian 范畴。令 $G = \underline{\operatorname{Aut}}^{\otimes}(\omega)$（纤维函子的张量自同构群，作为仿射群概形）。则：

$$
\mathcal{C} \simeq \operatorname{Rep}_k(G)
$$

即 $\mathcal{C}$ 等价于 $G$ 的有限维 $k$-表示范畴。
:::

::: intuition Tannakian 重建的意义
Tannakian 哲学是：**从范畴恢复群**。如果我们有一个范畴，它"看起来像"某个群的表示范畴，那么这个群就完全由范畴的张量结构决定。

这与 Galois 理论的联系：
- 设 $L/K$ 是 Galois 扩张，$G = \operatorname{Gal}(L/K)$。则 $L$ 上的 $G$-等变向量空间构成 Tannakian 范畴，Tannaka 重建恢复 $G$。
- **Motivic Galois 群**：纯动机的范畴（若存在）应该是某个 pro-reductive 群的表示范畴——这就是 motivic Galois 群。它是"最大的 Galois 群"，统一了所有上同调理论中的 Galois 作用。
- **Serre 的 Tannakian 分类**：有限群的 Galois 表示的 Tannakian 范畴确定了一个 pro-algebraic 群，其有限商恰好分类了所有该群的表示。
:::

---

## Étale 上同调 {#etale-cohomology}

::: intuition 为什么需要 étale 上同调？
代数簇的"拓扑"信息（Betti 数、Lefschetz 不动点定理等）在 Zariski 拓扑下几乎完全丢失——Zariski 拓扑太粗糙了。Grothendieck 引入 **étale 拓扑**作为代数簇的"正确的"拓扑，使得拓扑方法（覆盖空间、上同调、同伦）可以在代数几何中应用。
:::

::: definition Étale 上同调 {#def-etale-cohomology}
设 $X$ 是概形，$\ell$ 是与 $\operatorname{char} X$ 互素的素数。$X$ 的 **étale 上同调** $H^i_{\text{ét}}(X, \mathbb{Z}/\ell^n\mathbb{Z})$ 由 $\mathbb{Z}/\ell^n\mathbb{Z}$ 的常值层在 étale 拓扑下的层上同调定义。

取逆极限得 $\ell$-进上同调：
$$
H^i_{\text{ét}}(X, \mathbb{Z}_\ell) = \varprojlim_n H^i_{\text{ét}}(X, \mathbb{Z}/\ell^n\mathbb{Z}), \quad H^i_{\text{ét}}(X, \mathbb{Q}_\ell) = H^i_{\text{ét}}(X, \mathbb{Z}_\ell) \otimes_{\mathbb{Z}_\ell} \mathbb{Q}_\ell.
$$
:::

::: theorem étale 上同调的基本性质 {#thm-etale-cohomology-properties}
设 $X$ 是特征零域 $k$ 上的光滑代数簇，$d = \dim X$。

**(i)** **有限性：** $H^i_{\text{ét}}(X_{\bar{k}}, \mathbb{Q}_\ell)$ 是有限维 $\mathbb{Q}_\ell$-向量空间。

**(ii)** **Poincaré 对偶：** 若 $X$ 是 $k$ 上光滑、几何连通、纯维数 $d$ 的射影簇，则存在完美配对 $H^i \times H^{2d-i} \to H^{2d} \cong \mathbb{Q}_\ell(-d)$。

**(ii)** **Lefschetz 不动点公式：** 若 $f: X \to X$ 是自态射，则 $f$ 的不动点个数（计重数）为 $\sum_i (-1)^i \operatorname{tr}(f^* | H^i_{\text{ét}})$。

**(iv)** **复比较定理：** 若 $k = \mathbb{C}$，则 $H^i_{\text{ét}}(X^{\text{an}}, \mathbb{Q}_\ell) \cong H^i_{\text{sing}}(X^{\text{an}}, \mathbb{Q}) \otimes_{\mathbb{Q}} \mathbb{Q}_\ell$（奇异上同调的 $\ell$-进实现）。
:::

::: intuition étale 上同调的 Galois 作用
$X$ 的 étale 上同调 $H^i_{\text{ét}}(X_{\bar{k}}, \mathbb{Q}_\ell)$ 上有一个自然的 $G_k$ 作用（$\bar{k}/k$ 的 Galois 群）。这正是 [§12 中 Galois 表示](#galois-representations)的来源——椭圆曲线 $E$ 的 Tate 模 $T_\ell(E)$ 就是 $H^1_{\text{ét}}(E_{\bar{k}}, \mathbb{Z}_\ell)$ 的对偶。

**Weil 猜想**（Deligne, 1974 证明）的核心就是用 étale 上同调中 Frobenius 的特征值来计算 zeta 函数。
:::

---

## Perfectoid 空间 {#perfectoid-spaces}

::: intuition Scholze 的革命
**Perfectoid 空间**（Peter Scholze, 2012）是 $p$-进几何中一个全新的框架。它的一个核心思想是：在"足够深"的 $p$-进扩张中，**加法结构和乘法结构可以互换**（tilting 对应）。这为 $p$-进 Hodge 理论和 Langlands 纲领提供了革命性的新工具。
:::

::: definition 完备代数闭非阿基米德域 {#def-perfectoid-field}
一个**完美域**（perfectoid field）是一个完备的非阿基米德域 $K$，满足：

**(P1)** 值群 $|K^\times| \subset \mathbb{R}_{>0}$ 是稠密的。

**(P2)** Frobenius 映射 $\phi: \mathcal{O}_K/p \to \mathcal{O}_K/p$ 是满射（$p = \operatorname{char}(\mathcal{O}_K/\mathfrak{m}_K)$）。

例子：$\mathbb{C}_p$（$\mathbb{Q}_p$ 的完备代数闭包）是完美域。
:::

::: theorem Tilting 对应 {#thm-tilting}
设 $K$ 是完美域，特征为 $p$。则存在**tilt** $K^\flat$（特征 $p$ 的完美域）使得：

$$
K^\flat = \varprojlim_{x \mapsto x^p} \mathcal{O}_K/p
$$

**关键定理（Fontaine–Wintenberger, Scholze 推广）：** $K$ 和 $K^\flat$ 的**绝对 Galois 群同构**：
$$
G_K \cong G_{K^\flat}.
$$
:::

::: intuition 完美对应
Tilting 对应是说：在 perfectoid 世界中，**特征零的算术和特征 $p$ 的算术本质上是等价的**。一个关于 $K$ 的 Galois 理论问题可以被"倾斜"到特征 $p$ 的对应物 $K^\flat$ 上——而后者通常更简单（因为 Frobenius 是满射，代数结构更"完美"）。

这与 Galois 理论的联系：
- $G_K \cong G_{K^\flat}$ 意味着两个"完全不同"的域有相同的 Galois 群。这是 anabelian 几何精神的一个实例。
- Scholze 用 perfectoid 空间证明了**局部 Langlands 对应**的某些新情形，以及**固有性定理**（关于 Shimura 簇上同调的上同调有限性）。
:::

---

## $p$-进 Hodge 理论 {#p-adic-hodge}

::: intuition 几种上同调的统一
对复数域上的光滑射影簇 $X$，我们有奇异上同调 $H^i_{\text{sing}}$（Betti 上同调）、de Rham 上同调 $H^i_{\text{dR}}$ 和代数 de Rham 上同调之间的经典比较同构（de Rham 定理）。

对 $p$-进域上的簇，**$p$-进 Hodge 理论**（Fontaine, 1980s–）建立了 étale 上同调、de Rham 上同调和晶体上同调之间的比较同构。这是 Hodge 理论的 $p$-进类比。
:::

::: theorem $p$-进 Hodge 理论的基本比较定理 {#thm-p-adic-hodge}
设 $K$ 是有限扩张 $K/\mathbb{Q}_p$，$X$ 是 $K$ 上的光滑固有代数簇。Fontaine 构造了**周期环** $B_{\text{dR}}$、$B_{\text{cris}}$、$B_{\text{st}}$，使得：

**(i) de Rham 比较（Faltings, 1989）：**
$$
H^i_{\text{ét}}(X_{\bar{K}}, \mathbb{Q}_p) \otimes_{\mathbb{Q}_p} B_{\text{dR}} \cong H^i_{\text{dR}}(X/K) \otimes_K B_{\text{dR}}.
$$

**(ii)** 若 $X$ 有**好约化**（good reduction），则：
$$
H^i_{\text{ét}}(X_{\bar{K}}, \mathbb{Q}_p) \otimes_{\mathbb{Q}_p} B_{\text{cris}} \cong H^i_{\text{cris}}(\bar{X}_0/W(\bar{k})) \otimes_{W(\bar{k})} B_{\text{cris}},
$$
其中 $H^i_{\text{cris}}$ 是晶体上同调（crystalline cohomology），$W(\bar{k})$ 是 Witt 向量环。
:::

::: intuition Hodge–Tate 分解
最简单的比较定理是 **Hodge–Tate 分解**（Fontaine）：
$$
H^i_{\text{ét}}(X_{\bar{K}}, \mathbb{Q}_p) \otimes_{\mathbb{Q}_p} \mathbb{C}_p \cong \bigoplus_{j=0}^i H^j(X, \Omega^{i-j}_{X/K}) \otimes_K \mathbb{C}_p(j),
$$
其中 $\mathbb{C}_p(j)$ 是第 $j$ 次 Tate 扭。

这将 étale 上同调（Galois 表示的载体）与代数 de Rham 上同调（微分形式的载体）联系起来，是 $p$-进 Hodge 理论的基石。
:::

::: theorem Scholze 的 $p$-进 Hodge 理论 {#thm-scholze-hodge}
Scholze（2013–）用 perfectoid 空间给出了 $p$-进 Hodge 理论的新证明和发展：

**(i)** **Hodge–Tate 谱序列的退化：** 通过 perfectoid 空间的 Hodge–Tate 谱序列，Scholze 给出了更概念化和更一般的情形。

**(ii)** **相对 $p$-进 Hodge 理论：** 在 perfectoid 空间上，$B_{\text{dR}}$ 变成了层（而非仅仅是 Galois 模），这允许在模空间族上做 Hodge 理论。

**(iii)** **固有性定理（Scholze, 2015）：** 某些 Shimura 簇的上同调是固有的（overconvergent），这用传统方法无法证明。
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
