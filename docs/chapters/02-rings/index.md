---
outline: [2, 3]
---

# 第二章 环与理想

::: info 本章概要
从群论过渡到环论，我们引入带有两种运算（加法和乘法）的代数结构。环的理想扮演着群论中正规子群的角色——它们是构造商环的基础，也是 [分裂域与正规扩张](/chapters/05-splitting-fields/) 的根基。
:::

## 本章内容

| 节 | 标题 | 核心概念 |
|---|------|----------|
| §2.1 | [环的定义与基本性质](/chapters/02-rings/2.1-basic-definitions) | 环、交换环、整环、零因子、单位 |
| §2.2 | [理想与商环](/chapters/02-rings/2.2-ideals) | 理想、主理想、商环、环同态基本定理 |
| §2.3 | [多项式环](/chapters/02-rings/2.3-polynomial-rings) | $R[x]$、带余除法、不可约多项式 |
| §2.4 | [中国剩余定理](/chapters/02-rings/2.4-crt) | 中国剩余定理及其应用 |

## 与前后章的联系

::: remark
环论是连接 [群论](/chapters/01-groups/) 和 [域论](/chapters/03-fields/) 的桥梁。关键联系：

1. **从群到环**：域的乘法群 $(F^*, \cdot)$ 和加法群 $(F, +)$ 都是交换群，它们通过分配律联系在一起。
2. **从环到域**：域是没有非零零因子的交换环，且每个非零元素都有逆。整环的分式域构造给出了从环到域的标准方法。
3. **环同态基本定理**：$R/\ker\varphi \cong \operatorname{im}\varphi$ 是 {thm-first-isomorphism} 的环论版本。
4. **理想的角色**：在 [分裂域与正规扩张](/chapters/05-splitting-fields/) 中，不可约多项式的理想 $(f(x))$ 给出域扩张 $K[x]/(f(x)) \cong K(\alpha)$。
:::
