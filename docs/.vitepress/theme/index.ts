import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { onContentUpdated } from 'vitepress'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import ProofToggle from './components/ProofToggle.vue'
import SubgroupLattice from './components/SubgroupLattice.vue'
import CorrespondenceTable from './components/CorrespondenceTable.vue'
import KnowledgeGraph from './components/KnowledgeGraph.vue'
import FieldExtensionDiagram from './components/FieldExtensionDiagram.vue'
import './custom.css'

// Cross-page cross-reference manifest
// At build time, a JSON manifest maps each {#id} anchor → page path.
// On the client, we fetch it once and rewrite internal crossref links.
let crossrefManifest: Record<string, string> | null = null
let manifestFetchPromise: Promise<Record<string, string>> | null = null

async function loadManifest(): Promise<Record<string, string>> {
  if (crossrefManifest) return crossrefManifest
  if (!manifestFetchPromise) {
    manifestFetchPromise = fetch('/author_0/crossref-manifest.json')
      .then(r => r.ok ? r.json() : {})
      .catch(() => ({}))
  }
  crossrefManifest = await manifestFetchPromise
  return crossrefManifest!
}

function resolveCrossRefs() {
  const anchors = document.querySelectorAll('.crossref[data-ref]')
  if (!anchors.length) return

  // Resolve same-page refs first
  anchors.forEach((el) => {
    const dataRef = el.getAttribute('data-ref')
    if (!dataRef) return
    const [_, refId] = dataRef.split(':')
    if (!refId) return
    const target = document.getElementById(refId)
    if (target) {
      el.setAttribute('href', '#' + refId)
      el.classList.add('crossref-resolved')
    }
  })

  // Then try cross-page refs using manifest
  const unresolved = document.querySelectorAll('.crossref[data-ref]:not(.crossref-resolved)')
  if (!unresolved.length) return

  loadManifest().then((manifest) => {
    if (!manifest || !Object.keys(manifest).length) return
    unresolved.forEach((el) => {
      const dataRef = el.getAttribute('data-ref')
      if (!dataRef) return
      const [_, refId] = dataRef.split(':')
      if (refId && manifest[refId]) {
        el.setAttribute('href', manifest[refId] + '#' + refId)
        el.classList.add('crossref-resolved')
      }
    })
  })
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ProofToggle', ProofToggle)
    app.component('SubgroupLattice', SubgroupLattice)
    app.component('CorrespondenceTable', CorrespondenceTable)
    app.component('KnowledgeGraph', KnowledgeGraph)
    app.component('FieldExtensionDiagram', FieldExtensionDiagram)
  },
  setup() {
    const route = useRoute()

    onMounted(() => {
      nextTick(() => {
        resolveCrossRefs()
      })
    })

    watch(
      () => route.path,
      () => {
        nextTick(() => {
          resolveCrossRefs()
        })
      }
    )
  },
} satisfies Theme
