<template>
  <div class="reading-progress" v-if="showProgress">
    <div class="reading-progress__bar" :style="{ width: progress + '%' }"></div>
  </div>
  <div class="reading-toc" :class="{ collapsed: tocCollapsed }">
    <button class="reading-toc__toggle" @click="tocCollapsed = !tocCollapsed" title="目录">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="2" y="3" width="12" height="1.5" rx="0.75"/>
        <rect x="2" y="7.25" width="8" height="1.5" rx="0.75"/>
        <rect x="2" y="11.5" width="10" height="1.5" rx="0.75"/>
      </svg>
    </button>
    <div class="reading-toc__content" v-if="!tocCollapsed">
      <div class="reading-toc__title">本页目录</div>
      <nav class="reading-toc__nav">
        <a
          v-for="item in tocItems"
          :key="item.id"
          :href="'#' + item.id"
          class="reading-toc__link"
          :class="[`reading-toc__link--${item.level}`, { active: activeId === item.id }]"
        >
          {{ item.text }}
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

interface TocItem {
  id: string
  text: string
  level: number
}

const route = useRoute()

const progress = ref(0)
const showProgress = ref(false)
const tocCollapsed = ref(true)
const tocItems = ref<TocItem[]>([])
const activeId = ref('')

function updateProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
  showProgress.value = scrollTop > 100

  // Update active TOC item
  const headings = document.querySelectorAll('.vp-doc h2, .vp-doc h3')
  let current = ''
  for (const h of headings) {
    const rect = h.getBoundingClientRect()
    if (rect.top <= 120) {
      current = h.id
    }
  }
  activeId.value = current
}

function buildToc() {
  const headings = document.querySelectorAll('.vp-doc h2, .vp-doc h3')
  const items: TocItem[] = []
  for (const h of headings) {
    if (h.id && h.textContent) {
      items.push({
        id: h.id,
        text: h.textContent.replace(/#$/, '').trim(),
        level: h.tagName === 'H2' ? 2 : 3,
      })
    }
  }
  tocItems.value = items
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  buildToc()
  updateProgress()
})

watch(() => route.path, () => {
  nextTick(() => {
    buildToc()
    updateProgress()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 10000;
  background: transparent;
}

.reading-progress__bar {
  height: 100%;
  background: linear-gradient(90deg, var(--galois-primary), var(--galois-accent));
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
}

.reading-toc {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 9999;
  font-family: var(--vp-font-family-base);
}

.reading-toc__toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  position: absolute;
  bottom: 0;
  right: 0;
}

.reading-toc__toggle:hover {
  background: var(--galois-primary);
  color: #fff;
  border-color: var(--galois-primary);
}

.reading-toc.collapsed .reading-toc__toggle {
  position: static;
}

.reading-toc__content {
  position: absolute;
  bottom: 50px;
  right: 0;
  width: 260px;
  max-height: 400px;
  overflow-y: auto;
  padding: 0.85rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.reading-toc__title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.reading-toc__nav {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.reading-toc__link {
  display: block;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  border-radius: 4px;
  line-height: 1.5;
  transition: all 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reading-toc__link--h3 {
  padding-left: 1.25rem;
  font-size: 0.76rem;
}

.reading-toc__link:hover {
  color: var(--galois-primary);
  background: var(--vp-c-bg-soft);
}

.reading-toc__link.active {
  color: var(--galois-primary);
  font-weight: 600;
  background: rgba(45, 27, 105, 0.06);
}

.dark .reading-toc__link.active {
  background: rgba(255, 255, 255, 0.06);
}

.dark .reading-toc__toggle {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .reading-toc__content {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

@media (max-width: 1200px) {
  .reading-toc {
    display: none;
  }
}
</style>
