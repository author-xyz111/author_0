# 无限 Galois 理论 {#sec-infinite-galois}

::: intuition 为什么需要无限 Galois 理论？
有限 Galois 理论处理有限扩张。但数学中最深刻的 Galois 理论出现在**无限扩张**的情形：$\overline{\mathbb{Q}}/\mathbb{Q}$（代数数域的绝对 Galois 群）、$\overline{\mathbb{F}_p}/\mathbb{F}_p$（有限域的绝对 Galois 群）、以及 $\mathbb{C}(t)$ 的各种覆盖。无限 Galois 理论的核心创新是引入**拓扑**：Galois 群携带自然的 profinite 拓扑，Galois 对应必须限制为**闭子群**而非所有子群。
:::

---

## Profinite 群 {#profinite-groups}

::: definition 逆极限 {#def-inverse-limit}
设 $\{G_i, \varphi_{ij}\}$ 是一个**逆系统**（inverse system）：即有一族群 $G_i$（$i$ 在有向集 $I$ 中），对 $i \leq j$ 有同态 $\varphi_{ij}: G_j \to G_i$，满足 $\varphi_{ii} = \operatorname{id}$，$\varphi_{ik} = \varphi_{ij} \circ \varphi_{jk}$。

**逆极限**（inverse limit）定义为：
$$
\varprojlim_i G_i = \{(g_i)_{i \in I} \in \prod_{i \in I} G_i : \varphi_{ij}(g_j) = g_i \text{ 对所有 } i \leq j\}.
$$
配备乘积拓扑（每个 $G_i$ 取离散拓扑）。
:::

::: definition Profinite 群 {#def-profinite-group}
一个拓扑群 $G$ 称为**profinite 群**，如果以下等价条件之一成立：

**(i)** $G$ 同构于有限群的逆极限：$G \cong \varprojlim_i G_i$（$G_i$ 有限）。

**(ii)** $G$ 是紧致的、完全不连通的、Hausdorff 的拓扑群。

**(iii)** $G$ 是有限群的逆极限，其中过渡映射都是满同态。
:::

::: example 常见 profinite 群 {#ex-profinite}
- $p$-进整数 $\mathbb{Z}_p = \varprojlim_n \mathbb{Z}/p^n\mathbb{Z}$。
- $\hat{\mathbb{Z}} = \varprojlim_n \mathbb{Z}/n\mathbb{Z}$（profinite 完成整数环）。
- 有限群（离散拓扑下是 profinite 的）。
- 任何有限群的直积（乘积拓扑下）。
:::

---

## Krull 拓扑 {#krull-topology}

::: definition Krull 拓扑 {#def-krull-topology}
设 $L/K$ 是（可能无限的）Galois 扩张。**Krull 拓扑** 在 $G = \operatorname{Gal}(L/K)$ 上定义如下：对每个有限子扩张 $F/K$（$K \subseteq F \subseteq L$，$[F:K] < \infty$），集合
$$
G_F = \operatorname{Gal}(L/F) = \{\sigma \in G : \sigma|_F = \operatorname{id}_F\}
$$
构成 $G$ 的开正规子群。$\{G_F : F/K \text{ 有限}\}$ 形成 $e \in G$ 的邻域基。即 $\sigma \in G$ 的邻域形如 $\sigma G_F$。
:::

::: proposition Krull 拓扑的性质 {#prop-krull-topology}
**(i)** $G = \operatorname{Gal}(L/K)$ 在 Krull 拓扑下是 **profinite 群**。

**(ii)** $G \cong \varprojlim_F \operatorname{Gal}(F/K)$，其中极限遍历所有有限 Galois 子扩张 $F/K$。

**(iii)** $G$ 是紧致的、完全不连通的、Hausdorff 的。

**(iv)** 当 $L/K$ 是有限 Galois 扩张时，Krull 拓扑退化为离散拓扑，回归经典理论。
:::

<ProofToggle>

**证明.**

**(i)-(ii)** 设 $L/K = \bigcup_F F$（并集遍历所有有限 Galois 子扩张）。映射 $\sigma \mapsto (\sigma|_F)_F$ 给出同态 $G \to \varprojlim_F \operatorname{Gal}(F/K)$。这是同构（满射来自 $L$ 中的元素都在某个 $F$ 中，单射来自分离性——$\sigma$ 由它在所有有限子扩张上的限制唯一确定）。

**(iii)** 作为有限离散群的逆极限，$G$ 自动紧致（Tychonoff 定理的闭子群）、完全不连通和 Hausdorff。

**(iv)** $L/K$ 有限时，$G_{\{K\}} = \operatorname{Gal}(L/K) = G$ 本身是开集，故拓扑离散。$\blacksquare$

</ProofToggle>

::: example 绝对 Galois 群 {#ex-absolute-galois}
$\operatorname{Gal}(\overline{\mathbb{Q}}/\mathbb{Q})$ 称为 $\mathbb{Q}$ 的**绝对 Galois 群**。它是 profinite 群，同构于 $\varprojlim_{F} \operatorname{Gal}(F/\mathbb{Q})$（$F$ 遍历 $\mathbb{Q}$ 的所有有限 Galois 扩张）。这个群极其复杂——它包含所有有限 Galois 群的信息，至今不为人们完全理解。
:::

---

## 无限 Galois 对应 {#infinite-correspondence}

::: theorem 无限 Galois 对应 {#thm-infinite-galois-correspondence}
设 $L/K$ 是 Galois 扩张（可能无限），$G = \operatorname{Gal}(L/K)$（profinite 群）。则：

中间域 $\{M : K \subseteq M \subseteq L\}$ 与 $G$ 的**闭子群**之间存在反序双射：
$$
M \mapsto \operatorname{Gal}(L/M) \quad (\text{闭子群}), \qquad H \mapsto L^H \quad (\text{中间域}).
$$

若 $M/K$ 是 Galois 的，则 $\operatorname{Gal}(L/M) \trianglelefteq_{\text{closed}} G$，且 $G/\operatorname{Gal}(L/M) \cong \operatorname{Gal}(M/K)$（有限群的商，或 profinite 商）。
:::

<ProofToggle>

**证明.** 关键区别于有限情形：必须证明 $\operatorname{Gal}(L/M)$ 是闭子群（而非所有子群），且 $\Psi \circ \Phi = \operatorname{id}$ 和 $\Phi \circ \Psi = \operatorname{id}$ 仅对闭子群成立。

**$\operatorname{Gal}(L/M)$ 是闭的：** $\operatorname{Gal}(L/M) = \bigcap_{m \in M} \operatorname{Gal}(L/K(m))$。每个 $\operatorname{Gal}(L/K(m))$ 是 Krull 拓扑下的闭集（是开集，同时也是闭集——profinite 群中的开子群也是闭子群），故交集是闭的。

**$\Psi \circ \Phi = \operatorname{id}$：** 设 $M$ 为中间域，$H = \operatorname{Gal}(L/M)$。$L^H = M$ 的证明与有限情形相同：若 $\alpha \in L \setminus M$，则 $\alpha$ 在 $M$ 上的极小多项式 $m_\alpha^M$ 在 $L$ 中有多个根，存在 $\sigma \in H$ 将 $\alpha$ 映到不同的根。

**$\Phi \circ \Psi = \operatorname{id}$（对闭子群）：** 设 $H \leq G$ 是闭子群，$M = L^H$。则 $\operatorname{Gal}(L/M) = \overline{H}$（$H$ 的闭包）。因 $H$ 已闭，$\overline{H} = H$。

注意：**非闭子群**没有对应的中间域。这正是无限 Galois 理论与有限理论的根本区别。$\blacksquare$

</ProofToggle>

::: example 非闭子群的例子 {#ex-non-closed-subgroup}
设 $G = \hat{\mathbb{Z}} = \operatorname{Gal}(\overline{\mathbb{F}_p}/\mathbb{F}_p)$。$G$ 的闭子群形如 $n\hat{\mathbb{Z}}$（$n \geq 0$），对应不动域 $\mathbb{F}_{p^n}$。

但 $\mathbb{Z} \hookrightarrow \hat{\mathbb{Z}}$（由 $1 \mapsto \operatorname{Frob}_p$）给出的子群 $\mathbb{Z}$ **不是闭的**（它在 $\hat{\mathbb{Z}}$ 中稠密）。$\mathbb{Z}$ 的闭包是整个 $\hat{\mathbb{Z}}$。故 $\mathbb{Z}$ 不对应任何中间域。
:::

---

## 绝对 Galois 群 {#absolute-galois}

::: definition 绝对 Galois 群 {#def-absolute-galois}
域 $K$ 的**绝对 Galois 群**定义为 $G_K = \operatorname{Gal}(\overline{K}/K)$，其中 $\overline{K}$ 是 $K$ 的代数闭包。
:::

::: theorem 绝对 Galois 群的基本性质 {#thm-absolute-galois}
**(i)** $G_{\mathbb{F}_q} = \operatorname{Gal}(\overline{\mathbb{F}_q}/\mathbb{F}_q) \cong \hat{\mathbb{Z}}$，由 Frobenius 自同构拓扑生成。

**(ii)** $G_{\mathbb{R}} = \operatorname{Gal}(\mathbb{C}/\mathbb{R}) \cong \mathbb{Z}/2\mathbb{Z}$（由复共轭生成）。

**(iii)** $G_\mathbb{Q}$ 是极其复杂的 profinite 群，包含所有有限 Galois 群。确定 $G_\mathbb{Q}$ 的结构（即使是部分的）是现代数论的核心问题。
:::

<ProofToggle>

**证明.**

**(i)** $\overline{\mathbb{F}_q} = \bigcup_n \mathbb{F}_{q^n}$。$\operatorname{Gal}(\mathbb{F}_{q^n}/\mathbb{F}_q) \cong \mathbb{Z}/n\mathbb{Z}$，过渡映射为 $\mathbb{Z}/mn\mathbb{Z} \to \mathbb{Z}/n\mathbb{Z}$（自然投影）。逆极限为 $\varprojlim_n \mathbb{Z}/n\mathbb{Z} = \hat{\mathbb{Z}}$。

**(ii)-(iii)** 由定义和已知结果直接得出。$\blacksquare$

</ProofToggle>

---

## 与前面章节的联系 {#cross-refs}

- 有限 Galois 对应在 [§8.1](/chapters/08-galois-correspondence/8.1-fundamental-theorem)。
- 代数闭包的构造在 [§6.1](/chapters/06-algebraic-closure/)。
- 有限域的 Galois 群在 [§10.2](/chapters/10-finite-fields/)。
- profinite 群的表示论是现代数论的核心工具（见 [第十二章](/chapters/12-algebraic-closure/)）。

---

<div class="chapter-nav">
  <span>← [第十章 · 有限域](/chapters/10-finite-fields/)</span>
  <span>[第十二章 · 现代方向 →](/chapters/12-algebraic-closure/)</span>
</div>
