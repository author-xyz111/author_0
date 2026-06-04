<template>
  <span class="concept-card" @mouseenter="show" @mouseleave="hide" @click="toggle">
    <span class="concept-card__trigger">
      <slot>{{ label }}</slot>
      <svg class="concept-card__icon" width="12" height="12" viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" stroke-width="1.2"/>
        <text x="6" y="9" text-anchor="middle" font-size="8" fill="currentColor">?</text>
      </svg>
    </span>
    <Teleport to="body">
      <Transition name="concept-card-fade">
        <div
          v-if="visible"
          ref="cardRef"
          class="concept-card__popup"
          :style="popupStyle"
          @mouseenter="keepOpen"
          @mouseleave="hide"
        >
          <div class="concept-card__header">
            <span class="concept-card__kind" :style="{ color: kindColor }">{{ kindLabel }}</span>
            <span class="concept-card__title">{{ title }}</span>
          </div>
          <div class="concept-card__body">
            <div v-if="definition" class="concept-card__def" v-html="definition"></div>
            <div v-if="example" class="concept-card__example">
              <span class="concept-card__example-label">例：</span>{{ example }}
            </div>
            <div v-if="related && related.length" class="concept-card__related">
              <span class="concept-card__related-label">相关：</span>
              <template v-for="(item, i) in related" :key="i">
                <a v-if="item.link" :href="item.link" class="concept-card__related-link">{{ item.text }}</a>
                <span v-else class="concept-card__related-item">{{ item.text }}</span>
                <span v-if="i < related.length - 1" class="concept-card__related-sep">·</span>
              </template>
            </div>
          </div>
          <div v-if="link" class="concept-card__footer">
            <a :href="link" class="concept-card__more">详细了解 →</a>
          </div>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

interface RelatedItem { text: string; link?: string }

const props = defineProps<{
  label?: string
  title: string
  kind?: string
  definition?: string
  example?: string
  related?: RelatedItem[]
  link?: string
}>()

const visible = ref(false)
const cardRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const popupStyle = ref<Record<string, string>>({})
let hideTimer: ReturnType<typeof setTimeout> | null = null

const kindLabel = computed(() => {
  const map: Record<string, string> = {
    def: '定义', thm: '定理', lem: '引理', prop: '命题',
    cor: '推论', ex: '例', rem: '注', ax: '公理'
  }
  return map[props.kind || 'def'] ?? '定义'
})

const kindColor = computed(() => {
  const map: Record<string, string> = {
    def: 'var(--env-definition-text)',
    thm: 'var(--env-theorem-text)',
    lem: 'var(--env-lemma-text)',
    prop: 'var(--env-proposition-text)',
    cor: 'var(--env-corollary-text)',
    ex: 'var(--env-example-text)',
    rem: 'var(--env-remark-text)',
    ax: 'var(--env-axiom-text)',
  }
  return map[props.kind || 'def'] ?? 'var(--env-definition-text)'
})

function calcPosition() {
  const trigger = (cardRef.value?.previousElementSibling as HTMLElement) || null
  // Use requestAnimationFrame to get computed position
  popupStyle.value = { opacity: '0', pointerEvents: 'none' as any }
}

function show(e: MouseEvent) {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  visible.value = true
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const vw = window.innerWidth
  const top = rect.bottom + 8
  let left = rect.left
  // Prevent overflow right
  if (left + 360 > vw) left = vw - 370
  if (left < 10) left = 10
  popupStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: '10000',
  }
}

function hide() {
  hideTimer = setTimeout(() => {
    visible.value = false
  }, 200)
}

function keepOpen() {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
}

function toggle(e: MouseEvent) {
  if (visible.value) {
    visible.value = false
  } else {
    show(e)
  }
}

onUnmounted(() => {
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<style scoped>
.concept-card {
  display: inline;
  cursor: pointer;
  position: relative;
}

.concept-card__trigger {
  border-bottom: 1px dashed var(--vp-c-text-3);
  transition: border-color 0.2s;
}

.concept-card__trigger:hover {
  border-color: var(--galois-primary);
}

.concept-card__icon {
  display: inline-block;
  margin-left: 2px;
  vertical-align: super;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.concept-card__trigger:hover .concept-card__icon {
  opacity: 1;
}
</style>

<style>
.concept-card__popup {
  width: min(360px, 90vw);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0;
  overflow: hidden;
  font-size: 0.9rem;
  line-height: 1.6;
}

.concept-card__header {
  padding: 10px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  gap: 8px;
}

.concept-card__kind {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.04);
}

.dark .concept-card__kind {
  background: rgba(255, 255, 255, 0.06);
}

.concept-card__title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.concept-card__body {
  padding: 12px 14px;
}

.concept-card__def {
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.concept-card__def p {
  margin: 0;
}

.concept-card__example {
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  padding: 6px 10px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  margin-bottom: 8px;
}

.concept-card__example-label {
  font-weight: 600;
  color: var(--env-example-text);
}

.concept-card__related {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  margin-top: 4px;
}

.concept-card__related-label {
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.concept-card__related-link {
  color: var(--galois-primary);
  text-decoration: none;
}

.concept-card__related-link:hover {
  text-decoration: underline;
}

.concept-card__related-sep {
  margin: 0 4px;
  opacity: 0.4;
}

.concept-card__footer {
  padding: 8px 14px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.concept-card__more {
  color: var(--galois-primary);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
}

.concept-card__more:hover {
  text-decoration: underline;
}

/* Transition */
.concept-card-fade-enter-active,
.concept-card-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.concept-card-fade-enter-from,
.concept-card-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
