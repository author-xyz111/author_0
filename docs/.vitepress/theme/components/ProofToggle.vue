<template>
  <div class="proof-toggle-wrap">
    <button
      class="proof-toggle"
      :class="{ expanded: isOpen }"
      @click="toggle"
      :aria-expanded="isOpen"
      aria-label="展开/收起证明"
    >
      <span class="proof-toggle__arrow">{{ isOpen ? '▼' : '▶' }}</span>
      <span class="proof-toggle__text">{{ isOpen ? '收起证明' : '展开证明' }}</span>
    </button>
    <div
      ref="contentRef"
      class="proof-content"
      :style="contentStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const isOpen = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const contentHeight = ref(0)

function toggle() {
  isOpen.value = !isOpen.value
}

const contentStyle = computed(() => ({
  maxHeight: isOpen.value ? `${contentHeight.value}px` : '0px',
  opacity: isOpen.value ? '1' : '0',
  overflow: 'hidden',
  transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
}))

function measureHeight() {
  if (contentRef.value) {
    contentHeight.value = contentRef.value.scrollHeight
  }
}

onMounted(() => {
  measureHeight()
})

watch(isOpen, async () => {
  await nextTick()
  measureHeight()
})
</script>

<style scoped>
.proof-toggle-wrap {
  margin: 1rem 0;
}

.proof-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.4em 1em;
  background: var(--env-proof-bg, #f8fafc);
  border: 1px solid var(--env-proof-border, #94a3b8);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.88em;
  font-weight: 600;
  color: var(--env-proof-text, #334155);
  transition: all 0.2s ease;
  font-family: inherit;
  user-select: none;
}

.proof-toggle:hover {
  background: var(--env-proof-border, #94a3b8);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.proof-toggle.expanded {
  background: var(--env-proof-border, #94a3b8);
  color: #fff;
}

.proof-toggle__arrow {
  display: inline-block;
  font-size: 0.75em;
  transition: transform 0.2s ease;
}

.proof-content {
  padding-left: 1rem;
  border-left: 2px dashed var(--env-proof-border, #94a3b8);
  margin-top: 0.5rem;
}

.proof-content > :first-child {
  margin-top: 0;
}

.proof-content > :last-child {
  margin-bottom: 0;
}
</style>
