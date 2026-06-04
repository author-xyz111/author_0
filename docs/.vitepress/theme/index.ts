// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

// Interactive Vue components
import ProofToggle from './components/ProofToggle.vue'
import SubgroupLattice from './components/SubgroupLattice.vue'
import CorrespondenceTable from './components/CorrespondenceTable.vue'
import KnowledgeGraph from './components/KnowledgeGraph.vue'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register interactive components globally — usable in any .md file
    app.component('ProofToggle', ProofToggle)
    app.component('SubgroupLattice', SubgroupLattice)
    app.component('CorrespondenceTable', CorrespondenceTable)
    app.component('KnowledgeGraph', KnowledgeGraph)
  },
  setup() {
    // Client-side cross-reference resolver
    // Maps {def:xxx} etc. links to actual anchor targets
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        requestAnimationFrame(resolveCrossRefs)
      })

      // Also re-resolve on VitePress route change
      if ((window as any).__VP_ROUTE_CHANGE__) {
        (window as any).__VP_ROUTE_CHANGE__(resolveCrossRefs)
      }
    }
  }
}

function resolveCrossRefs() {
  // Collect all elements with crossref href attributes
  document.querySelectorAll('.crossref[data-ref]').forEach(link => {
    const ref = link.getAttribute('data-ref')
    if (!ref) return
    const [_, id] = ref.split(':')
    const target = document.getElementById(id)
    if (target) {
      (link as HTMLAnchorElement).href = `#${id}`
      link.setAttribute('title', target.querySelector('.math-env__title')?.textContent || id)
    }
  })

  // Ensure all math-env blocks with IDs get proper scroll offset
  document.querySelectorAll('.math-env[id]').forEach(el => {
    el.setAttribute('style', 'scroll-margin-top: calc(var(--vp-nav-height, 64px) + 24px);')
  })
}

export default theme
