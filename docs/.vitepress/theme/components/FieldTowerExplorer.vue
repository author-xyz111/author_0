<template>
  <div class="field-tower-explorer" :class="{ 'dark': isDark }">
    <div class="fte-header">
      <h3>🏛️ 域扩张探索器</h3>
      <div class="fte-controls">
        <select v-model="selectedExample" class="fte-select">
          <option v-for="(ex, idx) in examples" :key="idx" :value="idx">
            {{ ex.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Tower visualization -->
    <div class="tower-canvas" ref="canvasRef">
      <svg :width="svgWidth" :height="svgHeight" class="tower-svg">
        <!-- Extension degree labels on edges -->
        <template v-for="(edge, ei) in currentEdges" :key="'e'+ei">
          <line
            :x1="edge.x1" :y1="edge.y1"
            :x2="edge.x2" :y2="edge.y2"
            stroke="var(--vp-c-divider)"
            stroke-width="2"
            :stroke-dasharray="edge.dashed ? '6,4' : 'none'"
          />
          <!-- Degree label -->
          <g :transform="`translate(${(edge.x1 + edge.x2)/2 + edge.labelOffset.x}, ${(edge.y1 + edge.y2)/2 + edge.labelOffset.y})`">
            <rect
              :x="-edge.labelWidth/2" :y="-10"
              :width="edge.labelWidth" height="20"
              rx="4"
              fill="var(--vp-c-bg)"
              stroke="var(--vp-c-divider)"
            />
            <text
              text-anchor="middle" dominant-baseline="central"
              fill="var(--vp-c-text-2)"
              font-size="12"
              font-family="'KaTeX_Math', 'Times New Roman', serif"
            >{{ edge.degree }}</text>
          </g>
        </template>

        <!-- Field nodes -->
        <template v-for="(node, ni) in currentNodes" :key="'n'+ni">
          <g
            :transform="`translate(${node.x}, ${node.y})`"
            class="field-node"
            :class="{ active: activeNode === ni, highlighted: highlightedNodes.has(ni) }"
            @click="selectNode(ni)"
            @mouseenter="hoverNode(ni)"
            @mouseleave="hoverNode(-1)"
          >
            <!-- Node background -->
            <rect
              :x="-node.width/2" :y="-20"
              :width="node.width" height="40"
              rx="8"
              :fill="node.isField ? 'var(--vp-c-bg)' : 'var(--vp-c-bg-soft)'"
              :stroke="activeNode === ni ? 'var(--vp-c-brand-1)' : 'var(--vp-c-divider)'"
              :stroke-width="activeNode === ni ? 2.5 : 1.5"
            />
            <!-- Decorative top bar -->
            <rect
              :x="-node.width/2" :y="-20"
              :width="node.width" height="4"
              rx="2"
              :fill="node.isField ? '#6366f1' : '#f59e0b'"
            />
            <!-- Node text -->
            <text
              text-anchor="middle" dominant-baseline="central"
              :fill="node.isField ? 'var(--vp-c-text-1)' : 'var(--vp-c-text-2)'"
              :font-size="node.fontSize || 14"
              font-weight="600"
              font-family="'KaTeX_Math', 'Times New Roman', serif"
            >{{ node.label }}</text>
          </g>
        </template>
      </svg>
    </div>

    <!-- Info panel -->
    <Transition name="fade">
      <div v-if="currentInfo" class="info-panel">
        <div class="info-title">{{ currentInfo.title }}</div>
        <div class="info-body" v-html="currentInfo.body"></div>
        <div class="info-properties">
          <div v-for="(prop, pi) in currentInfo.properties" :key="pi" class="info-prop">
            <span class="prop-label">{{ prop.label }}：</span>
            <span class="prop-value" v-html="prop.value"></span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Galois correspondence table -->
    <div v-if="currentExample.correspondence" class="correspondence-section">
      <h4>Galois 对应</h4>
      <table class="correspondence-table">
        <thead>
          <tr>
            <th>中间域</th>
            <th>子群</th>
            <th>次数 [L:F]</th>
            <th>|H|</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, ri) in currentExample.correspondence" :key="ri"
            :class="{ highlighted: highlightedRows.has(ri) }"
            @mouseenter="highlightRow(ri)"
            @mouseleave="highlightRow(-1)"
          >
            <td v-html="row.field"></td>
            <td v-html="row.group"></td>
            <td>{{ row.degree }}</td>
            <td>{{ row.order }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

interface TowerNode {
  label: string
  x: number
  y: number
  width: number
  fontSize?: number
  isField: boolean
  info?: NodeInfo
}

interface TowerEdge {
  x1: number; y1: number
  x2: number; y2: number
  degree: string
  dashed?: boolean
  labelOffset: { x: number; y: number }
  labelWidth: number
}

interface NodeInfo {
  title: string
  body: string
  properties: { label: string; value: string }[]
}

interface CorrespondenceRow {
  field: string
  group: string
  degree: string
  order: string
}

interface TowerExample {
  name: string
  description: string
  nodes: TowerNode[]
  edges: TowerEdge[]
  correspondence?: CorrespondenceRow[]
}

const examples: TowerExample[] = [
  {
    name: 'ℚ ⊂ ℚ(√2) ⊂ ℚ(√2, √3)',
    description: '经典二次扩张塔',
    nodes: [
      {
        label: 'ℚ', x: 300, y: 220, width: 80, isField: true,
        info: {
          title: '有理数域 ℚ',
          body: '最基本的数域，特征为零的素域。',
          properties: [
            { label: '特征', value: '0' },
            { label: 'Galois 群', value: '平凡群' },
            { label: '代数闭？', value: '否' }
          ]
        }
      },
      {
        label: 'ℚ(√2)', x: 200, y: 140, width: 110, isField: true,
        info: {
          title: 'ℚ(√2)',
          body: 'ℚ 上添加 √2 的单扩张。极小多项式为 x² - 2，是 2 次代数扩张。',
          properties: [
            { label: '[ℚ(√2):ℚ]', value: '2' },
            { label: '极小多项式', value: 'x² - 2' },
            { label: 'Galois', value: '是（正规且可分）' }
          ]
        }
      },
      {
        label: 'ℚ(√3)', x: 400, y: 140, width: 110, isField: true,
        info: {
          title: 'ℚ(√3)',
          body: 'ℚ 上添加 √3 的单扩张。极小多项式为 x² - 3。',
          properties: [
            { label: '[ℚ(√3):ℚ]', value: '2' },
            { label: '极小多项式', value: 'x² - 3' },
            { label: 'Galois', value: '是' }
          ]
        }
      },
      {
        label: 'ℚ(√2,√3)', x: 300, y: 60, width: 140, fontSize: 13, isField: true,
        info: {
          title: 'ℚ(√2, √3)',
          body: 'ℚ 上同时添加 √2 和 √3 的域。这是一个 4 次 Galois 扩张，Galois 群同构于 Klein 四元群 V₄ ≅ ℤ/2ℤ × ℤ/2ℤ。',
          properties: [
            { label: '[ℚ(√2,√3):ℚ]', value: '4' },
            { label: 'Galois 群', value: 'V₄ ≅ ℤ/2ℤ × ℤ/2ℤ' },
            { label: '基底', value: '{1, √2, √3, √6}' }
          ]
        }
      }
    ],
    edges: [
      { x1: 300, y1: 200, x2: 200, y2: 160, degree: '[2]', labelOffset: { x: -30, y: -5 }, labelWidth: 36 },
      { x1: 300, y1: 200, x2: 400, y2: 160, degree: '[2]', labelOffset: { x: 30, y: -5 }, labelWidth: 36 },
      { x1: 200, y1: 120, x2: 300, y2: 80, degree: '[2]', labelOffset: { x: -30, y: -5 }, labelWidth: 36 },
      { x1: 400, y1: 120, x2: 300, y2: 80, degree: '[2]', labelOffset: { x: 30, y: -5 }, labelWidth: 36 }
    ],
    correspondence: [
      { field: 'ℚ(√2, √3)', group: '{e}', degree: '1', order: '1' },
      { field: 'ℚ(√2)', group: '⟨σ₃⟩ ≅ ℤ/2ℤ', degree: '2', order: '2' },
      { field: 'ℚ(√3)', group: '⟨σ₂⟩ ≅ ℤ/2ℤ', degree: '2', order: '2' },
      { field: 'ℚ(√6)', group: '⟨σ₂σ₃⟩ ≅ ℤ/2ℤ', degree: '2', order: '2' },
      { field: 'ℚ', group: 'Gal = V₄', degree: '4', order: '4' }
    ]
  },
  {
    name: 'ℚ ⊂ ℚ(∛2) ⊂ ℚ(∛2, ω)',
    description: '三次扩张与分裂域',
    nodes: [
      {
        label: 'ℚ', x: 300, y: 220, width: 80, isField: true,
        info: {
          title: '有理数域 ℚ',
          body: '起点域。',
          properties: [
            { label: '特征', value: '0' }
          ]
        }
      },
      {
        label: 'ℚ(∛2)', x: 220, y: 140, width: 110, isField: true,
        info: {
          title: 'ℚ(∛2)',
          body: '添加 x³ - 2 的一个实根。这是一个 3 次代数扩张，但<strong>不是</strong> Galois 扩张（因为 x³ - 2 的复根 ω∛2 不在此域中）。',
          properties: [
            { label: '[ℚ(∛2):ℚ]', value: '3' },
            { label: '极小多项式', value: 'x³ - 2' },
            { label: 'Galois？', value: '否（非正规）' }
          ]
        }
      },
      {
        label: 'ℚ(ω)', x: 420, y: 140, width: 100, isField: true,
        info: {
          title: 'ℚ(ω)，ω = e²πⁱ/³',
          body: '添加三次本原单位根。这是一个 2 次 Galois 扩张，极小多项式为 x² + x + 1。',
          properties: [
            { label: '[ℚ(ω):ℚ]', value: '2' },
            { label: '极小多项式', value: 'x² + x + 1' },
            { label: 'Galois？', value: '是' }
          ]
        }
      },
      {
        label: 'ℚ(∛2, ω)', x: 300, y: 60, width: 140, fontSize: 13, isField: true,
        info: {
          title: 'ℚ(∛2, ω)：x³ - 2 的分裂域',
          body: '同时包含三个根 ∛2, ω∛2, ω²∛2 的域。这是 x³ - 2 在 ℚ 上的分裂域，也是 ℚ(∛2) 的正规闭包。',
          properties: [
            { label: '[ℚ(∛2,ω):ℚ]', value: '6' },
            { label: 'Gal 群', value: 'S₃' },
            { label: '非交换？', value: '是' }
          ]
        }
      }
    ],
    edges: [
      { x1: 300, y1: 200, x2: 220, y2: 160, degree: '[3]', labelOffset: { x: -25, y: -8 }, labelWidth: 36 },
      { x1: 300, y1: 200, x2: 420, y2: 160, degree: '[2]', labelOffset: { x: 25, y: -8 }, labelWidth: 36 },
      { x1: 220, y1: 120, x2: 300, y2: 80, degree: '[2]', labelOffset: { x: -30, y: -5 }, labelWidth: 36 },
      { x1: 420, y1: 120, x2: 300, y2: 80, degree: '[3]', labelOffset: { x: 30, y: -5 }, labelWidth: 36 }
    ],
    correspondence: [
      { field: 'ℚ(∛2, ω)', group: '{e}', degree: '1', order: '1' },
      { field: 'ℚ(∛2)', group: '⟨(2 3)⟩ ≅ ℤ/2ℤ', degree: '2', order: '2' },
      { field: 'ℚ(ω∛2)', group: '⟨(1 3)⟩ ≅ ℤ/2ℤ', degree: '2', order: '2' },
      { field: 'ℚ(ω²∛2)', group: '⟨(1 2)⟩ ≅ ℤ/2ℤ', degree: '2', order: '2' },
      { field: 'ℚ(ω)', group: 'A₃ ≅ ℤ/3ℤ', degree: '3', order: '3' },
      { field: 'ℚ', group: 'Gal = S₃', degree: '6', order: '6' }
    ]
  },
  {
    name: '𝔽₂ ⊂ 𝔽₄ ⊂ 𝔽₁₆',
    description: '有限域扩张塔',
    nodes: [
      {
        label: '𝔽₂', x: 300, y: 220, width: 70, isField: true,
        info: {
          title: '二元域 𝔽₂',
          body: '最小的有限域，特征为 2。',
          properties: [
            { label: '特征', value: '2' },
            { label: '元素数', value: '2' }
          ]
        }
      },
      {
        label: '𝔽₄', x: 300, y: 140, width: 70, isField: true,
        info: {
          title: '𝔽₄ = 𝔽₂[x]/(x² + x + 1)',
          body: '4 元域。由 𝔽₂ 上添加 x² + x + 1 的根 α 得到，𝔽₄ = {0, 1, α, α+1}。',
          properties: [
            { label: '[𝔽₄:𝔽₂]', value: '2' },
            { label: '极小多项式', value: 'x² + x + 1' },
            { label: 'Frobenius', value: 'x ↦ x²' }
          ]
        }
      },
      {
        label: '𝔽₁₆', x: 300, y: 60, width: 80, isField: true,
        info: {
          title: '𝔽₁₆ = 𝔽₂[x]/(x⁴ + x + 1)',
          body: '16 元域。Gal(𝔽₁₆/𝔽₂) ≅ ℤ/4ℤ，由 Frobenius 自同构生成。',
          properties: [
            { label: '[𝔽₁₆:𝔽₂]', value: '4' },
            { label: '[𝔽₁₆:𝔽₄]', value: '2' },
            { label: 'Galois 群', value: 'ℤ/4ℤ' },
            { label: 'Frobenius', value: 'x ↦ x²' }
          ]
        }
      }
    ],
    edges: [
      { x1: 300, y1: 200, x2: 300, y2: 160, degree: '[2]', labelOffset: { x: 25, y: 0 }, labelWidth: 36 },
      { x1: 300, y1: 120, x2: 300, y2: 80, degree: '[2]', labelOffset: { x: 25, y: 0 }, labelWidth: 36 }
    ]
  },
  {
    name: 'ℚ ⊂ ℚ(ζ₅)',
    description: '五次分圆扩张',
    nodes: [
      {
        label: 'ℚ', x: 300, y: 200, width: 80, isField: true,
        info: {
          title: '有理数域 ℚ',
          body: '特征 0 的素域。',
          properties: []
        }
      },
      {
        label: 'ℚ(ζ₅)', x: 300, y: 100, width: 110, isField: true,
        info: {
          title: 'ℚ(ζ₅)：五次分圆域',
          body: 'ζ₅ = e²πⁱ/⁵ 是 5 次本原单位根。极小多项式为 Φ₅(x) = x⁴ + x³ + x² + x + 1（第 5 个分圆多项式）。这是一个 4 次 Abel 扩张。',
          properties: [
            { label: '[ℚ(ζ₅):ℚ]', value: '4 = φ(5)' },
            { label: '极小多项式', value: 'Φ₅(x) = x⁴ + x³ + x² + x + 1' },
            { label: 'Galois 群', value: '(ℤ/5ℤ)* ≅ ℤ/4ℤ' },
            { label: '生成元', value: 'σ: ζ₅ ↦ ζ₅²' }
          ]
        }
      }
    ],
    edges: [
      { x1: 300, y1: 180, x2: 300, y2: 120, degree: '[4]', labelOffset: { x: 25, y: 0 }, labelWidth: 36 }
    ],
    correspondence: [
      { field: 'ℚ(ζ₅)', group: '{e}', degree: '1', order: '1' },
      { field: 'ℚ(√5)', group: '⟨σ²⟩ ≅ ℤ/2ℤ', degree: '2', order: '2' },
      { field: 'ℚ', group: 'Gal = ℤ/4ℤ', degree: '4', order: '4' }
    ]
  }
]

const selectedExample = ref(0)
const activeNode = ref(-1)
const highlightedNodes = ref(new Set<number>())
const highlightedRows = ref(new Set<number>())
const canvasRef = ref<HTMLElement | null>(null)

const svgWidth = 600
const svgHeight = 280

const currentExample = computed(() => examples[selectedExample.value])
const currentNodes = computed(() => currentExample.value.nodes)
const currentEdges = computed(() => currentExample.value.edges)
const currentInfo = computed(() => activeNode.value >= 0 ? currentNodes.value[activeNode.value]?.info : null)

function selectNode(idx: number) {
  activeNode.value = activeNode.value === idx ? -1 : idx
}

function hoverNode(idx: number) {
  // Highlight connected nodes
  highlightedNodes.value = new Set()
  if (idx >= 0) {
    highlightedNodes.value.add(idx)
    // Find connected edges
    const node = currentNodes.value[idx]
    for (const edge of currentEdges.value) {
      if (Math.abs(edge.x1 - node.x) < 10 && Math.abs(edge.y1 - node.y) < 40) {
        const targetIdx = currentNodes.value.findIndex(n => Math.abs(n.x - edge.x2) < 10 && Math.abs(n.y - edge.y2) < 40)
        if (targetIdx >= 0) highlightedNodes.value.add(targetIdx)
      }
      if (Math.abs(edge.x2 - node.x) < 10 && Math.abs(edge.y2 - node.y) < 40) {
        const sourceIdx = currentNodes.value.findIndex(n => Math.abs(n.x - edge.x1) < 10 && Math.abs(n.y - edge.y1) < 40)
        if (sourceIdx >= 0) highlightedNodes.value.add(sourceIdx)
      }
    }
  }
}

function highlightRow(idx: number) {
  highlightedRows.value = idx >= 0 ? new Set([idx]) : new Set()
}
</script>

<style scoped>
.field-tower-explorer {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.fte-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.fte-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--vp-c-text-1);
}

.fte-select {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  cursor: pointer;
}

.tower-canvas {
  overflow-x: auto;
  margin: 1rem 0;
}

.tower-svg {
  display: block;
  margin: 0 auto;
}

.field-node {
  cursor: pointer;
  transition: transform 0.2s;
}

.field-node:hover {
  transform: scale(1.05);
}

.field-node.active rect:first-child {
  stroke-width: 2.5;
}

.info-panel {
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-top: 1rem;
}

.info-title {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.info-body {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.info-properties {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.info-prop {
  font-size: 0.85rem;
}

.prop-label {
  font-weight: 600;
  color: var(--vp-c-text-3);
}

.prop-value {
  color: var(--vp-c-text-1);
  font-family: 'KaTeX_Math', 'Times New Roman', serif;
}

.correspondence-section {
  margin-top: 1.5rem;
}

.correspondence-section h4 {
  font-size: 1rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
}

.correspondence-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.correspondence-table th {
  background: var(--vp-c-bg);
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: var(--vp-c-text-2);
  border-bottom: 2px solid var(--vp-c-divider);
}

.correspondence-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.correspondence-table tr.highlighted {
  background: var(--vp-c-brand-soft);
}

.correspondence-table tr:hover {
  background: var(--vp-c-default-soft);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 640px) {
  .field-tower-explorer { padding: 1rem; }
  .correspondence-table { font-size: 0.78rem; }
}
</style>
