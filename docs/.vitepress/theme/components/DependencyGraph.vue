<template>
  <div class="dep-graph" ref="containerRef">
    <div class="dep-graph__controls">
      <button @click="zoomIn" title="放大">＋</button>
      <button @click="zoomOut" title="缩小">−</button>
      <button @click="resetView" title="重置视图">⟲</button>
      <button @click="toggleLabels" :class="{ active: showLabels }" title="显示标签">𝐓</button>
    </div>
    <div class="dep-graph__legend">
      <span v-for="(info, key) in nodeTypes" :key="key" class="dep-graph__legend-item">
        <span class="dep-graph__legend-dot" :style="{ background: info.color }"></span>
        {{ info.label }}
      </span>
    </div>
    <svg
      ref="svgRef"
      :viewBox="viewBox"
      class="dep-graph__svg"
      @mousedown="startPan"
      @mousemove="doPan"
      @mouseup="endPan"
      @mouseleave="endPan"
      @wheel.prevent="handleWheel"
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 6" refX="10" refY="3"
          markerWidth="10" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 3 L 0 6 z" fill="#94a3b8" />
        </marker>
        <marker id="arrow-highlight" viewBox="0 0 10 6" refX="10" refY="3"
          markerWidth="10" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 3 L 0 6 z" fill="var(--galois-primary)" />
        </marker>
      </defs>

      <!-- Edges -->
      <g class="dep-graph__edges">
        <line
          v-for="(edge, i) in edges"
          :key="'e' + i"
          :x1="nodeMap[edge.from].x"
          :y1="nodeMap[edge.from].y"
          :x2="nodeMap[edge.to].x"
          :y2="nodeMap[edge.to].y - nodeHeight/2 - 6"
          :class="['dep-graph__edge', { highlighted: isEdgeHighlighted(edge) }]"
          :marker-end="isEdgeHighlighted(edge) ? 'url(#arrow-highlight)' : 'url(#arrow)'"
        />
      </g>

      <!-- Nodes -->
      <g
        v-for="node in nodes"
        :key="node.id"
        class="dep-graph__node"
        :class="{ highlighted: highlightedNode === node.id, dimmed: highlightedNode && highlightedNode !== node.id && !isNeighbor(node.id) }"
        @click="goToChapter(node)"
        @mouseenter="highlightedNode = node.id"
        @mouseleave="highlightedNode = ''"
        :transform="`translate(${node.x}, ${node.y})`"
      >
        <rect
          :x="-nodeWidth/2"
          :y="-nodeHeight/2"
          :width="nodeWidth"
          :height="nodeHeight"
          :rx="8"
          :fill="nodeTypes[node.type]?.bg || '#f0f0f0'"
          :stroke="nodeTypes[node.type]?.color || '#ccc'"
          stroke-width="2"
        />
        <text
          v-if="showLabels"
          text-anchor="middle"
          dominant-baseline="central"
          class="dep-graph__node-label"
        >
          {{ node.label }}
        </text>
        <text
          text-anchor="middle"
          :y="-nodeHeight/2 - 6"
          class="dep-graph__node-id"
          v-if="highlightedNode === node.id"
        >
          第{{ node.chapter }}章
        </text>
      </g>
    </svg>

    <!-- Info panel -->
    <Transition name="panel-slide">
      <div v-if="highlightedNode && nodeMap[highlightedNode]" class="dep-graph__info">
        <div class="dep-graph__info-title">
          第{{ nodeMap[highlightedNode].chapter }}章 · {{ nodeMap[highlightedNode].label }}
        </div>
        <div class="dep-graph__info-desc">{{ nodeMap[highlightedNode].desc }}</div>
        <div class="dep-graph__info-deps" v-if="getDeps(highlightedNode).length">
          <strong>前置依赖:</strong> {{ getDeps(highlightedNode).map(id => nodeMap[id]?.label).join(' → ') }}
        </div>
        <div class="dep-graph__info-deps" v-if="getRequired(highlightedNode).length">
          <strong>后续章节:</strong> {{ getRequired(highlightedNode).map(id => nodeMap[id]?.label).join('、') }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vitepress'

interface GraphNode {
  id: string
  label: string
  chapter: number
  type: string
  desc: string
  x: number
  y: number
}

interface GraphEdge {
  from: string
  to: string
}

const nodes: GraphNode[] = [
  { id: 'ch1', label: '群论基础', chapter: 1, type: 'foundation', desc: '群、子群、正规子群、商群、群同态', x: 400, y: 50 },
  { id: 'ch2', label: '环与理想', chapter: 2, type: 'foundation', desc: '环、理想、商环、环同态、中国剩余定理', x: 200, y: 50 },
  { id: 'ch3', label: '域论基础', chapter: 3, type: 'core', desc: '域、素域、域特征、域的自同构', x: 400, y: 170 },
  { id: 'ch4', label: '多项式', chapter: 4, type: 'core', desc: '多项式环、不可约性、可分性', x: 200, y: 170 },
  { id: 'ch5', label: '域扩张', chapter: 5, type: 'core', desc: '单扩张、代数/超越扩张、扩张次数、塔公式', x: 300, y: 290 },
  { id: 'ch6', label: '代数闭包', chapter: 6, type: 'key', desc: '代数闭包的存在唯一性、代数无关与超越基', x: 300, y: 410 },
  { id: 'ch7', label: 'Galois 群', chapter: 7, type: 'key', desc: 'Galois 群的定义、性质与计算', x: 300, y: 530 },
  { id: 'ch8', label: 'Galois 对应', chapter: 8, type: 'key', desc: 'Galois 理论基本定理：子群 ↔ 中间域的反序一一对应', x: 300, y: 650 },
  { id: 'ch9', label: '可解性与尺规作图', chapter: 9, type: 'application', desc: '多项式可解性判据、尺规作图三大不可能问题', x: 100, y: 770 },
  { id: 'ch10', label: '有限域', chapter: 10, type: 'application', desc: '有限域的构造、唯一性、Frobenius 自同构', x: 300, y: 770 },
  { id: 'ch11', label: '无限 Galois 理论', chapter: 11, type: 'advanced', desc: 'Krull 拓扑、profinite 群、无限 Galois 对应', x: 500, y: 770 },
  { id: 'ch12', label: '代数闭包', chapter: 12, type: 'advanced', desc: '代数闭包、代数无关、超越基、超越次数', x: 500, y: 650 },
]

const edges: GraphEdge[] = [
  // Chapter dependencies
  { from: 'ch1', to: 'ch3' },
  { from: 'ch1', to: 'ch5' },
  { from: 'ch2', to: 'ch4' },
  { from: 'ch2', to: 'ch5' },
  { from: 'ch3', to: 'ch5' },
  { from: 'ch4', to: 'ch5' },
  { from: 'ch4', to: 'ch6' },
  { from: 'ch5', to: 'ch6' },
  { from: 'ch6', to: 'ch7' },
  { from: 'ch7', to: 'ch8' },
  { from: 'ch8', to: 'ch9' },
  { from: 'ch8', to: 'ch10' },
  { from: 'ch8', to: 'ch11' },
  { from: 'ch10', to: 'ch11' },
  { from: 'ch8', to: 'ch12' },
  { from: 'ch3', to: 'ch12' },
]

const nodeTypes: Record<string, { label: string; color: string; bg: string }> = {
  foundation: { label: '基础', color: '#3b82f6', bg: '#eff6ff' },
  core: { label: '核心', color: '#ca8a04', bg: '#fefce8' },
  key: { label: '关键', color: '#9333ea', bg: '#faf5ff' },
  application: { label: '应用', color: '#22c55e', bg: '#f0fdf4' },
  advanced: { label: '进阶', color: '#ef4444', bg: '#fef2f2' },
}

const darkNodeTypes: Record<string, { color: string; bg: string }> = {
  foundation: { color: '#3b82f6', bg: '#0c1929' },
  core: { color: '#ca8a04', bg: '#1a1505' },
  key: { color: '#9333ea', bg: '#150a24' },
  application: { color: '#22c55e', bg: '#052e16' },
  advanced: { color: '#ef4444', bg: '#1c0a0a' },
}

const nodeWidth = 160
const nodeHeight = 44

const nodeMap = computed(() => {
  const m: Record<string, GraphNode> = {}
  nodes.forEach(n => m[n.id] = n)
  return m
})

const highlightedNode = ref('')
const showLabels = ref(true)

// View transformation
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
let isPanning = false
let lastMouse = { x: 0, y: 0 }

const viewBox = computed(() => {
  const w = 600 / zoom.value
  const h = 850 / zoom.value
  const x = -panX.value - w / 2 + 300
  const y = -panY.value - h / 2 + 410
  return `${x} ${y} ${w} ${h}`
})

function zoomIn() { zoom.value = Math.min(zoom.value * 1.2, 3) }
function zoomOut() { zoom.value = Math.max(zoom.value / 1.2, 0.5) }
function resetView() { zoom.value = 1; panX.value = 0; panY.value = 0 }

function toggleLabels() { showLabels.value = !showLabels.value }

function startPan(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.dep-graph__node')) return
  isPanning = true
  lastMouse = { x: e.clientX, y: e.clientY }
}

function doPan(e: MouseEvent) {
  if (!isPanning) return
  const dx = (e.clientX - lastMouse.x) / zoom.value
  const dy = (e.clientY - lastMouse.y) / zoom.value
  panX.value += dx
  panY.value += dy
  lastMouse = { x: e.clientX, y: e.clientY }
}

function endPan() { isPanning = false }

function handleWheel(e: WheelEvent) {
  if (e.deltaY < 0) zoomIn()
  else zoomOut()
}

function isEdgeHighlighted(edge: GraphEdge): boolean {
  if (!highlightedNode.value) return false
  return edge.from === highlightedNode.value || edge.to === highlightedNode.value
}

function isNeighbor(id: string): boolean {
  if (!highlightedNode.value) return false
  return edges.some(e =>
    (e.from === highlightedNode.value && e.to === id) ||
    (e.to === highlightedNode.value && e.from === id)
  )
}

function getDeps(id: string): string[] {
  return edges.filter(e => e.to === id).map(e => e.from)
}

function getRequired(id: string): string[] {
  return edges.filter(e => e.from === id).map(e => e.to)
}

const router = useRouter()
function goToChapter(node: GraphNode) {
  const num = String(node.chapter).padStart(2, '0')
  router.go(`/chapters/${num}-${getSlug(node)}/`)
}

function getSlug(node: GraphNode): string {
  const slugs: Record<string, string> = {
    ch1: 'groups', ch2: 'rings', ch3: 'fields', ch4: 'polynomials',
    ch5: 'splitting-fields', ch6: 'algebraic-closure', ch7: 'galois-groups',
    ch8: 'galois-correspondence', ch9: 'solvability', ch10: 'finite-fields',
    ch11: 'infinite-galois', ch12: 'algebraic-closure'
  }
  return slugs[node.id] || ''
}
</script>

<style>
.dep-graph {
  position: relative;
  width: 100%;
  min-height: 500px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  margin: 2rem 0;
}

.dep-graph__svg {
  width: 100%;
  height: 560px;
  cursor: grab;
}

.dep-graph__svg:active {
  cursor: grabbing;
}

.dep-graph__controls {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.35rem;
  z-index: 10;
}

.dep-graph__controls button {
  width: 32px;
  height: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.dep-graph__controls button:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--galois-primary);
}

.dep-graph__controls button.active {
  background: var(--galois-primary);
  color: #fff;
  border-color: var(--galois-primary);
}

.dep-graph__legend {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  z-index: 10;
}

.dep-graph__legend-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dep-graph__legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dep-graph__edge {
  stroke: #94a3b8;
  stroke-width: 1.5;
  transition: stroke 0.2s, stroke-width 0.2s;
}

.dep-graph__edge.highlighted {
  stroke: var(--galois-primary);
  stroke-width: 2.5;
}

.dark .dep-graph__edge {
  stroke: #475569;
}

.dep-graph__node {
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}

.dep-graph__node:hover {
  filter: brightness(1.05);
}

.dep-graph__node.dimmed {
  opacity: 0.3;
}

.dep-graph__node.highlighted rect {
  stroke-width: 3;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));
}

.dep-graph__node-label {
  font-family: var(--vp-font-family-base);
  font-size: 11px;
  font-weight: 500;
  fill: var(--vp-c-text-1);
  pointer-events: none;
}

.dep-graph__node-id {
  font-family: var(--vp-font-family-base);
  font-size: 9px;
  font-weight: 600;
  fill: var(--galois-primary);
  pointer-events: none;
}

.dep-graph__info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg);
  border-top: 1px solid var(--vp-c-divider);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.06);
}

.dep-graph__info-title {
  font-weight: 700;
  font-size: 1rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.3rem;
}

.dep-graph__info-desc {
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.25rem;
}

.dep-graph__info-deps {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  margin-top: 0.15rem;
}

.panel-slide-enter-active, .panel-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.panel-slide-enter-from, .panel-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
