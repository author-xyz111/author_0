<template>
  <div class="theorem-explorer">
    <!-- Search & Filter Bar -->
    <div class="theorem-explorer__toolbar">
      <div class="theorem-explorer__search">
        <span class="theorem-explorer__search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索定理、定义、引理..."
          class="theorem-explorer__input"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="theorem-explorer__clear">✕</button>
      </div>
      <div class="theorem-explorer__filters">
        <button
          v-for="(label, key) in kindLabels"
          :key="key"
          :class="['theorem-explorer__filter', { active: activeKind === key }]"
          @click="toggleKind(key)"
        >
          <span class="theorem-explorer__filter-dot" :style="{ background: kindColors[key] }"></span>
          {{ label }}
          <span class="theorem-explorer__filter-count">{{ kindCounts[key] }}</span>
        </button>
      </div>
      <div class="theorem-explorer__chapter-filter">
        <select v-model="activeChapter" class="theorem-explorer__select">
          <option value="">所有章节</option>
          <option v-for="ch in chapters" :key="ch.id" :value="ch.id">第{{ ch.num }}章 {{ ch.label }}</option>
        </select>
        <span class="theorem-explorer__result-count">
          {{ filteredItems.length }} / {{ allItems.length }} 项
        </span>
      </div>
    </div>

    <!-- Results Grid -->
    <div class="theorem-explorer__grid">
      <TransitionGroup name="card-list">
        <div
          v-for="item in paginatedItems"
          :key="item.id"
          class="theorem-explorer__card"
          :class="[`theorem-explorer__card--${item.kind}`]"
          @click="navigateTo(item)"
        >
          <div class="theorem-explorer__card-header">
            <span class="theorem-explorer__card-kind" :style="{ background: kindColors[item.kind] }">
              {{ kindLabels[item.kind] || item.kind }}
            </span>
            <span class="theorem-explorer__card-chapter">第{{ item.chapterNum }}章</span>
          </div>
          <div class="theorem-explorer__card-title">{{ item.title }}</div>
          <div class="theorem-explorer__card-preview" v-if="item.preview">{{ item.preview }}</div>
          <div class="theorem-explorer__card-tags">
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="theorem-explorer__tag"
            >{{ tag }}</span>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Pagination -->
    <div class="theorem-explorer__pagination" v-if="totalPages > 1">
      <button
        :disabled="currentPage <= 1"
        @click="currentPage--"
        class="theorem-explorer__page-btn"
      >← 上一页</button>
      <span class="theorem-explorer__page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        :disabled="currentPage >= totalPages"
        @click="currentPage++"
        class="theorem-explorer__page-btn"
      >下一页 →</button>
    </div>

    <!-- Empty state -->
    <div v-if="filteredItems.length === 0" class="theorem-explorer__empty">
      <div class="theorem-explorer__empty-icon">∅</div>
      <div class="theorem-explorer__empty-text">
        没有匹配的结果。尝试修改搜索条件或清除筛选。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vitepress'

interface MathItem {
  id: string
  kind: string
  title: string
  preview: string
  chapter: string
  chapterNum: number
  page: string
  tags: string[]
}

const router = useRouter()

const kindLabels: Record<string, string> = {
  def: '定义', thm: '定理', lem: '引理', prop: '命题',
  cor: '推论', ex: '例', rem: '注', ax: '公理'
}

const kindColors: Record<string, string> = {
  def: 'var(--env-definition-border)',
  thm: 'var(--env-theorem-border)',
  lem: 'var(--env-lemma-border)',
  prop: 'var(--env-proposition-border)',
  cor: 'var(--env-corollary-border)',
  ex: 'var(--env-example-border)',
  rem: 'var(--env-remark-border)',
  ax: 'var(--env-axiom-border)',
}

const chapters = [
  { id: '01-groups', num: 1, label: '群论基础' },
  { id: '02-rings', num: 2, label: '环与理想' },
  { id: '03-fields', num: 3, label: '域论基础' },
  { id: '04-polynomials', num: 4, label: '多项式' },
  { id: '05-field-extensions', num: 5, label: '域扩张' },
  { id: '06-splitting-fields', num: 6, label: '分裂域与正规扩张' },
  { id: '07-galois-groups', num: 7, label: 'Galois 群' },
  { id: '08-galois-correspondence', num: 8, label: 'Galois 对应' },
  { id: '09-solvability', num: 9, label: '可解性与尺规作图' },
  { id: '10-finite-fields', num: 10, label: '有限域' },
  { id: '11-infinite-galois', num: 11, label: '无限 Galois 理论' },
  { id: '12-algebraic-closure', num: 12, label: '代数闭包' },
]

// Curated items (comprehensive catalog of all mathematical environments)
const allItems = ref<MathItem[]>([
  // Chapter 1: Groups
  { id: 'def:group', kind: 'def', title: '群', preview: '群是二元组 (G, ·)，满足结合律、有单位元、每个元素有逆', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.1-basic-definitions', tags: ['代数结构', '基础'] },
  { id: 'def:abelian-group', kind: 'def', title: 'Abel 群', preview: '满足交换律的群', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.1-basic-definitions', tags: ['交换性'] },
  { id: 'def:order', kind: 'def', title: '群的阶', preview: '|G| 是群 G 的基数', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.1-basic-definitions', tags: ['有限群'] },
  { id: 'def:subgroup', kind: 'def', title: '子群', preview: 'G 的非空子集，自身关于相同运算构成群', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.2-subgroups', tags: ['子结构'] },
  { id: 'thm:lagrange', kind: 'thm', title: 'Lagrange 定理', preview: 'H ≤ G ⟹ |H| 整除 |G|', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.2-subgroups', tags: ['整除性', '有限群'] },
  { id: 'def:coset', kind: 'def', title: '陪集', preview: '左陪集 aH = {ah : h ∈ H}', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.2-subgroups', tags: ['等价关系'] },
  { id: 'def:normal-subgroup', kind: 'def', title: '正规子群', preview: '满足 gNg⁻¹ = N 对所有 g ∈ G 的子群', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.3-normal-subgroups', tags: ['商群', '核'] },
  { id: 'def:quotient-group', kind: 'def', title: '商群', preview: 'G/N = {gN : g ∈ G}，运算为 (aN)(bN) = (ab)N', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.3-normal-subgroups', tags: ['商结构'] },
  { id: 'thm:hom-iso', kind: 'thm', title: '群同态基本定理', preview: 'G/ker(φ) ≅ im(φ)', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.4-homomorphisms', tags: ['同构', '核'] },
  { id: 'thm:iso-theorems', kind: 'thm', title: '同构定理', preview: '第一、第二、第三同构定理', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.4-homomorphisms', tags: ['同构', '商'] },
  { id: 'def:homomorphism', kind: 'def', title: '群同态', preview: 'f(ab) = f(a)f(b) 的映射', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.4-homomorphisms', tags: ['映射', '核'] },
  { id: 'def:kernel', kind: 'def', title: '核', preview: 'ker(f) = {g ∈ G : f(g) = e}', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.4-homomorphisms', tags: ['正规子群'] },
  { id: 'ex:s3-groups', kind: 'ex', title: 'S₃ 的结构', preview: '3次对称群的子群格与运算', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.1-basic-definitions', tags: ['对称群', '非交换'] },
  { id: 'def:cyclic-group', kind: 'def', title: '循环群', preview: '由单个元素生成的群 ⟨a⟩', chapter: 'groups', chapterNum: 1, page: '/chapters/01-groups/1.2-subgroups', tags: ['生成', '分类'] },

  // Chapter 2: Rings
  { id: 'def:ring', kind: 'def', title: '环', preview: '(R, +, ·)：加法 Abel 群，乘法半群，分配律', chapter: 'rings', chapterNum: 2, page: '/chapters/02-rings/2.1-basic-definitions', tags: ['代数结构', '基础'] },
  { id: 'def:ideal', kind: 'def', title: '理想', preview: 'I ⊴ R：加法子群且 rI ⊆ I', chapter: 'rings', chapterNum: 2, page: '/chapters/02-rings/2.2-ideals', tags: ['商环', '核'] },
  { id: 'def:quotient-ring', kind: 'def', title: '商环', preview: 'R/I，加法乘法由代表元定义', chapter: 'rings', chapterNum: 2, page: '/chapters/02-rings/2.2-ideals', tags: ['商结构'] },
  { id: 'thm:crt', kind: 'thm', title: '中国剩余定理', preview: 'R/(I∩J) ≅ R/I × R/J 当 I + J = R', chapter: 'rings', chapterNum: 2, page: '/chapters/02-rings/2.2-ideals', tags: ['直积', '互素'] },
  { id: 'thm:ring-hom-iso', kind: 'thm', title: '环同态基本定理', preview: 'R/ker(f) ≅ im(f)', chapter: 'rings', chapterNum: 2, page: '/chapters/02-rings/2.2-ideals', tags: ['同态', '核'] },
  { id: 'def:polynomial-ring', kind: 'def', title: '多项式环', preview: 'R[x] = {∑ aᵢxⁱ : aᵢ ∈ R}', chapter: 'rings', chapterNum: 2, page: '/chapters/02-rings/2.3-polynomial-rings', tags: ['多项式', '基础'] },
  { id: 'def:integral-domain', kind: 'def', title: '整环', preview: '无零因子的交换幺环', chapter: 'rings', chapterNum: 2, page: '/chapters/02-rings/2.1-basic-definitions', tags: ['无零因子'] },
  { id: 'def:ufd', kind: 'def', title: '唯一分解整环', preview: '每个非零非单位元素有唯一素分解', chapter: 'rings', chapterNum: 2, page: '/chapters/02-rings/2.3-polynomial-rings', tags: ['分解', '素元'] },
  { id: 'def:pid', kind: 'def', title: '主理想整环', preview: '每个理想都是主理想的整环', chapter: 'rings', chapterNum: 2, page: '/chapters/02-rings/2.2-ideals', tags: ['欧几里得整环'] },
  { id: 'def:euclidean-domain', kind: 'def', title: '欧几里得整环', preview: '有欧几里得函数的整环，可以做带余除法', chapter: 'rings', chapterNum: 2, page: '/chapters/02-rings/2.3-polynomial-rings', tags: ['算法'] },

  // Chapter 3: Fields
  { id: 'def:field', kind: 'def', title: '域', preview: '每个非零元素都有乘法逆的交换幺环', chapter: 'fields', chapterNum: 3, page: '/chapters/03-fields/3.1-basic-definitions', tags: ['代数结构', '基础'] },
  { id: 'def:characteristic', kind: 'def', title: '域的特征', preview: '最小正整数 p 使得 p·1 = 0，或 0', chapter: 'fields', chapterNum: 3, page: '/chapters/03-fields/3.1-basic-definitions', tags: ['素数', 'p·1'] },
  { id: 'def:prime-field', kind: 'def', title: '素域', preview: '不含真子域的域：ℚ 或 F_p', chapter: 'fields', chapterNum: 3, page: '/chapters/03-fields/3.1-basic-definitions', tags: ['最小'] },
  { id: 'def:field-extension', kind: 'def', title: '域扩张', preview: 'K ⊆ L 都是域，L 是 K-代数', chapter: 'fields', chapterNum: 3, page: '/chapters/03-fields/3.2-basic-extensions', tags: ['扩张', '基础'] },
  { id: 'def:field-aut', kind: 'def', title: '域的自同构', preview: 'K → K 的域同构', chapter: 'fields', chapterNum: 3, page: '/chapters/03-fields/3.2-basic-extensions', tags: ['Galois 理论'] },
  { id: 'def:algebraic-element', kind: 'def', title: '代数元', preview: 'α ∈ L 是 K 上的代数元，若存在非零 f ∈ K[x] 使 f(α) = 0', chapter: 'fields', chapterNum: 3, page: '/chapters/03-fields/3.3-algebraic-elements', tags: ['极小多项式'] },
  { id: 'def:minimal-poly', kind: 'def', title: '极小多项式', preview: '使 f(α) = 0 的最低次首一不可约多项式', chapter: 'fields', chapterNum: 3, page: '/chapters/03-fields/3.3-algebraic-elements', tags: ['不可约', '唯一'] },
  { id: 'thm:field-char-p', kind: 'thm', title: '特征为素数', preview: '域的特征要么是 0，要么是素数', chapter: 'fields', chapterNum: 3, page: '/chapters/03-fields/3.1-basic-definitions', tags: ['素数'] },
  { id: 'def:transcendental', kind: 'def', title: '超越元', preview: '不是代数元的元素', chapter: 'fields', chapterNum: 3, page: '/chapters/03-fields/3.3-algebraic-elements', tags: ['超越扩张'] },
  { id: 'thm:minpoly-irred', kind: 'thm', title: '极小多项式不可约', preview: '代数元的极小多项式在 K[x] 中不可约', chapter: 'fields', chapterNum: 3, page: '/chapters/03-fields/3.3-algebraic-elements', tags: ['不可约'] },

  // Chapter 4: Polynomials
  { id: 'thm:div-alg', kind: 'thm', title: '多项式除法定理', preview: 'f = qg + r, deg r < deg g', chapter: 'polynomials', chapterNum: 4, page: '/chapters/04-polynomials/4.1-general-theory', tags: ['带余除法', '基础'] },
  { id: 'thm:ufd-poly', kind: 'thm', title: '多项式唯一分解', preview: 'F[x] 是唯一分解整环', chapter: 'polynomials', chapterNum: 4, page: '/chapters/04-polynomials/4.1-general-theory', tags: ['分解', '因子'] },
  { id: 'thm:eisenstein', kind: 'thm', title: 'Eisenstein 判据', preview: '存在素数 p 满足条件 ⟹ 不可约', chapter: 'polynomials', chapterNum: 4, page: '/chapters/04-polynomials/4.2-irreducibility', tags: ['不可约', '判据'] },
  { id: 'lem:gauss', kind: 'lem', title: 'Gauss 引理', preview: '本原多项式的乘积仍是本原多项式', chapter: 'polynomials', chapterNum: 4, page: '/chapters/04-polynomials/4.2-irreducibility', tags: ['本原', '整系数'] },
  { id: 'thm:remainder-thm', kind: 'thm', title: '余式定理', preview: 'f(a) = 0 ⟺ (x − a) ∣ f(x)', chapter: 'polynomials', chapterNum: 4, page: '/chapters/04-polynomials/4.1-general-theory', tags: ['根', '因子'] },
  { id: 'def:separable', kind: 'def', title: '可分多项式', preview: '在分裂域中无重根的多项式', chapter: 'polynomials', chapterNum: 4, page: '/chapters/04-polynomials/4.3-separability', tags: ['重数', '导数'] },
  { id: 'def:cyclotomic', kind: 'def', title: '分圆多项式', preview: 'Φₙ(x) = ∏_{gcd(k,n)=1} (x − ζₙᵏ)', chapter: 'polynomials', chapterNum: 4, page: '/chapters/04-polynomials/4.2-irreducibility', tags: ['单位根', '不可约'] },
  { id: 'thm:char0-sep', kind: 'thm', title: '特征 0 总可分', preview: '特征 0 的域上不可约多项式都是可分的', chapter: 'polynomials', chapterNum: 4, page: '/chapters/04-polynomials/4.3-separability', tags: ['特征 0'] },
])

const searchQuery = ref('')
const activeKind = ref('')
const activeChapter = ref('')
const currentPage = ref(1)
const pageSize = 12

function toggleKind(kind: string) {
  activeKind.value = activeKind.value === kind ? '' : kind
  currentPage.value = 1
}

const kindCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const k of Object.keys(kindLabels)) {
    counts[k] = allItems.value.filter(i => i.kind === k).length
  }
  return counts
})

const filteredItems = computed(() => {
  let items = allItems.value

  if (activeKind.value) {
    items = items.filter(i => i.kind === activeKind.value)
  }

  if (activeChapter.value) {
    items = items.filter(i => i.chapter === activeChapter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.preview.toLowerCase().includes(q) ||
      i.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  return items
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / pageSize))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredItems.value.slice(start, start + pageSize)
})

// Reset page on filter change
watch([activeKind, activeChapter, searchQuery], () => {
  currentPage.value = 1
})

function navigateTo(item: MathItem) {
  router.go(item.page)
}
</script>

<style>
.theorem-explorer {
  margin: 1.5rem 0;
}

.theorem-explorer__toolbar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
}

.theorem-explorer__search {
  position: relative;
  display: flex;
  align-items: center;
}

.theorem-explorer__search-icon {
  position: absolute;
  left: 0.75rem;
  font-size: 0.9rem;
  pointer-events: none;
}

.theorem-explorer__input {
  width: 100%;
  padding: 0.55rem 2rem 0.55rem 2.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.92rem;
  outline: none;
  transition: border-color 0.2s;
}

.theorem-explorer__input:focus {
  border-color: var(--galois-primary);
}

.theorem-explorer__clear {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
  padding: 0.25rem;
}

.theorem-explorer__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.theorem-explorer__filter {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.theorem-explorer__filter:hover {
  border-color: var(--galois-primary);
  color: var(--galois-primary);
}

.theorem-explorer__filter.active {
  background: var(--galois-primary);
  border-color: var(--galois-primary);
  color: #fff;
}

.theorem-explorer__filter.active .theorem-explorer__filter-dot {
  background: #fff !important;
}

.theorem-explorer__filter-count {
  font-size: 0.7rem;
  opacity: 0.7;
  font-weight: 600;
}

.theorem-explorer__filter-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.theorem-explorer__chapter-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.theorem-explorer__select {
  padding: 0.4rem 0.65rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  cursor: pointer;
  outline: none;
}

.theorem-explorer__select:focus {
  border-color: var(--galois-primary);
}

.theorem-explorer__result-count {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
}

/* Grid */
.theorem-explorer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.85rem;
}

.theorem-explorer__card {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.theorem-explorer__card:hover {
  border-color: var(--galois-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.theorem-explorer__card--def { border-left-color: var(--env-definition-border); }
.theorem-explorer__card--thm { border-left-color: var(--env-theorem-border); }
.theorem-explorer__card--lem { border-left-color: var(--env-lemma-border); }
.theorem-explorer__card--prop { border-left-color: var(--env-proposition-border); }
.theorem-explorer__card--cor { border-left-color: var(--env-corollary-border); }
.theorem-explorer__card--ex { border-left-color: var(--env-example-border); }

.theorem-explorer__card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.theorem-explorer__card-kind {
  display: inline-block;
  padding: 0.05em 0.4em;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.03em;
}

.theorem-explorer__card-chapter {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
}

.theorem-explorer__card-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.3rem;
}

.theorem-explorer__card-preview {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
  margin-bottom: 0.4rem;
}

.theorem-explorer__card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.theorem-explorer__tag {
  padding: 0.05em 0.4em;
  border-radius: 3px;
  background: var(--vp-c-bg-soft);
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
}

/* Pagination */
.theorem-explorer__pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.theorem-explorer__page-btn {
  padding: 0.4rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.15s;
}

.theorem-explorer__page-btn:hover:not(:disabled) {
  border-color: var(--galois-primary);
  color: var(--galois-primary);
}

.theorem-explorer__page-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.theorem-explorer__page-info {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

/* Empty */
.theorem-explorer__empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-3);
}

.theorem-explorer__empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  opacity: 0.5;
}

.theorem-explorer__empty-text {
  font-size: 0.92rem;
}

/* Animation */
.card-list-enter-active { transition: all 0.25s ease; }
.card-list-leave-active { transition: all 0.2s ease; }
.card-list-enter-from { opacity: 0; transform: translateY(8px); }
.card-list-leave-to { opacity: 0; transform: translateY(-8px); }

/* Dark mode */
.dark .theorem-explorer__card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
