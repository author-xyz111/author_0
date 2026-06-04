<template>
  <Teleport to="body">
    <Transition name="tooltip-fade">
      <div
        v-if="visible && (content || loading)"
        class="crossref-tooltip"
        :style="tooltipStyle"
        :class="{ 'crossref-tooltip--loading': loading }"
        @mouseenter="keepOpen"
        @mouseleave="scheduleHide"
      >
        <div class="crossref-tooltip__kind" :class="`crossref-tooltip__kind--${kind}`">
          {{ kindLabel }}
        </div>
        <div class="crossref-tooltip__title" v-if="title">{{ title }}</div>
        <div v-if="loading" class="crossref-tooltip__loading">
          <div class="crossref-tooltip__spinner"></div>
          <span>加载中…</span>
        </div>
        <div v-else class="crossref-tooltip__content" v-html="content"></div>
        <div class="crossref-tooltip__footer">
          <span class="crossref-tooltip__page">{{ pageName }}</span>
          <span class="crossref-tooltip__hint">点击跳转 ↗</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vitepress'

const visible = ref(false)
const content = ref('')
const title = ref('')
const kind = ref('def')
const pageName = ref('')
const loading = ref(false)
const posX = ref(0)
const posY = ref(0)
let hideTimeout: ReturnType<typeof setTimeout> | null = null
let currentTarget: HTMLElement | null = null
let loadAbort: AbortController | null = null

// Cache for cross-page previews
const pageCache = new Map<string, Document>()

const kindLabels: Record<string, string> = {
  def: '定义', thm: '定理', lem: '引理', prop: '命题',
  cor: '推论', ex: '例', rem: '注', ax: '公理', not: '记号', int: '直觉'
}

const kindLabel = computed(() => kindLabels[kind.value] || kind.value)

const tooltipStyle = computed(() => ({
  left: `${posX.value}px`,
  top: `${posY.value}px`,
}))

function extractSamePageContent(el: HTMLElement): { text: string; ttl: string; k: string } | null {
  const dataRef = el.getAttribute('data-ref') || ''
  const [k, id] = dataRef.split(':')

  const target = document.getElementById(id)
  if (!target) return null

  const body = target.querySelector('.math-env__body')
  const header = target.querySelector('.math-env__title')

  let text = ''
  if (body) {
    text = (body as HTMLElement).innerText || ''
    if (text.length > 320) text = text.slice(0, 320) + '…'
  }

  return {
    text,
    ttl: header ? (header as HTMLElement).innerText : '',
    k: k || 'def'
  }
}

function extractCrossPageContent(doc: Document, anchorId: string, k: string): { text: string; ttl: string } {
  const target = doc.getElementById(anchorId)
  if (!target) return { text: '', ttl: '' }

  const body = target.querySelector('.math-env__body')
  const header = target.querySelector('.math-env__title')

  let text = ''
  if (body) {
    // Get innerHTML to preserve KaTeX rendering
    text = (body as HTMLElement).innerText || ''
    if (text.length > 320) text = text.slice(0, 320) + '…'
  }

  return {
    text,
    ttl: header ? (header as HTMLElement).innerText : ''
  }
}

function findPageName(el: HTMLElement): string {
  const dataRef = el.getAttribute('data-ref') || ''
  const href = el.getAttribute('href') || ''

  // Try to extract chapter name from href
  const match = href.match(/\/chapters\/(\d+[-\w]+)\//)
  if (match) {
    const chapterPath = match[1]
    // Map common chapter paths to names
    const chapterNames: Record<string, string> = {
      '01-groups': '第一章 · 群',
      '02-rings': '第二章 · 环',
      '03-fields': '第三章 · 域',
      '04-polynomials': '第四章 · 多项式',
      '05-splitting-fields': '第五章 · 分裂域',
      '06-algebraic-closure': '第六章 · 代数闭包',
      '07-galois-groups': '第七章 · Galois 群',
      '08-galois-correspondence': '第八章 · Galois 对应',
      '09-solvability': '第九章 · 可解性',
      '10-finite-fields': '第十章 · 有限域',
      '11-ruler-compass': '第十一章 · 尺规作图',
      '12-infinite-galois': '第十二章 · 无限 Galois 理论',
    }
    return chapterNames[chapterPath] || chapterPath
  }

  // Fallback: try sidebar
  const sidebar = document.querySelector('.VPSidebarItem.is-active')
  if (sidebar) {
    const text = sidebar.querySelector('.text')
    if (text) return text.textContent || ''
  }
  return ''
}

async function fetchPage(url: string): Promise<Document | null> {
  if (pageCache.has(url)) return pageCache.get(url)!

  try {
    loadAbort = new AbortController()
    const resp = await fetch(url, { signal: loadAbort.signal })
    if (!resp.ok) return null
    const html = await resp.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    pageCache.set(url, doc)
    return doc
  } catch {
    return null
  }
}

function show(e: MouseEvent) {
  const target = e.target as HTMLElement
  const link = target.closest('.crossref[data-ref]') as HTMLElement
  if (!link) return

  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }

  if (currentTarget === link && visible.value) return
  currentTarget = link

  const dataRef = link.getAttribute('data-ref') || ''
  const [k, refId] = dataRef.split(':')

  // Try same-page first
  const samePage = extractSamePageContent(link)
  if (samePage && samePage.text) {
    content.value = samePage.text
    title.value = samePage.ttl
    kind.value = samePage.k || k || 'def'
    pageName.value = ''
    loading.value = false

    positionTooltip(link)
    visible.value = true
    return
  }

  // Cross-page: show loading, then fetch
  const href = link.getAttribute('href') || ''
  if (!href || href.startsWith('#')) {
    // Unresolved crossref — no tooltip
    return
  }

  content.value = ''
  title.value = ''
  kind.value = k || 'def'
  pageName.value = findPageName(link)
  loading.value = true
  positionTooltip(link)
  visible.value = true

  // Fetch the target page
  const base = (import.meta as any).env?.BASE_URL || '/'
  const fullUrl = new URL(href.split('#')[0], window.location.origin + base).pathname

  fetchPage(fullUrl).then((doc) => {
    if (!doc || currentTarget !== link) {
      loading.value = false
      visible.value = false
      return
    }

    const anchorId = href.split('#')[1] || refId
    const { text, ttl } = extractCrossPageContent(doc, anchorId, k)

    if (text) {
      content.value = text
      title.value = ttl
    } else {
      // Couldn't extract content, hide tooltip
      visible.value = false
    }
    loading.value = false
  })
}

function positionTooltip(link: HTMLElement) {
  const rect = link.getBoundingClientRect()
  posX.value = Math.min(rect.left, window.innerWidth - 400)
  posY.value = rect.bottom + 10

  if (posY.value + 220 > window.innerHeight) {
    posY.value = rect.top - 10
  }
}

function scheduleHide() {
  hideTimeout = setTimeout(() => {
    if (loadAbort) {
      loadAbort.abort()
      loadAbort = null
    }
    visible.value = false
    loading.value = false
    currentTarget = null
  }, 250)
}

function keepOpen() {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
}

onMounted(() => {
  document.addEventListener('mouseover', show)
  document.addEventListener('mouseout', (e) => {
    const link = (e.target as HTMLElement).closest('.crossref[data-ref]')
    if (link) scheduleHide()
  })
  // Also handle keyboard escape to dismiss
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && visible.value) {
      visible.value = false
      loading.value = false
      currentTarget = null
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('mouseover', show)
})
</script>

<style>
.crossref-tooltip {
  position: fixed;
  z-index: 9999;
  max-width: 400px;
  min-width: 240px;
  padding: 0.85rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.14),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  font-size: 0.88rem;
  line-height: 1.6;
  pointer-events: auto;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: box-shadow 0.2s ease;
}

.crossref-tooltip:hover {
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.18),
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.dark .crossref-tooltip {
  background: var(--vp-c-bg-soft);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.3);
}

.crossref-tooltip--loading {
  min-height: 60px;
}

.crossref-tooltip__loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-3);
  font-size: 0.82rem;
  padding: 0.3rem 0;
}

.crossref-tooltip__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--galois-primary);
  border-radius: 50%;
  animation: tooltip-spin 0.6s linear infinite;
}

@keyframes tooltip-spin {
  to { transform: rotate(360deg); }
}

.crossref-tooltip__kind {
  display: inline-block;
  padding: 0.1em 0.5em;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 0.4rem;
}

.crossref-tooltip__kind--def { background: var(--env-definition-border, #3b82f6); }
.crossref-tooltip__kind--thm { background: var(--env-theorem-border, #8b5cf6); }
.crossref-tooltip__kind--lem { background: var(--env-lemma-border, #06b6d4); }
.crossref-tooltip__kind--prop { background: var(--env-proposition-border, #f59e0b); }
.crossref-tooltip__kind--cor { background: var(--env-corollary-border, #10b981); }
.crossref-tooltip__kind--ex { background: var(--env-example-border, #6366f1); }
.crossref-tooltip__kind--rem { background: var(--env-remark-border, #64748b); }
.crossref-tooltip__kind--ax { background: var(--env-axiom-border, #ec4899); }

.crossref-tooltip__title {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
  color: var(--vp-c-text-1);
  line-height: 1.35;
}

.crossref-tooltip__content {
  color: var(--vp-c-text-2);
  font-size: 0.83rem;
  line-height: 1.7;
  max-height: 160px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.crossref-tooltip__content .katex {
  font-size: 0.92em;
}

.crossref-tooltip__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.55rem;
  padding-top: 0.45rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
}

.crossref-tooltip__hint {
  color: var(--galois-primary, #6366f1);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1), transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.97);
}
</style>
