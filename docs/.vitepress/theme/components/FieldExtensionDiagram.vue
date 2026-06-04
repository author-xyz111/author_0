<template>
  <div class="field-ext-diagram">
    <div class="field-ext-header">
      <span class="field-ext-icon">⟡</span>
      <span class="field-ext-title">域扩张图</span>
      <div class="field-ext-controls">
        <button 
          v-for="preset in presets" :key="preset.name"
          @click="loadPreset(preset)" 
          :class="{ active: currentPreset === preset.name }"
          class="field-ext-preset-btn"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>
    
    <div class="field-ext-canvas" ref="canvasRef">
      <svg :viewBox="svgViewBox" class="field-ext-svg">
        <!-- Draw edges (field extensions) -->
        <g class="edges">
          <g v-for="edge in layoutEdges" :key="edge.id">
            <line 
              :x1="edge.x1" :y1="edge.y1" 
              :x2="edge.x2" :y2="edge.y2"
              :stroke="edge.highlighted ? 'var(--galois-primary)' : 'var(--galois-border)'"
              :stroke-width="edge.highlighted ? 2.5 : 1.5"
              :stroke-dasharray="edge.dashed ? '6 3' : 'none'"
            />
            <!-- Degree label -->
            <text 
              :x="(edge.x1 + edge.x2) / 2 + edge.labelOffsetX" 
              :y="(edge.y1 + edge.y2) / 2 + edge.labelOffsetY"
              class="edge-label"
              :fill="edge.highlighted ? 'var(--galois-primary)' : 'var(--galois-text-secondary)'"
            >
              {{ edge.label }}
            </text>
          </g>
        </g>
        
        <!-- Draw nodes (fields) -->
        <g class="nodes">
          <g 
            v-for="node in layoutNodes" :key="node.id"
            @click="selectNode(node)"
            @mouseenter="hoverNode = node.id"
            @mouseleave="hoverNode = null"
            class="node-group"
            :class="{ highlighted: node.highlighted, hovered: hoverNode === node.id }"
          >
            <!-- Diamond shape for fields -->
            <polygon 
              :points="diamondPoints(node.x, node.y, node.size || 20)"
              :fill="node.highlighted ? 'var(--galois-bg-highlight)' : 'var(--galois-bg)'"
              :stroke="node.highlighted ? 'var(--galois-primary)' : 'var(--galois-border)'"
              stroke-width="1.5"
              class="node-shape"
            />
            <!-- Field label -->
            <text 
              :x="node.x" :y="node.y + 1"
              text-anchor="middle" dominant-baseline="middle"
              class="node-label"
              :fill="node.highlighted ? 'var(--galois-primary)' : 'var(--galois-text)'"
            >
              {{ node.label }}
            </text>
            <!-- Sublabel (degree info) -->
            <text 
              v-if="node.sublabel"
              :x="node.x" :y="node.y + (node.size || 20) + 14"
              text-anchor="middle" class="node-sublabel"
            >
              {{ node.sublabel }}
            </text>
          </g>
        </g>
        
        <!-- Galois correspondence highlight -->
        <g v-if="showCorrespondence" class="correspondence-overlay">
          <rect 
            v-for="region in correspondenceRegions" :key="region.id"
            :x="region.x" :y="region.y" 
            :width="region.w" :height="region.h"
            :fill="region.color" opacity="0.15" rx="8"
          />
        </g>
      </svg>
    </div>
    
    <!-- Info panel -->
    <div v-if="selectedNode" class="field-ext-info">
      <div class="info-title">{{ selectedNode.label }}</div>
      <div class="info-detail" v-if="selectedNode.info">{{ selectedNode.info }}</div>
      <div class="info-degree" v-if="selectedNode.degree">
        [{{ selectedNode.label }} : {{ selectedNode.over }}] = {{ selectedNode.degree }}
      </div>
      <div class="info-properties" v-if="selectedNode.properties">
        <span v-for="prop in selectedNode.properties" :key="prop" class="info-tag">{{ prop }}</span>
      </div>
    </div>
    
    <div class="field-ext-footer">
      <label class="toggle-label">
        <input type="checkbox" v-model="showCorrespondence" />
        显示 Galois 对应区域
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface FieldNode {
  id: string
  label: string
  x: number
  y: number
  size?: number
  highlighted?: boolean
  sublabel?: string
  info?: string
  degree?: number
  over?: string
  properties?: string[]
}

interface FieldEdge {
  id: string
  from: string
  to: string
  label: string
  highlighted?: boolean
  dashed?: boolean
  labelOffsetX?: number
  labelOffsetY?: number
}

interface DiagramPreset {
  name: string
  nodes: FieldNode[]
  edges: FieldEdge[]
}

const canvasRef = ref<HTMLElement | null>(null)
const hoverNode = ref<string | null>(null)
const selectedNode = ref<FieldNode | null>(null)
const currentPreset = ref('ℚ(√2, √3)')
const showCorrespondence = ref(false)

// Layout constants
const W = 500
const H = 400

const presets: DiagramPreset[] = [
  {
    name: 'ℚ(√2, √3)',
    nodes: [
      { id: 'top', label: 'ℚ(√2,√3)', x: 250, y: 50, size: 24, info: 'ℚ 上添加 √2 和 √3 得到的域', properties: ['Galois扩张', '正规', '可分'] },
      { id: 'l1', label: 'ℚ(√2)', x: 140, y: 160, size: 20, info: 'ℚ 上添加 √2 得到的域', properties: ['正规', '可分'] },
      { id: 'l2', label: 'ℚ(√3)', x: 250, y: 160, size: 20, info: 'ℚ 上添加 √3 得到的域', properties: ['正规', '可分'] },
      { id: 'l3', label: 'ℚ(√6)', x: 360, y: 160, size: 20, info: 'ℚ 上添加 √6 得到的域', properties: ['正规', '可分'] },
      { id: 'bot', label: 'ℚ', x: 250, y: 280, size: 22, info: '有理数域', properties: ['基域'] },
    ],
    edges: [
      { id: 'e1', from: 'top', to: 'l1', label: '2' },
      { id: 'e2', from: 'top', to: 'l2', label: '2' },
      { id: 'e3', from: 'top', to: 'l3', label: '2' },
      { id: 'e4', from: 'l1', to: 'bot', label: '2' },
      { id: 'e5', from: 'l2', to: 'bot', label: '2' },
      { id: 'e6', from: 'l3', to: 'bot', label: '2' },
    ]
  },
  {
    name: 'ℚ(ζ₃)',
    nodes: [
      { id: 'top', label: 'ℚ(ζ₃)', x: 250, y: 60, size: 24, info: '三次单位根域 = ℚ(√-3)，Galois 群 ≅ ℤ/2ℤ', properties: ['Galois扩张', '正规', '可分'] },
      { id: 'bot', label: 'ℚ', x: 250, y: 220, size: 22, info: '有理数域', properties: ['基域'] },
    ],
    edges: [
      { id: 'e1', from: 'top', to: 'bot', label: '2' },
    ]
  },
  {
    name: 'x⁵-2',
    nodes: [
      { id: 'top', label: 'ℚ(⁵√2, ζ₅)', x: 250, y: 50, size: 22, info: '分裂域，Galois 群 ≅ F₂₀', properties: ['Galois扩张', '正规', '可分'] },
      { id: 'r1', label: 'ℚ(⁵√2)', x: 140, y: 170, size: 20, info: '纯五次根扩张，非正规', properties: ['非正规', '可分'] },
      { id: 'r2', label: 'ℚ(ζ₅)', x: 360, y: 170, size: 20, info: '五次分圆域，Galois 群 ≅ (ℤ/5ℤ)× ≅ ℤ/4ℤ', properties: ['Galois扩张', '正规', '可分'] },
      { id: 'bot', label: 'ℚ', x: 250, y: 290, size: 22, info: '有理数域', properties: ['基域'] },
    ],
    edges: [
      { id: 'e1', from: 'top', to: 'r1', label: '4' },
      { id: 'e2', from: 'top', to: 'r2', label: '5' },
      { id: 'e3', from: 'r1', to: 'bot', label: '5' },
      { id: 'e4', from: 'r2', to: 'bot', label: '4' },
    ]
  },
  {
    name: '𝔽₁₆',
    nodes: [
      { id: 'f16', label: '𝔽₁₆', x: 250, y: 60, size: 24, info: '16 元有限域，Frobenius 自同构群 ≅ ℤ/4ℤ', properties: ['Galois扩张', '有限域'] },
      { id: 'f4', label: '𝔽₄', x: 140, y: 170, size: 20, info: '4 元有限域', properties: ['有限域'] },
      { id: 'f8', label: '𝔽₈', x: 360, y: 170, size: 20, info: '8 元有限域（不可约三次多项式）', properties: ['有限域'] },
      { id: 'f2', label: '𝔽₂', x: 250, y: 290, size: 22, info: '二元域', properties: ['素域'] },
    ],
    edges: [
      { id: 'e1', from: 'f16', to: 'f4', label: '2' },
      { id: 'e2', from: 'f16', to: 'f8', label: '', dashed: true },
      { id: 'e3', from: 'f4', to: 'f2', label: '2' },
      { id: 'e4', from: 'f8', to: 'f2', label: '3' },
    ]
  }
]

const activePreset = ref<DiagramPreset>(presets[0])

const layoutNodes = computed(() => {
  return activePreset.value.nodes.map(n => ({
    ...n,
    highlighted: hoverNode.value === n.id || selectedNode.value?.id === n.id
  }))
})

const layoutEdges = computed(() => {
  const nodeMap = new Map(activePreset.value.nodes.map(n => [n.id, n]))
  return activePreset.value.edges.map(e => {
    const from = nodeMap.get(e.from)!
    const to = nodeMap.get(e.to)!
    const dx = to.x - from.x
    const dy = to.y - from.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const offsetX = (dy / len) * 12
    const offsetY = (-dx / len) * 12
    return {
      ...e,
      x1: from.x,
      y1: from.y + (from.size || 20),
      x2: to.x,
      y2: to.y - (to.size || 20),
      labelOffsetX: offsetX,
      labelOffsetY: offsetY,
      highlighted: (hoverNode.value === e.from || hoverNode.value === e.to) ||
                   (selectedNode.value?.id === e.from || selectedNode.value?.id === e.to)
    }
  })
})

const correspondenceRegions = computed(() => {
  if (!showCorrespondence.value) return []
  const nodes = activePreset.value.nodes
  if (nodes.length < 2) return []
  // Create regions for top half (Galois group side) and bottom half (subfield side)
  const topNodes = nodes.filter(n => n.y < 150)
  const botNodes = nodes.filter(n => n.y > 200)
  const regions = []
  if (topNodes.length) {
    const xs = topNodes.map(n => n.x)
    const ys = topNodes.map(n => n.y)
    regions.push({
      id: 'top',
      x: Math.min(...xs) - 40,
      y: Math.min(...ys) - 30,
      w: Math.max(...xs) - Math.min(...xs) + 80,
      h: Math.max(...ys) - Math.min(...ys) + 60,
      color: 'var(--galois-primary)'
    })
  }
  if (botNodes.length) {
    const xs = botNodes.map(n => n.x)
    const ys = botNodes.map(n => n.y)
    regions.push({
      id: 'bot',
      x: Math.min(...xs) - 40,
      y: Math.min(...ys) - 30,
      w: Math.max(...xs) - Math.min(...xs) + 80,
      h: Math.max(...ys) - Math.min(...ys) + 60,
      color: 'var(--galois-secondary)'
    })
  }
  return regions
})

const svgViewBox = computed(() => `0 0 ${W} ${H}`)

function diamondPoints(cx: number, cy: number, r: number): string {
  return `${cx},${cy - r} ${cx + r * 0.7},${cy} ${cx},${cy + r} ${cx - r * 0.7},${cy}`
}

function selectNode(node: FieldNode) {
  if (selectedNode.value?.id === node.id) {
    selectedNode.value = null
  } else {
    selectedNode.value = node
  }
}

function loadPreset(preset: DiagramPreset) {
  activePreset.value = preset
  currentPreset.value = preset.name
  selectedNode.value = null
  showCorrespondence.value = false
}
</script>

<style scoped>
.field-ext-diagram {
  border: 1px solid var(--galois-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--galois-bg);
  margin: 1.5rem 0;
}

.field-ext-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, var(--galois-bg-accent) 0%, var(--galois-bg) 100%);
  border-bottom: 1px solid var(--galois-border);
  flex-wrap: wrap;
}

.field-ext-icon {
  color: var(--galois-primary);
  font-size: 1.2em;
}

.field-ext-title {
  font-weight: 600;
  color: var(--galois-text);
  font-size: 0.95rem;
  margin-right: auto;
}

.field-ext-controls {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.field-ext-preset-btn {
  padding: 3px 10px;
  border: 1px solid var(--galois-border);
  border-radius: 6px;
  background: var(--galois-bg);
  color: var(--galois-text-secondary);
  font-size: 0.78rem;
  cursor: pointer;
  font-family: 'KaTeX_Math', 'Times New Roman', serif;
  transition: all 0.2s;
}

.field-ext-preset-btn:hover {
  border-color: var(--galois-primary);
  color: var(--galois-primary);
}

.field-ext-preset-btn.active {
  background: var(--galois-primary);
  color: #fff;
  border-color: var(--galois-primary);
}

.field-ext-canvas {
  padding: 12px;
  background: var(--galois-bg-accent);
}

.field-ext-svg {
  width: 100%;
  height: auto;
  max-height: 400px;
}

.node-group {
  cursor: pointer;
  transition: transform 0.15s ease;
}

.node-group.hovered .node-shape {
  filter: drop-shadow(0 0 6px var(--galois-primary));
}

.node-label {
  font-family: 'KaTeX_Math', 'Times New Roman', serif;
  font-size: 14px;
  font-weight: 600;
  pointer-events: none;
  user-select: none;
}

.node-sublabel {
  font-size: 11px;
  fill: var(--galois-text-secondary);
  font-family: var(--vp-font-family-base);
  pointer-events: none;
}

.edge-label {
  font-family: 'KaTeX_Math', 'Times New Roman', serif;
  font-size: 13px;
  font-weight: 600;
}

.field-ext-info {
  padding: 12px 16px;
  border-top: 1px solid var(--galois-border);
  background: var(--galois-bg-accent);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.info-title {
  font-weight: 700;
  color: var(--galois-primary);
  font-size: 1rem;
  font-family: 'KaTeX_Math', 'Times New Roman', serif;
  margin-bottom: 4px;
}

.info-detail {
  color: var(--galois-text-secondary);
  font-size: 0.88rem;
  line-height: 1.5;
  margin-bottom: 6px;
}

.info-degree {
  font-weight: 600;
  color: var(--galois-secondary);
  font-family: 'KaTeX_Math', 'Times New Roman', serif;
  font-size: 0.92rem;
  margin-bottom: 6px;
}

.info-properties {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.info-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--galois-tag-bg);
  color: var(--galois-tag-text);
  border: 1px solid var(--galois-tag-border);
}

.field-ext-footer {
  padding: 8px 16px;
  border-top: 1px solid var(--galois-border);
  display: flex;
  gap: 12px;
  align-items: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--galois-text-secondary);
  cursor: pointer;
}

.toggle-label input[type="checkbox"] {
  accent-color: var(--galois-primary);
}
</style>
