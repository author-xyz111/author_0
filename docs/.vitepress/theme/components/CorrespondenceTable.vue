<template>
  <div class="correspondence-table">
    <h4 class="correspondence-table__title">Galois 对应：{{ groupName }} / {{ baseFieldName }}</h4>
    <p class="correspondence-table__subtitle">
      反序双射：子群 H ≤ {{ groupName }} ↔ 中间域 {{ baseFieldName }} ⊆ K ⊆ {{ topFieldName }}
    </p>
    <div class="correspondence-table__grid">
      <div class="correspondence-table__header">
        <div class="corr-cell corr-cell--header corr-cell--subgroup">子群 H</div>
        <div class="corr-cell corr-cell--header corr-cell--arrow">↔</div>
        <div class="corr-cell corr-cell--header corr-cell--field">固定域 H<sup>{{ groupName }}</sup></div>
        <div class="corr-cell corr-cell--header corr-cell--index">[H : 1]</div>
        <div class="corr-cell corr-cell--header corr-cell--degree">[K : {{ baseFieldName }}]</div>
      </div>
      <div
        v-for="(entry, i) in rows"
        :key="i"
        class="correspondence-table__row"
        :class="{
          'correspondence-table__row--active': activeRow === i,
          'correspondence-table__row--normal': entry.isNormal,
        }"
        @click="activeRow = activeRow === i ? -1 : i"
      >
        <div class="corr-cell corr-cell--subgroup">
          <span class="corr-cell__badge" v-if="entry.isNormal">正规</span>
          {{ entry.subgroup }}
        </div>
        <div class="corr-cell corr-cell--arrow">↔</div>
        <div class="corr-cell corr-cell--field">{{ entry.fixedField }}</div>
        <div class="corr-cell corr-cell--index">{{ entry.subgroupOrder }}</div>
        <div class="corr-cell corr-cell--degree">{{ entry.fieldDegree }}</div>
      </div>
    </div>
    <div v-if="activeRow >= 0" class="correspondence-table__detail">
      <strong>{{ rows[activeRow].subgroup }}</strong>
      <span v-if="rows[activeRow].isNormal" class="correspondence-table__normal-badge">
        ✓ 正规子群
      </span>
      <span v-else class="correspondence-table__nonnormal-badge">
        ✗ 非正规子群
      </span>
      <div class="correspondence-table__detail-text" v-html="rows[activeRow].detail"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface CorrespondenceEntry {
  subgroup: string
  fixedField: string
  subgroupOrder: string
  fieldDegree: string
  isNormal: boolean
  detail: string
}

defineProps<{
  groupName?: string
  baseFieldName?: string
  topFieldName?: string
}>()

const props = withDefaults(defineProps<{
  groupName?: string
  baseFieldName?: string
  topFieldName?: string
}>(), {
  groupName: 'Gal(L/K)',
  baseFieldName: 'K',
  topFieldName: 'L'
})

const activeRow = ref(-1)

const rows: CorrespondenceEntry[] = [
  {
    subgroup: 'S₃',
    fixedField: 'ℚ',
    subgroupOrder: '6',
    fieldDegree: '1',
    isNormal: true,
    detail: '整个群对应基域。固定域为 ℚ，即 ℚ(∛2, ω) 的所有 Galois 自同构固定 ℚ。'
  },
  {
    subgroup: 'A₃ ≅ ℤ/3ℤ',
    fixedField: 'ℚ(ω)',
    subgroupOrder: '3',
    fieldDegree: '2',
    isNormal: true,
    detail: 'A₃ = ⟨(123)⟩ 是 S₃ 的正规子群（指数为 2）。固定域 ℚ(ω) 其中 ω = e^{2πi/3} 是三次单位根。二次扩张 ℚ(ω)/ℚ 是正规的。'
  },
  {
    subgroup: '⟨(12)⟩ ≅ ℤ/2ℤ',
    fixedField: 'ℚ(∛2)',
    subgroupOrder: '2',
    fieldDegree: '3',
    isNormal: false,
    detail: '⟨(12)⟩ 不是正规子群。(123)(12)(132) = (23) ∉ ⟨(12)⟩。固定域 ℚ(∛2) 是三次扩张但不是正规扩张——另外两个共轭根 ω∛2 和 ω²∛2 不在 ℚ(∛2) 中。'
  },
  {
    subgroup: '⟨(23)⟩ ≅ ℤ/2ℤ',
    fixedField: 'ℚ(ω∛2)',
    subgroupOrder: '2',
    fieldDegree: '3',
    isNormal: false,
    detail: '⟨(23)⟩ 与 ⟨(12)⟩ 共轭。固定域 ℚ(ω∛2)。'
  },
  {
    subgroup: '⟨(13)⟩ ≅ ℤ/2ℤ',
    fixedField: 'ℚ(ω²∛2)',
    subgroupOrder: '2',
    fieldDegree: '3',
    isNormal: false,
    detail: '⟨(13)⟩ 与 ⟨(12)⟩ 共轭。固定域 ℚ(ω²∛2)。'
  },
  {
    subgroup: '{e}',
    fixedField: 'ℚ(∛2, ω)',
    subgroupOrder: '1',
    fieldDegree: '6',
    isNormal: true,
    detail: '平凡子群对应整个分裂域。所有 ℚ(∛2, ω) 的元素都被 {e} 固定。分裂域 ℚ(∛2, ω) 是 x³ - 2 在 ℚ 上的分裂域。'
  }
]
</script>

<style scoped>
.correspondence-table {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-alt, #f8f9fb);
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 10px;
  overflow-x: auto;
}

.correspondence-table__title {
  margin: 0 0 0.3rem;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.correspondence-table__subtitle {
  margin: 0 0 1.2rem;
  font-size: 0.88em;
  color: var(--vp-c-text-2);
}

.correspondence-table__grid {
  font-size: 0.9em;
}

.correspondence-table__header {
  display: grid;
  grid-template-columns: 1.4fr 0.3fr 1.4fr 0.6fr 0.6fr;
  gap: 0;
  font-weight: 700;
  font-size: 0.92em;
  border-bottom: 2px solid var(--galois-accent, #c9a227);
  padding-bottom: 0.6rem;
  margin-bottom: 0.3rem;
}

.correspondence-table__row {
  display: grid;
  grid-template-columns: 1.4fr 0.3fr 1.4fr 0.6fr 0.6fr;
  gap: 0;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.15s ease;
}

.correspondence-table__row:hover {
  background: var(--vp-c-bg-soft, #f3f4f6);
}

.correspondence-table__row--active {
  background: var(--env-theorem-bg, #fefce8);
}

.corr-cell {
  padding: 0.3rem 0.5rem;
  display: flex;
  align-items: center;
}

.corr-cell--header {
  color: var(--vp-c-text-2);
  font-size: 0.88em;
}

.corr-cell--arrow {
  text-align: center;
  justify-content: center;
  color: var(--galois-accent, #c9a227);
  font-weight: 700;
}

.corr-cell__badge {
  display: inline-block;
  padding: 0.1em 0.4em;
  margin-right: 0.4em;
  border-radius: 3px;
  font-size: 0.75em;
  font-weight: 700;
  background: var(--env-corollary-border, #22c55e);
  color: #fff;
}

.correspondence-table__detail {
  margin-top: 1rem;
  padding: 1rem 1.2rem;
  background: var(--vp-c-bg-soft, #f3f4f6);
  border-radius: 6px;
  font-size: 0.92em;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.correspondence-table__normal-badge {
  display: inline-block;
  padding: 0.15em 0.5em;
  margin-left: 0.5em;
  border-radius: 3px;
  font-size: 0.82em;
  font-weight: 600;
  background: var(--env-corollary-bg, #f0fdf4);
  color: var(--env-corollary-text, #14532d);
  border: 1px solid var(--env-corollary-border, #22c55e);
}

.correspondence-table__nonnormal-badge {
  display: inline-block;
  padding: 0.15em 0.5em;
  margin-left: 0.5em;
  border-radius: 3px;
  font-size: 0.82em;
  font-weight: 600;
  background: var(--env-exercise-bg, #fff1f2);
  color: var(--env-exercise-text, #881337);
  border: 1px solid var(--env-exercise-border, #f43f5e);
}

.correspondence-table__detail-text {
  margin-top: 0.5rem;
}
</style>
