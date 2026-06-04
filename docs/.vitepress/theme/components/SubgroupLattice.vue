<template>
  <div class="lattice-diagram">
    <div class="lattice-controls">
      <span class="lattice-legend">
        <span class="lattice-legend__item" v-for="(info, key) in legendItems" :key="key">
          <span class="lattice-legend__dot" :style="{ background: info.color }"></span>
          {{ info.label }}
        </span>
      </span>
    </div>
    <svg :viewBox="viewBox" class="lattice-svg" ref="svgRef">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="none" stroke="currentColor" stroke-width="1" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Edges (drawn first, behind nodes) -->
      <line
        v-for="(edge, i) in edges"
        :key="'e'+i"
        :x1="nodes[edge.from].x" :y1="nodes[edge.from].y + nodeR"
        :x2="nodes[edge.to].x" :y2="nodes[edge.to].y - nodeR"
        class="lattice-edge"
        :class="{ 'lattice-edge--highlight': isEdgeHighlighted(edge) }"
      />

      <!-- Nodes -->
      <g
        v-for="(node, i) in nodes"
        :key="'n'+i"
        :transform="`translate(${node.x}, ${node.y})`"
        class="lattice-node"
        :class="{
          'lattice-node--active': activeNode === i,
          'lattice-node--highlight': isHighlighted(i),
          'lattice-node--dimmed': isDimmed(i)
        }"
        @click="selectNode(i)"
        @mouseenter="hoverNode = i"
        @mouseleave="hoverNode = -1"
      >
        <circle :r="nodeR" class="lattice-node__circle" />
        <text class="lattice-node__label" dy="0.35em" text-anchor="middle">{{ node.label }}</text>
        <text
          v-if="node.order"
          class="lattice-node__order"
          :y="nodeR + 14"
          text-anchor="middle"
        >|{{ node.order }}|</text>
      </g>
    </svg>

    <div v-if="activeNode >= 0" class="lattice-info">
      <div class="lattice-info__title">{{ nodes[activeNode].label }}</div>
      <div class="lattice-info__desc" v-html="nodes[activeNode].desc"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface LatticeNode {
  x: number; y: number; label: string; order?: string;
  desc?: string; type?: string; parents?: number[]; children?: number[]
}

const nodeR = 28
const svgRef = ref<SVGSVGElement | null>(null)
const activeNode = ref(-1)
const hoverNode = ref(-1)

const nodes: LatticeNode[] = [
  // Level 0 (top) - S₃
  { x: 300, y: 40, label: 'S₃', order: '6', type: 'group',
    desc: '3 次对称群，所有 3 元素的置换组成的群。阶为 6 = 3!',
    parents: [], children: [1, 2, 3] },

  // Level 1 - index-2 and index-3 subgroups
  { x: 120, y: 160, label: 'A₃', order: '3', type: 'normal',
    desc: '3 次交错群 = ⟨(123)⟩。<strong>正规子群</strong>，因为 [S₃ : A₃] = 2。商群 S₃/A₃ ≅ ℤ/2ℤ。',
    parents: [0], children: [4] },
  { x: 300, y: 160, label: '⟨(12)⟩', order: '2', type: 'subgroup',
    desc: '由对换 (12) 生成的子群。不是正规子群：(123)(12)(123)⁻¹ = (23) ∉ ⟨(12)⟩。',
    parents: [0], children: [4] },
  { x: 480, y: 160, label: '⟨(13)⟩', order: '2', type: 'subgroup',
    desc: '由对换 (13) 生成的子群。不是正规子群。',
    parents: [0], children: [4] },

  // Level 2 (bottom) - trivial
  { x: 300, y: 280, label: '{e}', order: '1', type: 'trivial',
    desc: '平凡子群。是正规子群。商群 S₃/{e} ≅ S₃。',
    parents: [1, 2, 3], children: [] },
]

const edges = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
  { from: 1, to: 4 }, { from: 2, to: 4 }, { from: 3, to: 4 },
]

const viewBox = '0 0 600 330'

const legendItems = {
  group: { label: '母群', color: '#6366f1' },
  normal: { label: '正规子群', color: '#22c55e' },
  subgroup: { label: '非正规子群', color: '#f59e0b' },
  trivial: { label: '平凡子群', color: '#94a3b8' },
}

function selectNode(i: number) {
  activeNode.value = activeNode.value === i ? -1 : i
}

function isHighlighted(i: number): boolean {
  if (activeNode.value < 0) return false
  const node = nodes[activeNode.value]
  return i === activeNode.value ||
    (node.parents ?? []).includes(i) ||
    (node.children ?? []).includes(i)
}

function isDimmed(i: number): boolean {
  if (activeNode.value < 0) return false
  return !isHighlighted(i)
}

function isEdgeHighlighted(edge: { from: number; to: number }): boolean {
  if (activeNode.value < 0) return false
  return edge.from === activeNode.value || edge.to === activeNode.value
}
</script>

<style scoped>
.lattice-diagram {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-alt, #f8f9fb);
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 10px;
}

.lattice-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.lattice-legend {
  display: flex;
  gap: 1.2rem;
  font-size: 0.85em;
  color: var(--vp-c-text-2);
}

.lattice-legend__item {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
}

.lattice-legend__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.lattice-svg {
  width: 100%;
  max-width: 600px;
  display: block;
  margin: 0 auto;
}

.lattice-edge {
  stroke: #94a3b8;
  stroke-width: 1.5;
  transition: all 0.2s ease;
}

.lattice-edge--highlight {
  stroke: #6366f1;
  stroke-width: 2.5;
}

.lattice-node {
  cursor: pointer;
  transition: all 0.2s ease;
}

.lattice-node__circle {
  fill: var(--vp-c-bg, #fff);
  stroke: #6366f1;
  stroke-width: 2;
  transition: all 0.2s ease;
}

.lattice-node--active .lattice-node__circle {
  fill: #6366f1;
  stroke: #4338ca;
  filter: url(#glow);
}

.lattice-node--highlight .lattice-node__circle {
  stroke-width: 2.5;
}

.lattice-node--dimmed .lattice-node__circle {
  stroke: #cbd5e1;
  opacity: 0.5;
}

.lattice-node--dimmed .lattice-node__label {
  opacity: 0.4;
}

.lattice-node__label {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 13px;
  font-weight: 600;
  fill: var(--vp-c-text-1, #1a1a1a);
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.lattice-node--active .lattice-node__label {
  fill: #fff;
}

.lattice-node__order {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 10px;
  fill: var(--vp-c-text-3, #94a3b8);
  pointer-events: none;
}

/* Type-based circle colors */
.lattice-node:nth-child(1) .lattice-node__circle { stroke: #6366f1; }
.lattice-node:nth-child(2) .lattice-node__circle { stroke: #22c55e; }
.lattice-node:nth-child(3) .lattice-node__circle,
.lattice-node:nth-child(4) .lattice-node__circle { stroke: #f59e0b; }
.lattice-node:nth-child(5) .lattice-node__circle { stroke: #94a3b8; }

.lattice-info {
  margin-top: 1rem;
  padding: 0.8rem 1.2rem;
  background: var(--vp-c-bg-soft, #f3f4f6);
  border-radius: 6px;
  font-size: 0.9em;
}

.lattice-info__title {
  font-weight: 700;
  font-size: 1.05em;
  margin-bottom: 0.3rem;
  color: var(--vp-c-text-1);
}

.lattice-info__desc {
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
</style>
