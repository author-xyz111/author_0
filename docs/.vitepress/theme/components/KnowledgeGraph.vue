<template>
  <div class="knowledge-graph">
    <div class="knowledge-graph__controls">
      <span class="knowledge-graph__title">知识网络 · 概念依赖图</span>
      <span class="knowledge-graph__hint">点击节点查看信息，拖拽探索</span>
    </div>
    <div class="knowledge-graph__svg-wrap" ref="svgWrap">
      <svg
        ref="svgRef"
        class="knowledge-graph__svg"
        :viewBox="viewBox"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
      >
        <defs>
          <marker id="kg-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" stroke="var(--vp-c-text-3)" stroke-width="1" />
          </marker>
        </defs>

        <!-- Edges -->
        <g class="kg-edges">
          <line
            v-for="(edge, i) in renderedEdges"
            :key="'edge-' + i"
            :x1="edge.x1" :y1="edge.y1"
            :x2="edge.x2" :y2="edge.y2"
            class="kg-edge"
            :class="{ 'kg-edge--active': isEdgeActive(edge) }"
            marker-end="url(#kg-arrow)"
          />
        </g>

        <!-- Nodes -->
        <g
          v-for="(node, i) in renderedNodes"
          :key="'node-' + i"
          class="kg-node"
          :class="{
            'kg-node--active': activeNode === i,
            'kg-node--dimmed': activeNode >= 0 && activeNode !== i && !isNeighbor(i),
            [`kg-node--${node.category}`]: true,
          }"
          :transform="`translate(${node.x}, ${node.y})`"
          @click.stop="activeNode = activeNode === i ? -1 : i"
        >
          <rect
            :x="-node.w/2" :y="-node.h/2"
            :width="node.w" :height="node.h"
            rx="6" ry="6"
            class="kg-node__rect"
          />
          <text class="kg-node__label" dy="0.35em" text-anchor="middle">{{ node.label }}</text>
          <text v-if="node.chapter" class="kg-node__chapter" dy="1.6em" text-anchor="middle">{{ node.chapter }}</text>
        </g>
      </svg>
    </div>

    <div v-if="activeNode >= 0" class="knowledge-graph__info">
      <div class="knowledge-graph__info-title">{{ renderedNodes[activeNode].label }}</div>
      <div class="knowledge-graph__info-desc">{{ renderedNodes[activeNode].desc }}</div>
      <div class="knowledge-graph__info-deps" v-if="renderedNodes[activeNode].deps?.length">
        <strong>前置：</strong>{{ renderedNodes[activeNode].deps?.join(' → ') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

interface GraphNode {
  id: string
  label: string
  category: 'group' | 'ring' | 'field' | 'poly' | 'galois'
  chapter: string
  desc: string
  deps?: string[]
  x: number
  y: number
  w: number
  h: number
}

interface GraphEdge {
  from: string
  to: string
}

const nodes: GraphNode[] = [
  { id: 'group',       label: '群',              category: 'group',   chapter: 'Ch.1', x: 80,  y: 50,  w: 70, h: 36, desc: '代数结构的基础：满足封闭性、结合律、有单位元和逆元的集合。', deps: [] },
  { id: 'subgroup',    label: '子群',            category: 'group',   chapter: '§1.2', x: 200, y: 30,  w: 70, h: 36, desc: '群的子集，自身关于原运算构成群。', deps: ['群'] },
  { id: 'normal',      label: '正规子群',        category: 'group',   chapter: '§1.3', x: 200, y: 100, w: 85, h: 36, desc: 'gNg⁻¹ = N 对所有 g ∈ G 成立的子群。允许构造商群。', deps: ['子群'] },
  { id: 'hom',         label: '群同态',          category: 'group',   chapter: '§1.4', x: 80,  y: 100, w: 70, h: 36, desc: '保持群运算的映射。核 = 正规子群。', deps: ['群', '正规子群'] },
  { id: 'ring',        label: '环',              category: 'ring',    chapter: 'Ch.2', x: 350, y: 50,  w: 55, h: 36, desc: '两种运算（加法和乘法）的代数结构。', deps: ['群'] },
  { id: 'ideal',       label: '理想',            category: 'ring',    chapter: '§2.1', x: 350, y: 120, w: 55, h: 36, desc: '环中允许"除法"的子集。构造商环。', deps: ['环'] },
  { id: 'field',       label: '域',              category: 'field',   chapter: 'Ch.3', x: 500, y: 50,  w: 55, h: 36, desc: '每个非零元素都可逆的交换环。', deps: ['环'] },
  { id: 'poly',        label: '多项式',          category: 'poly',    chapter: 'Ch.4', x: 500, y: 120, w: 70, h: 36, desc: '系数在域中的多项式环 F[x]。', deps: ['环', '域'] },
  { id: 'extension',   label: '域扩张',          category: 'field',   chapter: 'Ch.5', x: 650, y: 50,  w: 70, h: 36, desc: 'K ⊆ L，L 是 K 上的向量空间。[L:K] = 扩张次数。', deps: ['域', '多项式'] },
  { id: 'splitting',   label: '分裂域',          category: 'field',   chapter: 'Ch.6', x: 650, y: 120, w: 70, h: 36, desc: '多项式完全分解为线性因子的最小域。', deps: ['域扩张'] },
  { id: 'normal-ext',  label: '正规扩张',        category: 'field',   chapter: 'Ch.6', x: 770, y: 80,  w: 85, h: 36, desc: '分裂域的推广。不可约多项式若有一根在扩张中则完全分裂。', deps: ['分裂域'] },
  { id: 'galois-group', label: 'Galois 群',     category: 'galois',  chapter: 'Ch.7', x: 650, y: 200, w: 90, h: 36, desc: 'Aut(L/K)：域扩张的所有 K-自同构组成的群。', deps: ['正规扩张'] },
  { id: 'correspondence', label: 'Galois 对应', category: 'galois',  chapter: 'Ch.8', x: 800, y: 200, w: 100, h: 36, desc: '核心定理：子群 ↔ 中间域的反序一一对应。', deps: ['Galois 群'] },
  { id: 'solvability', label: '可解性',          category: 'galois',  chapter: 'Ch.9', x: 800, y: 280, w: 70, h: 36, desc: '多项式根式可解 ⟺ Galois 群可解。', deps: ['Galois 对应'] },
  { id: 'finite-field', label: '有限域',         category: 'field',   chapter: 'Ch.10', x: 500, y: 200, w: 70, h: 36, desc: 'F_{p^n} 的结构与 Frobenius 自同构。', deps: ['分裂域'] },
]

const edges: GraphEdge[] = [
  { from: 'group', to: 'subgroup' },
  { from: 'subgroup', to: 'normal' },
  { from: 'group', to: 'hom' },
  { from: 'normal', to: 'hom' },
  { from: 'group', to: 'ring' },
  { from: 'ring', to: 'ideal' },
  { from: 'ring', to: 'field' },
  { from: 'ring', to: 'poly' },
  { from: 'field', to: 'poly' },
  { from: 'field', to: 'extension' },
  { from: 'poly', to: 'extension' },
  { from: 'extension', to: 'splitting' },
  { from: 'splitting', to: 'normal-ext' },
  { from: 'normal-ext', to: 'galois-group' },
  { from: 'galois-group', to: 'correspondence' },
  { from: 'correspondence', to: 'solvability' },
  { from: 'splitting', to: 'finite-field' },
]

const activeNode = ref(-1)
const viewBox = '0 0 920 340'

const renderedNodes = reactive(nodes)
const renderedEdges = computed(() =>
  edges.map(e => {
    const from = nodes.find(n => n.id === e.from)!
    const to = nodes.find(n => n.id === e.to)!
    return { x1: from.x, y1: from.y, x2: to.x, y2: to.y, from: e.from, to: e.to }
  })
)

function isEdgeActive(edge: { from: string; to: string }) {
  if (activeNode.value < 0) return false
  const activeId = nodes[activeNode.value].id
  return edge.from === activeId || edge.to === activeId
}

function isNeighbor(idx: number) {
  if (activeNode.value < 0) return false
  const activeId = nodes[activeNode.value].id
  const nodeId = nodes[idx].id
  return edges.some(e =>
    (e.from === activeId && e.to === nodeId) ||
    (e.to === activeId && e.from === nodeId)
  )
}

// Drag state
const svgRef = ref<SVGSVGElement | null>(null)
const svgWrap = ref<HTMLDivElement | null>(null)
const dragging = ref(false)
const dragNode = ref(-1)
const dragOffset = reactive({ x: 0, y: 0 })

function onMouseDown(e: MouseEvent) {
  const svg = svgRef.value
  if (!svg) return
  const pt = svg.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY
  const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse())

  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i]
    if (Math.abs(svgPt.x - n.x) < n.w/2 && Math.abs(svgPt.y - n.y) < n.h/2) {
      dragging.value = true
      dragNode.value = i
      dragOffset.x = svgPt.x - n.x
      dragOffset.y = svgPt.y - n.y
      return
    }
  }
}

function onMouseMove(e: MouseEvent) {
  if (!dragging.value || dragNode.value < 0) return
  const svg = svgRef.value
  if (!svg) return
  const pt = svg.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY
  const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse())
  nodes[dragNode.value].x = svgPt.x - dragOffset.x
  nodes[dragNode.value].y = svgPt.y - dragOffset.y
}

function onMouseUp() {
  dragging.value = false
  dragNode.value = -1
}
</script>

<style scoped>
.knowledge-graph {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-alt, #f8f9fb);
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 10px;
}

.knowledge-graph__controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.knowledge-graph__title {
  font-weight: 700;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.knowledge-graph__hint {
  font-size: 0.82em;
  color: var(--vp-c-text-3);
}

.knowledge-graph__svg-wrap {
  overflow-x: auto;
}

.knowledge-graph__svg {
  width: 100%;
  min-width: 700px;
  display: block;
  margin: 0 auto;
  cursor: grab;
  user-select: none;
}

.knowledge-graph__svg:active {
  cursor: grabbing;
}

/* Edges */
.kg-edge {
  stroke: var(--vp-c-divider);
  stroke-width: 1.2;
  transition: all 0.2s ease;
}

.kg-edge--active {
  stroke: var(--galois-accent, #c9a227);
  stroke-width: 2;
}

/* Nodes */
.kg-node {
  cursor: pointer;
  transition: all 0.2s ease;
}

.kg-node__rect {
  fill: var(--vp-c-bg, #fff);
  stroke-width: 2;
  transition: all 0.2s ease;
}

.kg-node--group .kg-node__rect { stroke: #6366f1; }
.kg-node--ring .kg-node__rect { stroke: #8b5cf6; }
.kg-node--field .kg-node__rect { stroke: #06b6d4; }
.kg-node--poly .kg-node__rect { stroke: #f59e0b; }
.kg-node--galois .kg-node__rect { stroke: #c9a227; }

.kg-node--active .kg-node__rect {
  fill: var(--galois-primary, #1e1b4b);
  stroke: var(--galois-accent, #c9a227);
  stroke-width: 2.5;
}

.kg-node--dimmed {
  opacity: 0.3;
}

.kg-node__label {
  font-family: var(--vp-font-family-base, system-ui);
  font-size: 12px;
  font-weight: 600;
  fill: var(--vp-c-text-1);
  pointer-events: none;
  transition: fill 0.2s ease;
}

.kg-node--active .kg-node__label {
  fill: #fff;
}

.kg-node__chapter {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 9px;
  fill: var(--vp-c-text-3);
  pointer-events: none;
}

.kg-node--active .kg-node__chapter {
  fill: rgba(255,255,255,0.6);
}

/* Info panel */
.knowledge-graph__info {
  margin-top: 1rem;
  padding: 0.8rem 1.2rem;
  background: var(--vp-c-bg-soft, #f3f4f6);
  border-radius: 6px;
  font-size: 0.9em;
}

.knowledge-graph__info-title {
  font-weight: 700;
  font-size: 1.05em;
  margin-bottom: 0.3rem;
}

.knowledge-graph__info-desc {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 0.4rem;
}

.knowledge-graph__info-deps {
  color: var(--vp-c-text-3);
  font-size: 0.88em;
}
</style>
