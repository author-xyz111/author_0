<template>
  <div class="gci">
    <div class="gci__header">
      <span class="gci__title">Galois 对应交互</span>
      <div class="gci__controls">
        <button :class="['gci__tab', { 'gci__tab--active': mode === 's3' }]" @click="mode = 's3'">S₃</button>
        <button :class="['gci__tab', { 'gci__tab--active': mode === 'z8' }]" @click="mode = 'z8'">ℤ/8ℤ</button>
        <button :class="['gci__tab', { 'gci__tab--active': mode === 'custom' }]" @click="mode = 'custom'">自定义</button>
      </div>
    </div>

    <div class="gci__body">
      <div class="gci__panels">
        <!-- Subgroup lattice (left) -->
        <div class="gci__panel">
          <div class="gci__panel-title">子群格</div>
          <svg :viewBox="svgViewBox" class="gci__svg" ref="svgRef">
            <!-- Edges -->
            <line v-for="(edge, i) in currentData.subgroupEdges" :key="'se-'+i"
              :x1="getNodePos(edge[0]).x" :y1="getNodePos(edge[0]).y"
              :x2="getNodePos(edge[1]).x" :y2="getNodePos(edge[1]).y"
              :class="['gci__edge', edgeClass(edge)]"
              stroke-width="2" />
            <!-- Nodes -->
            <g v-for="node in currentData.subgroups" :key="node.id"
              :transform="`translate(${node.pos[0]}, ${node.pos[1]})`"
              :class="['gci__node', nodeClass('subgroup', node.id)]"
              @click="selectNode('subgroup', node.id)"
              @mouseenter="hoverNode('subgroup', node.id)"
              @mouseleave="unhover">
              <rect :x="-nodeW/2" :y="-nodeH/2" :width="nodeW" :height="nodeH"
                rx="6" ry="6" />
              <text x="0" y="0" text-anchor="middle" dominant-baseline="middle">
                {{ node.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Arrows -->
        <div class="gci__arrows">
          <div class="gci__arrow">⟶</div>
          <div class="gci__arrow-label">固定域</div>
          <div class="gci__arrow gci__arrow--reverse">⟵</div>
          <div class="gci__arrow-label">Galois 群</div>
        </div>

        <!-- Fixed fields (right) -->
        <div class="gci__panel">
          <div class="gci__panel-title">中间域</div>
          <svg :viewBox="svgViewBox" class="gci__svg">
            <line v-for="(edge, i) in currentData.fieldEdges" :key="'fe-'+i"
              :x1="getNodePos(edge[0]).x" :y1="getNodePos(edge[0]).y"
              :x2="getNodePos(edge[1]).x" :y2="getNodePos(edge[1]).y"
              :class="['gci__edge', edgeClass(edge)]"
              stroke-width="2" />
            <g v-for="node in currentData.fields" :key="node.id"
              :transform="`translate(${node.pos[0]}, ${node.pos[1]})`"
              :class="['gci__node', nodeClass('field', node.id)]"
              @click="selectNode('field', node.id)"
              @mouseenter="hoverNode('field', node.id)"
              @mouseleave="unhover">
              <rect :x="-nodeW/2" :y="-nodeH/2" :width="nodeW" :height="nodeH"
                rx="6" ry="6" />
              <text x="0" y="0" text-anchor="middle" dominant-baseline="middle">
                {{ node.label }}
              </text>
            </g>
          </svg>
        </div>
      </div>

      <!-- Info panel -->
      <Transition name="gci-info-fade">
        <div v-if="selectedInfo" class="gci__info">
          <div class="gci__info-kind">{{ selectedInfo.kind }}</div>
          <div class="gci__info-name" v-html="selectedInfo.name"></div>
          <div v-if="selectedInfo.corresponding" class="gci__info-corr">
            <span class="gci__info-corr-label">对应：</span>
            <span v-html="selectedInfo.corresponding"></span>
          </div>
          <div v-if="selectedInfo.degree" class="gci__info-degree">
            <span class="gali-degree-badge">[{{ selectedInfo.degree }}]</span>
            {{ selectedInfo.degreeDesc }}
          </div>
          <div v-if="selectedInfo.properties" class="gci__info-props">
            <span v-for="(prop, i) in selectedInfo.properties" :key="i" class="gci__info-prop">
              {{ prop }}
            </span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface LatticeNode {
  id: string
  label: string
  pos: [number, number]
  corrId?: string  // corresponding node on the other side
  degree?: string
  degreeDesc?: string
  properties?: string[]
}

interface CorrespondenceData {
  subgroups: LatticeNode[]
  subgroupEdges: [string, string][]
  fields: LatticeNode[]
  fieldEdges: [string, string][]
}

const mode = ref<'s3' | 'z8' | 'custom'>('s3')
const selectedId = ref<string | null>(null)
const selectedSide = ref<'subgroup' | 'field' | null>(null)
const hoveredId = ref<string | null>(null)
const hoveredSide = ref<'subgroup' | 'field' | null>(null)

const nodeW = 90
const nodeH = 32
const svgViewBox = '0 0 200 280'

const s3Data: CorrespondenceData = {
  subgroups: [
    { id: 's3-s', label: 'S₃', pos: [100, 20] },
    { id: 's3-a3', label: 'A₃', pos: [100, 90], corrId: 's3-f-q', degree: '2', degreeDesc: '|S₃/A₃| = 2' },
    { id: 's3-h1', label: '⟨(12)⟩', pos: [40, 160], corrId: 's3-f-k1', degree: '3', degreeDesc: '|S₃/⟨(12)⟩| = 3' },
    { id: 's3-h2', label: '⟨(13)⟩', pos: [100, 160], corrId: 's3-f-k2', degree: '3', degreeDesc: '|S₃/⟨(13)⟩| = 3' },
    { id: 's3-h3', label: '⟨(23)⟩', pos: [160, 160], corrId: 's3-f-k3', degree: '3', degreeDesc: '|S₃/⟨(23)⟩| = 3' },
    { id: 's3-e', label: '{e}', pos: [100, 230], corrId: 's3-f-l', degree: '6', degreeDesc: '|S₃/{e}| = 6', properties: ['正规'] },
  ],
  subgroupEdges: [
    ['s3-s', 's3-a3'], ['s3-s', 's3-h1'], ['s3-s', 's3-h2'], ['s3-s', 's3-h3'],
    ['s3-a3', 's3-e'], ['s3-h1', 's3-e'], ['s3-h2', 's3-e'], ['s3-h3', 's3-e'],
  ],
  fields: [
    { id: 's3-f-q', label: 'ℚ', pos: [100, 230] },
    { id: 's3-f-k1', label: 'ℚ(α₁)', pos: [40, 160], corrId: 's3-h1' },
    { id: 's3-f-k2', label: 'ℚ(α₂)', pos: [100, 160], corrId: 's3-h2' },
    { id: 's3-f-k3', label: 'ℚ(α₃)', pos: [160, 160], corrId: 's3-h3' },
    { id: 's3-f-qd', label: 'ℚ(√Δ)', pos: [100, 90], corrId: 's3-a3', properties: ['二次扩张'] },
    { id: 's3-f-l', label: 'L = ℚ(α₁,α₂,α₃)', pos: [100, 20], corrId: 's3-s', properties: ['分裂域', 'Galois'] },
  ],
  fieldEdges: [
    ['s3-f-l', 's3-f-qd'], ['s3-f-l', 's3-f-k1'], ['s3-f-l', 's3-f-k2'], ['s3-f-l', 's3-f-k3'],
    ['s3-f-qd', 's3-f-q'], ['s3-f-k1', 's3-f-q'], ['s3-f-k2', 's3-f-q'], ['s3-f-k3', 's3-f-q'],
  ],
}

const z8Data: CorrespondenceData = {
  subgroups: [
    { id: 'z8-g', label: 'ℤ/8ℤ', pos: [100, 20] },
    { id: 'z8-h4', label: '⟨4⟩ ≅ ℤ/2', pos: [100, 90], corrId: 'z8-f-4', degree: '4' },
    { id: 'z8-h2', label: '⟨2⟩ ≅ ℤ/4', pos: [100, 160], corrId: 'z8-f-2', degree: '2' },
    { id: 'z8-h0', label: '{0}', pos: [100, 230], corrId: 'z8-f-1', degree: '8' },
  ],
  subgroupEdges: [
    ['z8-g', 'z8-h4'], ['z8-h4', 'z8-h2'], ['z8-h2', 'z8-h0'],
  ],
  fields: [
    { id: 'z8-f-4', label: 'F_{q⁴}', pos: [100, 90], corrId: 'z8-h4' },
    { id: 'z8-f-2', label: 'F_{q²}', pos: [100, 160], corrId: 'z8-h2' },
    { id: 'z8-f-1', label: 'F_q', pos: [100, 230], corrId: 'z8-h0' },
    { id: 'z8-f-8', label: 'F_{q⁸}', pos: [100, 20], corrId: 'z8-g' },
  ],
  fieldEdges: [
    ['z8-f-8', 'z8-f-4'], ['z8-f-4', 'z8-f-2'], ['z8-f-2', 'z8-f-1'],
  ],
}

const customData: CorrespondenceData = {
  subgroups: [
    { id: 'c-g', label: 'G', pos: [100, 20] },
    { id: 'c-n', label: 'N ◁ G', pos: [100, 100], corrId: 'c-f-k', properties: ['正规'] },
    { id: 'c-e', label: '{e}', pos: [100, 200], corrId: 'c-f-l' },
  ],
  subgroupEdges: [['c-g', 'c-n'], ['c-n', 'c-e']],
  fields: [
    { id: 'c-f-k', label: 'K = Lᴳ', pos: [100, 100] },
    { id: 'c-f-l', label: 'L', pos: [100, 20] },
    { id: 'c-f-f', label: 'F = Lᴺ', pos: [100, 200] },
  ],
  fieldEdges: [['c-f-l', 'c-f-k'], ['c-f-k', 'c-f-f']],
}

const dataMap = computed(() => ({
  s3: s3Data,
  z8: z8Data,
  custom: customData,
}))

const currentData = computed(() => dataMap.value[mode.value])

function getNodePos(nodeId: string): { x: number; y: number } {
  const all = [...currentData.value.subgroups, ...currentData.value.fields]
  const n = all.find(n => n.id === nodeId)
  return n ? { x: n.pos[0], y: n.pos[1] } : { x: 0, y: 0 }
}

function nodeClass(side: 'subgroup' | 'field', id: string) {
  const node = (side === 'subgroup' ? currentData.value.subgroups : currentData.value.fields).find(n => n.id === id)
  const corrId = node?.corrId
  return {
    'gci__node--selected': selectedId.value === id && selectedSide.value === side,
    'gci__node--highlighted': hoveredId.value === id && hoveredSide.value === side,
    'gci__node--corresponding': (hoveredId.value && corrId === hoveredId.value) || (selectedId.value && corrId === selectedId.value),
  }
}

function edgeClass(edge: [string, string]) {
  const isHighlighted = (id: string) => {
    const all = [...currentData.value.subgroups, ...currentData.value.fields]
    const node = all.find(n => n.id === id)
    return id === hoveredId.value || id === selectedId.value || node?.corrId === hoveredId.value || node?.corrId === selectedId.value
  }
  return {
    'gci__edge--highlighted': isHighlighted(edge[0]) || isHighlighted(edge[1]),
  }
}

function selectNode(side: 'subgroup' | 'field', id: string) {
  if (selectedId.value === id && selectedSide.value === side) {
    selectedId.value = null
    selectedSide.value = null
  } else {
    selectedId.value = id
    selectedSide.value = side
  }
}

function hoverNode(side: 'subgroup' | 'field', id: string) {
  hoveredId.value = id
  hoveredSide.value = side
}

function unhover() {
  hoveredId.value = null
  hoveredSide.value = null
}

interface InfoData {
  kind: string
  name: string
  corresponding?: string
  degree?: string
  degreeDesc?: string
  properties?: string[]
}

const selectedInfo = computed<InfoData | null>(() => {
  const id = hoveredId.value || selectedId.value
  const side = hoveredSide.value || selectedSide.value
  if (!id || !side) return null

  const nodes = side === 'subgroup' ? currentData.value.subgroups : currentData.value.fields
  const node = nodes.find(n => n.id === id)
  if (!node) return null

  const corrNode = node.corrId
    ? (side === 'subgroup' ? currentData.value.fields : currentData.value.subgroups).find(n => n.id === node.corrId)
    : undefined

  return {
    kind: side === 'subgroup' ? '子群' : '中间域',
    name: node.label,
    corresponding: corrNode?.label,
    degree: node.degree,
    degreeDesc: node.degreeDesc,
    properties: node.properties,
  }
})
</script>

<style scoped>
.gci {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  margin: 20px 0;
  background: var(--vp-c-bg);
}

.gci__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.gci__title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--galois-primary);
}

.gci__controls {
  display: flex;
  gap: 4px;
}

.gci__tab {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.15s;
  font-family: 'Computer Modern Serif', 'Latin Modern Roman', 'STIX Two Text', serif;
}

.gci__tab:hover {
  border-color: var(--galois-primary);
  color: var(--galois-primary);
}

.gci__tab--active {
  background: var(--galois-primary);
  color: #fff;
  border-color: var(--galois-primary);
}

.gci__body {
  padding: 16px;
}

.gci__panels {
  display: flex;
  align-items: stretch;
  gap: 8px;
}

.gci__panel {
  flex: 1;
  min-width: 0;
}

.gci__panel-title {
  text-align: center;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.gci__svg {
  width: 100%;
  height: auto;
}

/* Edges */
.gci__edge {
  stroke: var(--vp-c-divider);
  transition: stroke 0.2s, stroke-width 0.2s;
}

.gci__edge--highlighted {
  stroke: var(--galois-primary);
  stroke-width: 3;
}

/* Nodes */
.gci__node rect {
  fill: var(--vp-c-bg-soft);
  stroke: var(--vp-c-divider);
  stroke-width: 1.5;
  transition: all 0.2s;
  cursor: pointer;
}

.gci__node text {
  fill: var(--vp-c-text-1);
  font-size: 11px;
  font-family: 'Computer Modern Serif', 'Latin Modern Roman', 'STIX Two Text', serif;
  pointer-events: none;
}

.gci__node:hover rect {
  stroke: var(--galois-primary);
  stroke-width: 2;
}

.gci__node--selected rect {
  fill: var(--galois-primary);
  stroke: var(--galois-primary);
}

.gci__node--selected text {
  fill: #fff;
}

.gci__node--highlighted rect {
  stroke: var(--galois-accent);
  stroke-width: 2.5;
}

.gci__node--corresponding rect {
  fill: var(--galois-accent);
  stroke: var(--galois-accent);
  opacity: 0.8;
}

.gci__node--corresponding text {
  fill: #fff;
}

/* Arrows */
.gci__arrows {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 8px;
  flex-shrink: 0;
}

.gci__arrow {
  font-size: 1.5rem;
  color: var(--galois-primary);
  font-weight: 300;
}

.gci__arrow--reverse {
  transform: scaleX(-1);
  color: var(--galois-accent);
}

.gci__arrow-label {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

/* Info panel */
.gci__info {
  margin-top: 12px;
  padding: 10px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.gci__info-kind {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
  margin-bottom: 2px;
}

.gci__info-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  font-family: 'Computer Modern Serif', 'Latin Modern Roman', 'STIX Two Text', serif;
}

.gci__info-corr {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-top: 4px;
}

.gci__info-corr-label {
  font-weight: 600;
  color: var(--galois-primary);
}

.gci__info-degree {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  margin-top: 4px;
}

.gali-degree-badge {
  display: inline-block;
  background: var(--galois-primary);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  margin-right: 4px;
}

.gci__info-props {
  display: flex;
  gap: 6px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.gci__info-prop {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(34, 197, 94, 0.1);
  color: var(--env-corollary-text);
  font-weight: 500;
}

/* Info transition */
.gci-info-fade-enter-active,
.gci-info-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.gci-info-fade-enter-from,
.gci-info-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Mobile */
@media (max-width: 640px) {
  .gci__panels {
    flex-direction: column;
  }
  .gci__arrows {
    flex-direction: row;
    padding: 8px 0;
  }
  .gci__arrow {
    transform: rotate(90deg);
  }
  .gci__arrow--reverse {
    transform: rotate(-90deg);
  }
}
</style>
