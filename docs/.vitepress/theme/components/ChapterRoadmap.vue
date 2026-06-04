<template>
  <div class="chapter-roadmap" :class="{ 'dark': isDark }">
    <div class="roadmap-header">
      <h3>🗺️ 学习路线图</h3>
      <div class="roadmap-controls">
        <button @click="toggleProgress" :class="{ active: showProgress }">
          {{ showProgress ? '隐藏进度' : '显示进度' }}
        </button>
        <button @click="resetProgress" class="reset-btn">重置</button>
      </div>
    </div>
    
    <div class="roadmap-stages">
      <div v-for="(stage, si) in stages" :key="si" class="roadmap-stage">
        <div class="stage-label">{{ stage.label }}</div>
        <div class="stage-chapters">
          <div
            v-for="ch in stage.chapters"
            :key="ch.id"
            class="chapter-node"
            :class="[
              `type-${ch.type}`,
              { completed: completedSet.has(ch.id), active: ch.id === activeChapter }
            ]"
            @click="navigateTo(ch)"
            @mouseenter="hovered = ch.id"
            @mouseleave="hovered = ''"
          >
            <div class="node-marker">
              <span v-if="completedSet.has(ch.id)" class="check">✓</span>
              <span v-else class="number">{{ ch.number }}</span>
            </div>
            <div class="node-content">
              <div class="node-title">{{ ch.title }}</div>
              <div class="node-desc">{{ ch.desc }}</div>
            </div>
            <div v-if="showProgress && completedSet.has(ch.id)" class="progress-ring">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"
                  :stroke-dasharray="62.83"
                  :stroke-dashoffset="0"
                  class="ring-progress"/>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Connection arrows -->
        <div v-if="si < stages.length - 1" class="stage-connector">
          <svg width="24" height="32" viewBox="0 0 24 32">
            <path d="M12 0 L12 24 L6 18 M12 24 L18 18" stroke="currentColor" stroke-width="2" fill="none" opacity="0.4"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Dependency tooltip -->
    <Transition name="fade">
      <div v-if="hovered" class="tooltip" :style="tooltipStyle">
        <div class="tooltip-title">{{ getChapter(hovered)?.title }}</div>
        <div class="tooltip-deps">
          <span class="tooltip-label">前置知识：</span>
          <span v-for="dep in getChapter(hovered)?.deps || []" :key="dep" class="dep-tag">
            {{ getChapter(dep)?.title || dep }}
          </span>
          <span v-if="!getChapter(hovered)?.deps?.length" class="dep-tag none">无前置要求</span>
        </div>
        <div class="tooltip-keywords">
          <span v-for="kw in getChapter(hovered)?.keywords || []" :key="kw" class="keyword-tag">{{ kw }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useData, useRouter } from 'vitepress'

const { isDark } = useData()
const router = useRouter()

interface Chapter {
  id: string
  number: string
  title: string
  desc: string
  link: string
  type: 'foundation' | 'core' | 'key' | 'application' | 'advanced'
  deps: string[]
  keywords: string[]
}

interface Stage {
  label: string
  chapters: Chapter[]
}

const stages: Stage[] = [
  {
    label: '第一阶段 · 基础结构',
    chapters: [
      {
        id: 'ch1', number: '1', title: '群论基础',
        desc: '群、子群、正规子群、商群、同态',
        link: '/chapters/01-groups/', type: 'foundation',
        deps: [], keywords: ['群', '同态', 'Lagrange', '商群']
      },
      {
        id: 'ch2', number: '2', title: '环与理想',
        desc: '环、理想、商环、多项式环',
        link: '/chapters/02-rings/', type: 'foundation',
        deps: ['ch1'], keywords: ['环', '理想', 'PID', 'UFD']
      },
      {
        id: 'ch3', number: '3', title: '域论基础',
        desc: '域、扩张、代数元、极小多项式',
        link: '/chapters/03-fields/', type: 'foundation',
        deps: ['ch2'], keywords: ['域', '代数扩张', '塔定律']
      }
    ]
  },
  {
    label: '第二阶段 · 多项式与扩张',
    chapters: [
      {
        id: 'ch4', number: '4', title: '多项式理论',
        desc: '不可约性、Eisenstein、分圆多项式、可分性',
        link: '/chapters/04-polynomials/', type: 'core',
        deps: ['ch2', 'ch3'], keywords: ['不可约', '判别式', '可分']
      },
      {
        id: 'ch5', number: '5', title: '分裂域与正规扩张',
        desc: '分裂域、正规扩张、可分扩张',
        link: '/chapters/05-splitting-fields/', type: 'core',
        deps: ['ch3', 'ch4'], keywords: ['分裂域', '正规', 'Krull']
      },
      {
        id: 'ch6', number: '6', title: '代数闭包',
        desc: '代数闭包的存在与唯一性',
        link: '/chapters/06-algebraic-closure/', type: 'core',
        deps: ['ch5'], keywords: ['代数闭包', 'Zorn 引理']
      }
    ]
  },
  {
    label: '第三阶段 · Galois 理论核心',
    chapters: [
      {
        id: 'ch7', number: '7', title: 'Galois 群',
        desc: 'Galois 群的定义与计算',
        link: '/chapters/07-galois-groups/', type: 'key',
        deps: ['ch5', 'ch6'], keywords: ['Galois 群', '自同构']
      },
      {
        id: 'ch8', number: '8', title: 'Galois 对应',
        desc: '基本定理：子群 ↔ 中间域',
        link: '/chapters/08-galois-correspondence/', type: 'key',
        deps: ['ch7'], keywords: ['Galois 对应', '中间域', '基本定理']
      }
    ]
  },
  {
    label: '第四阶段 · 应用与推广',
    chapters: [
      {
        id: 'ch9', number: '9', title: '可解性与尺规作图',
        desc: 'Abel-Ruffini、三大几何问题',
        link: '/chapters/09-solvability/', type: 'application',
        deps: ['ch8'], keywords: ['可解群', '尺规作图', '三等分角']
      },
      {
        id: 'ch10', number: '10', title: '有限域',
        desc: 'Frobenius、有限域结构、编码应用',
        link: '/chapters/10-finite-fields/', type: 'application',
        deps: ['ch8'], keywords: ['有限域', 'Frobenius', '纠错码']
      },
      {
        id: 'ch11', number: '11', title: '无限 Galois 理论',
        desc: 'Krull 拓扑、profinite 群',
        link: '/chapters/11-infinite-galois/', type: 'advanced',
        deps: ['ch8'], keywords: ['profinite', 'Krull 拓扑', '逆极限']
      },
      {
        id: 'ch12', number: '12', title: '代数闭包与超越扩张',
        desc: '超越基、Lüroth 定理',
        link: '/chapters/12-algebraic-closure/', type: 'advanced',
        deps: ['ch6', 'ch8'], keywords: ['超越扩张', 'Lüroth', '超越度']
      }
    ]
  }
]

const flatChapters = computed(() => stages.flatMap(s => s.chapters))

const hovered = ref('')
const showProgress = ref(true)
const activeChapter = ref('')
const completedSet = ref(new Set<string>())

// Load progress from localStorage
onMounted(() => {
  const saved = localStorage.getItem('galois-roadmap-progress')
  if (saved) {
    try {
      completedSet.value = new Set(JSON.parse(saved))
    } catch { /* ignore */ }
  }
  // Detect current chapter from URL
  const path = window.location.pathname
  for (const ch of flatChapters.value) {
    if (path.includes(ch.link.replace(/^\//, '').replace(/\/$/, ''))) {
      activeChapter.value = ch.id
      break
    }
  }
})

watch(completedSet, (val) => {
  localStorage.setItem('galois-roadmap-progress', JSON.stringify([...val]))
}, { deep: true })

function toggleProgress() {
  showProgress.value = !showProgress.value
}

function resetProgress() {
  completedSet.value = new Set()
}

function getChapter(id: string): Chapter | undefined {
  return flatChapters.value.find(c => c.id === id)
}

function navigateTo(ch: Chapter) {
  // Toggle completed on ctrl/meta+click
  if (window.event && (window.event as MouseEvent).ctrlKey) {
    const newSet = new Set(completedSet.value)
    if (newSet.has(ch.id)) newSet.delete(ch.id)
    else newSet.add(ch.id)
    completedSet.value = newSet
    return
  }
  router.go(ch.link)
}

const tooltipStyle = computed(() => ({}))
</script>

<style scoped>
.chapter-roadmap {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.roadmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.roadmap-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--vp-c-text-1);
}

.roadmap-controls {
  display: flex;
  gap: 0.5rem;
}

.roadmap-controls button {
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.roadmap-controls button:hover,
.roadmap-controls button.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.reset-btn:hover {
  background: var(--vp-c-danger-1, #e74c3c) !important;
  border-color: var(--vp-c-danger-1, #e74c3c) !important;
}

.roadmap-stages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.roadmap-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stage-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-3);
  margin-bottom: 0.75rem;
}

.stage-chapters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  width: 100%;
}

.chapter-node {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.25s ease;
  min-width: 200px;
  max-width: 280px;
  position: relative;
}

.chapter-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.chapter-node.type-foundation { border-left: 4px solid #3b82f6; }
.chapter-node.type-core { border-left: 4px solid #f59e0b; }
.chapter-node.type-key { border-left: 4px solid #8b5cf6; }
.chapter-node.type-application { border-left: 4px solid #10b981; }
.chapter-node.type-advanced { border-left: 4px solid #ef4444; }

.chapter-node.completed {
  background: var(--vp-c-green-soft, rgba(16, 185, 129, 0.08));
  border-color: var(--vp-c-green-2, #10b981);
}

.chapter-node.active {
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}

.node-marker {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 2px solid var(--vp-c-divider);
}

.chapter-node.completed .node-marker {
  background: var(--vp-c-green-2, #10b981);
  color: white;
  border-color: var(--vp-c-green-2, #10b981);
}

.check { font-size: 0.75rem; }

.node-content { flex: 1; }

.node-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.2rem;
}

.node-desc {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

.stage-connector {
  margin: 0.25rem 0;
  color: var(--vp-c-text-3);
}

/* Tooltip */
.tooltip {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  max-width: 320px;
  z-index: 100;
}

.tooltip-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.tooltip-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin-right: 0.3rem;
}

.dep-tag {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  font-size: 0.75rem;
  background: var(--vp-c-default-soft);
  border-radius: 4px;
  margin: 0.15rem 0.2rem;
  color: var(--vp-c-text-2);
}

.dep-tag.none { opacity: 0.5; }

.tooltip-keywords {
  margin-top: 0.5rem;
}

.keyword-tag {
  display: inline-block;
  padding: 0.1rem 0.4rem;
  font-size: 0.7rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 3px;
  margin: 0.1rem;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 640px) {
  .stage-chapters { flex-direction: column; align-items: center; }
  .chapter-node { min-width: 0; max-width: 100%; width: 100%; }
}
</style>
