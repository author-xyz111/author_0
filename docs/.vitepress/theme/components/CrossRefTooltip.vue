<template>
  <Teleport to="body">
    <Transition name="tooltip-fade">
      <div
        v-if="visible && content"
        class="crossref-tooltip"
        :style="tooltipStyle"
        @mouseenter="keepOpen"
        @mouseleave="hide"
      >
        <div class="crossref-tooltip__kind" :class="`crossref-tooltip__kind--${kind}`">
          {{ kindLabel }}
        </div>
        <div class="crossref-tooltip__title" v-if="title">{{ title }}</div>
        <div class="crossref-tooltip__content" v-html="content"></div>
        <div class="crossref-tooltip__footer">
          <span class="crossref-tooltip__page">{{ pageName }}</span>
          <span class="crossref-tooltip__hint">点击跳转</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const visible = ref(false)
const content = ref('')
const title = ref('')
const kind = ref('def')
const pageName = ref('')
const posX = ref(0)
const posY = ref(0)
let hideTimeout: ReturnType<typeof setTimeout> | null = null
let currentTarget: HTMLElement | null = null

const kindLabels: Record<string, string> = {
  def: '定义', thm: '定理', lem: '引理', prop: '命题',
  cor: '推论', ex: '例', rem: '注', ax: '公理', not: '记号', int: '直觉'
}

const tooltipStyle = computed(() => ({
  left: `${posX.value}px`,
  top: `${posY.value}px`,
}))

function extractContent(el: HTMLElement): { text: string; ttl: string; k: string } {
  const dataRef = el.getAttribute('data-ref') || ''
  const [k, id] = dataRef.split(':')
  
  // Find the target element
  const target = document.getElementById(id)
  if (!target) return { text: '', ttl: '', k: k || 'def' }

  // Get the math-env body content (first ~300 chars)
  const body = target.querySelector('.math-env__body')
  const header = target.querySelector('.math-env__title')
  
  let text = ''
  if (body) {
    text = (body as HTMLElement).innerText || ''
    if (text.length > 280) text = text.slice(0, 280) + '…'
  }
  
  return {
    text,
    ttl: header ? (header as HTMLElement).innerText : '',
    k: k || 'def'
  }
}

function findPageForElement(el: HTMLElement): string {
  // Walk up to find page section context
  const sidebar = document.querySelector('.VPSidebarItem.is-active')
  if (sidebar) {
    const text = sidebar.querySelector('.text')
    if (text) return text.textContent || ''
  }
  return ''
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

  const { text, ttl, k } = extractContent(link)
  if (!text) return

  content.value = text
  title.value = ttl
  kind.value = k
  pageName.value = findPageForElement(link)

  // Position
  const rect = link.getBoundingClientRect()
  posX.value = Math.min(rect.left, window.innerWidth - 380)
  posY.value = rect.bottom + 8

  // If tooltip would go below viewport, show above
  if (posY.value + 200 > window.innerHeight) {
    posY.value = rect.top - 8
    // Will adjust with transform
  }

  visible.value = true
}

function hide() {
  hideTimeout = setTimeout(() => {
    visible.value = false
    currentTarget = null
  }, 200)
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
    if (link) hide()
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
  max-width: 380px;
  min-width: 220px;
  padding: 0.85rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  font-size: 0.88rem;
  line-height: 1.6;
  pointer-events: auto;
}

.dark .crossref-tooltip {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
}

.crossref-tooltip__kind {
  display: inline-block;
  padding: 0.05em 0.4em;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #fff;
  margin-bottom: 0.35rem;
}

.crossref-tooltip__kind--def { background: var(--env-definition-border); }
.crossref-tooltip__kind--thm { background: var(--env-theorem-border); }
.crossref-tooltip__kind--lem { background: var(--env-lemma-border); }
.crossref-tooltip__kind--prop { background: var(--env-proposition-border); }
.crossref-tooltip__kind--cor { background: var(--env-corollary-border); }
.crossref-tooltip__kind--ex { background: var(--env-example-border); }
.crossref-tooltip__kind--rem { background: var(--env-remark-border); }
.crossref-tooltip__kind--ax { background: var(--env-axiom-border); }

.crossref-tooltip__title {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: var(--vp-c-text-1);
}

.crossref-tooltip__content {
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  line-height: 1.65;
  max-height: 150px;
  overflow-y: auto;
}

.crossref-tooltip__content .katex {
  font-size: 0.95em;
}

.crossref-tooltip__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.4rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.crossref-tooltip__hint {
  color: var(--galois-primary);
  font-weight: 500;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
