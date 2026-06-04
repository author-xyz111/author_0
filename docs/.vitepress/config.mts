import { defineConfig } from 'vitepress'
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import container from 'markdown-it-container'
import type MarkdownIt from 'markdown-it'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Math environment container plugin ──────────────────────────────────
interface EnvDef { type: string; label: string; color: string }
const MATH_ENVS: EnvDef[] = [
  { type: 'definition',  label: '定义',  color: 'blue'    },
  { type: 'theorem',     label: '定理',  color: 'gold'    },
  { type: 'lemma',       label: '引理',  color: 'purple'  },
  { type: 'proposition', label: '命题',  color: 'teal'    },
  { type: 'corollary',   label: '推论',  color: 'green'   },
  { type: 'proof',       label: '证明',  color: 'gray'    },
  { type: 'example',     label: '例',    color: 'cyan'    },
  { type: 'remark',      label: '注',    color: 'slate'   },
  { type: 'exercise',    label: '习题',  color: 'rose'    },
  { type: 'notation',    label: '记号',  color: 'amber'   },
  { type: 'intuition',   label: '直觉',  color: 'indigo'  },
  { type: 'axiom',       label: '公理',  color: 'red'     },
]

// Parse {#id} from the info string: "definition 群 (Group) {#def-group}"
function parseEnvInfo(info: string, type: string): { title: string; id: string } {
  let rest = info.slice(type.length).trim()
  let id = ''
  const idMatch = rest.match(/\{#([a-zA-Z0-9_-]+)\}\s*$/)
  if (idMatch) {
    id = idMatch[1]
    rest = rest.slice(0, idMatch.index).trim()
  }
  return { title: rest, id }
}

function registerMathContainers(md: MarkdownIt) {
  for (const { type, label } of MATH_ENVS) {
    md.use(container, type, {
      render(tokens: any[], idx: number) {
        const token = tokens[idx]
        if (token.nesting === 1) {
          const info = token.info.trim()
          const { title, id } = parseEnvInfo(info, type)
          const idAttr = id ? ` id="${id}"` : ''
          const titleAttr = title ? ` data-title="${md.utils.escapeHtml(title)}"` : ''
          return `<div class="math-env math-env--${type}"${idAttr}${titleAttr}>\n` +
                 `<div class="math-env__header"><span class="math-env__label">${label}</span>` +
                 (title ? ` <span class="math-env__title">${md.renderInline(title)}</span>` : '') +
                 `</div>\n<div class="math-env__body">\n`
        }
        return `</div></div>\n`
      }
    })
  }
}

// ── Cross-reference inline plugin ──────────────────────────────────────
// Transforms  {def:group-id}  {thm:lagrange}  etc. into styled links
function crossrefPlugin(md: MarkdownIt) {
  md.inline.ruler.after('escape', 'crossref', (state, silent) => {
    const src = state.src
    const pos = state.pos
    if (src.charCodeAt(pos) !== 0x7B /* { */) return false

    const match = src.slice(pos).match(/^\{(def|thm|lem|prop|cor|ex|rem|ax|not|int):([a-zA-Z0-9_-]+)\}/)
    if (!match) return false

    if (silent) return true

    const [full, kind, id] = match
    const kindLabels: Record<string, string> = {
      def: '定义', thm: '定理', lem: '引理', prop: '命题',
      cor: '推论', ex: '例', rem: '注', ax: '公理', not: '记号', int: '直觉'
    }
    const label = kindLabels[kind] ?? kind
    const token = state.push('crossref', 'a', 0)
    token.attrSet('class', `crossref crossref--${kind}`)
    token.attrSet('href', `#${id}`)
    token.attrSet('data-ref', `${kind}:${id}`)
    token.content = `${label}`
    token.markup = '{'
    state.pos += full.length
    return true
  })

  md.renderer.rules.crossref = (tokens, idx) => {
    const token = tokens[idx]
    const href = token.attrGet('href') || '#'
    const cls = token.attrGet('class') || ''
    const dataRef = token.attrGet('data-ref') || ''
    const label = token.content
    const dataAttr = dataRef ? ` data-ref="${dataRef}"` : ''
    return `<a class="${cls}" href="${href}"${dataAttr}><span class="crossref__bracket">[</span>${label}<span class="crossref__bracket">]</span></a>`
  }
}

// ── Build-time anchor manifest for cross-page cross-references ─────────
// Generates JSON mapping each anchor ID → page path
interface AnchorEntry { id: string; page: string; kind: string }
const anchorRegistry: AnchorEntry[] = []
const pageAnchors = new Map<string, Set<string>>() // page → set of anchor IDs

function crossrefManifestPlugin(md: MarkdownIt) {
  // Intercept render to collect all {#id} anchors per page
  const origRender = md.render.bind(md)
  md.render = function (src: string, env?: any) {
    // Extract all {#id} patterns from the source
    const idRegex = /\{#([a-zA-Z0-9_-]+)\}/g
    let match: RegExpExecArray | null
    while ((match = idRegex.exec(src)) !== null) {
      const id = match[1]
      // Determine the kind from the preceding container type
      const prefix = src.slice(Math.max(0, match.index - 100), match.index)
      let kind = 'def'
      if (prefix.includes('theorem')) kind = 'thm'
      else if (prefix.includes('lemma')) kind = 'lem'
      else if (prefix.includes('proposition')) kind = 'prop'
      else if (prefix.includes('corollary')) kind = 'cor'
      else if (prefix.includes('example')) kind = 'ex'
      else if (prefix.includes('remark')) kind = 'rem'
      else if (prefix.includes('axiom')) kind = 'ax'
      else if (prefix.includes('notation')) kind = 'not'
      else if (prefix.includes('definition')) kind = 'def'
      else if (prefix.includes('intuition')) kind = 'int'

      if (env) {
        const page = env.relativePath || ''
        if (!pageAnchors.has(page)) pageAnchors.set(page, new Set())
        pageAnchors.get(page)!.add(id)
        anchorRegistry.push({ id, page: '/' + page.replace(/index\.md$/, '').replace(/\.md$/, ''), kind })
      }
    }
    const result = origRender(src, env)
    // Write manifest eagerly after first batch of renders (dev mode support)
    ensureManifestWritten()
    return result
  }
}

// Write manifest after build AND eagerly in dev mode
function writeManifest() {
  const manifest: Record<string, string> = {}
  for (const entry of anchorRegistry) {
    // Only keep the first occurrence (earliest page in build order)
    if (!manifest[entry.id]) {
      manifest[entry.id] = entry.page
    }
  }
  try {
    const outPath = resolve(__dirname, '../public/crossref-manifest.json')
    writeFileSync(outPath, JSON.stringify(manifest, null, 2), 'utf-8')
    console.log(`[crossref] Manifest written: ${Object.keys(manifest).length} anchors → ${outPath}`)
  } catch (e) {
    // In dev mode, public/ may not exist yet — silently ignore
  }
}

// Also write manifest after each page render (for dev mode)
let manifestWritten = false
function ensureManifestWritten() {
  if (!manifestWritten && anchorRegistry.length > 0) {
    writeManifest()
    manifestWritten = true
  }
}

// ── Site config ────────────────────────────────────────────────────────
export default defineConfig({
  title: '现代 Galois 理论',
  titleTemplate: ':title · Galois 理论教程',
  description: '从群论基础到现代 Galois 对应的完整理论体系 — 严格、自包含、交互式数学教程',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#1e1b4b' }],
    ['meta', { property: 'og:title', content: '现代 Galois 理论' }],
    ['meta', { property: 'og:description', content: '产品级 Galois 理论教程：从群论基础到无限 Galois 对应' }],
  ],

  lastUpdated: true,
  cleanUrls: true,

  buildEnd: writeManifest,

  markdown: {
    math: true,   // built-in KaTeX via markdown-it-mathjax3
    config: (md) => {
      registerMathContainers(md)
      md.use(crossrefPlugin)
      md.use(crossrefManifestPlugin)
    }
  },

  sitemap: {
    hostname: 'https://author-xyz111.github.io/author_0'
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Galois 理论',

    nav: [
      { text: '首页', link: '/' },
      { text: '知识地图', link: '/knowledge-map' },
      {
        text: '章节',
        items: [
          { text: '第一章 · 群论基础', link: '/chapters/01-groups/' },
          { text: '第二章 · 环与理想', link: '/chapters/02-rings/' },
          { text: '第三章 · 域论基础', link: '/chapters/03-fields/' },
          { text: '第四章 · 多项式', link: '/chapters/04-polynomials/' },
          { text: '第五章 · 分裂域与正规扩张', link: '/chapters/05-splitting-fields/' },
          { text: '第六章 · 代数闭包', link: '/chapters/06-algebraic-closure/' },
          { text: '第七章 · Galois 群', link: '/chapters/07-galois-groups/' },
          { text: '第八章 · Galois 对应', link: '/chapters/08-galois-correspondence/' },
          { text: '第九章 · 可解性与尺规作图', link: '/chapters/09-solvability/' },
          { text: '第十章 · 有限域', link: '/chapters/10-finite-fields/' },
          { text: '第十一章 · 无限 Galois 理论', link: '/chapters/11-infinite-galois/' },
          { text: '第十二章 · 前沿方向', link: '/chapters/12-algebraic-closure/' },
        ]
      },
      {
        text: '参考',
        items: [
          { text: '术语表', link: '/reference/glossary' },
          { text: '记号约定', link: '/reference/notation' },
          { text: '参考文献', link: '/reference/bibliography' },
        ]
      },
      { text: 'GitHub', link: 'https://github.com/author-xyz111/author_0' }
    ],

    sidebar: {
      '/chapters/01-groups/': [
        {
          text: '第一章 · 群论基础',
          items: [
            { text: '概述', link: '/chapters/01-groups/' },
            { text: '1.1 群的定义与基本性质', link: '/chapters/01-groups/1.1-basic-definitions' },
            { text: '1.2 子群与 Lagrange 定理', link: '/chapters/01-groups/1.2-subgroups' },
            { text: '1.3 正规子群与商群', link: '/chapters/01-groups/1.3-normal-subgroups' },
            { text: '1.4 群同态基本定理', link: '/chapters/01-groups/1.4-homomorphisms' },
          ]
        }
      ],
      '/chapters/02-rings/': [
        {
          text: '第二章 · 环与理想',
          items: [
            { text: '概述', link: '/chapters/02-rings/' },
            { text: '2.1 环的定义与基本性质', link: '/chapters/02-rings/2.1-basic-definitions' },
            { text: '2.2 理想与商环', link: '/chapters/02-rings/2.2-ideals' },
            { text: '2.3 多项式环', link: '/chapters/02-rings/2.3-polynomial-rings' },
          ]
        }
      ],
      '/chapters/03-fields/': [
        {
          text: '第三章 · 域论基础',
          items: [
            { text: '概述', link: '/chapters/03-fields/' },
            { text: '3.1 域的定义与基本性质', link: '/chapters/03-fields/3.1-basic-definitions' },
            { text: '3.2 域的基本扩张', link: '/chapters/03-fields/3.2-basic-extensions' },
            { text: '3.3 代数元与极小多项式', link: '/chapters/03-fields/3.3-algebraic-elements' },
          ]
        }
      ],
      '/chapters/04-polynomials/': [
        {
          text: '第四章 · 多项式',
          items: [
            { text: '概述', link: '/chapters/04-polynomials/' },
            { text: '4.1 多项式的一般理论', link: '/chapters/04-polynomials/4.1-general-theory' },
            { text: '4.2 不可约性判据', link: '/chapters/04-polynomials/4.2-irreducibility' },
            { text: '4.3 可分性', link: '/chapters/04-polynomials/4.3-separability' },
          ]
        }
      ],
      '/chapters/05-splitting-fields/': [
        {
          text: '第五章 · 分裂域与正规扩张',
          items: [
            { text: '概述', link: '/chapters/05-splitting-fields/' },
            { text: '5.1 分裂域', link: '/chapters/05-splitting-fields/5.1-splitting-fields' },
            { text: '5.2 正规扩张', link: '/chapters/05-splitting-fields/5.2-normal-extensions' },
          ]
        }
      ],
      '/chapters/06-algebraic-closure/': [
        {
          text: '第六章 · 代数闭包',
          items: [
            { text: '概述', link: '/chapters/06-algebraic-closure/' },
            { text: '6.1 代数闭包的理论', link: '/chapters/06-algebraic-closure/6.1-algebraic-closure' },
          ]
        }
      ],
      '/chapters/07-galois-groups/': [
        {
          text: '第七章 · Galois 群',
          items: [
            { text: '概述', link: '/chapters/07-galois-groups/' },
            { text: '7.1 Galois 群的定义与基本性质', link: '/chapters/07-galois-groups/7.1-definition-and-examples' },
            { text: '7.2 Galois 群的计算', link: '/chapters/07-galois-groups/7.2-computation' },
          ]
        }
      ],
      '/chapters/08-galois-correspondence/': [
        {
          text: '第八章 · Galois 对应',
          items: [
            { text: '概述', link: '/chapters/08-galois-correspondence/' },
            { text: '8.1 基本定理', link: '/chapters/08-galois-correspondence/8.1-fundamental-theorem' },
            { text: '8.2 Galois 扩张的刻画', link: '/chapters/08-galois-correspondence/8.2-galois-extensions' },
          ]
        }
      ],
      '/chapters/09-solvability/': [
        {
          text: '第九章 · 可解性与尺规作图',
          items: [
            { text: '概述', link: '/chapters/09-solvability/' },
            { text: '9.1 可解群与根式解', link: '/chapters/09-solvability/9.1-solvable-groups' },
            { text: '9.2 尺规作图', link: '/chapters/09-solvability/9.2-constructibility' },
          ]
        }
      ],
      '/chapters/10-finite-fields/': [
        {
          text: '第十章 · 有限域',
          items: [
            { text: '概述', link: '/chapters/10-finite-fields/' },
            { text: '10.1 有限域的结构', link: '/chapters/10-finite-fields/10.1-structure' },
            { text: '10.2 Frobenius 自同构', link: '/chapters/10-finite-fields/10.2-frobenius' },
            { text: '10.3 应用', link: '/chapters/10-finite-fields/10.3-applications' },
          ]
        }
      ],
      '/chapters/11-infinite-galois/': [
        {
          text: '第十一章 · 无限 Galois 理论',
          items: [
            { text: '概述', link: '/chapters/11-infinite-galois/' },
            { text: '11.1 Krull 拓扑', link: '/chapters/11-infinite-galois/11.1-krull-topology' },
            { text: '11.2 无限 Galois 对应', link: '/chapters/11-infinite-galois/11.2-galois-correspondence' },
          ]
        }
      ],
      '/chapters/12-algebraic-closure/': [
        {
          text: '第十二章 · 前沿方向',
          items: [
            { text: '概述', link: '/chapters/12-algebraic-closure/' },
            { text: '12.1 逆 Galois 问题', link: '/chapters/12-algebraic-closure/#inverse-galois' },
            { text: '12.2 Grothendieck Galois 理论', link: '/chapters/12-algebraic-closure/#grothendieck-galois' },
            { text: '12.3 Étale 基本群', link: '/chapters/12-algebraic-closure/#etale-fundamental-group' },
            { text: '12.4 Anabelian 几何', link: '/chapters/12-algebraic-closure/#anabelian-geometry' },
            { text: '12.5 Galois 上同调', link: '/chapters/12-algebraic-closure/#galois-cohomology' },
            { text: '12.6 Galois 表示', link: '/chapters/12-algebraic-closure/#galois-representations' },
            { text: '12.7 类域论', link: '/chapters/12-algebraic-closure/#class-field-theory' },
            { text: '12.8 Langlands 纲领', link: '/chapters/12-algebraic-closure/#langlands-program' },
            { text: '12.9 微分 Galois 理论', link: '/chapters/12-algebraic-closure/#differential-galois' },
            { text: '12.10 Tannakian 范畴', link: '/chapters/12-algebraic-closure/#tannakian' },
            { text: '12.11 Étale 上同调', link: '/chapters/12-algebraic-closure/#etale-cohomology' },
            { text: '12.12 Perfectoid 空间', link: '/chapters/12-algebraic-closure/#perfectoid-spaces' },
            { text: '12.13 p-adic Hodge 理论', link: '/chapters/12-algebraic-closure/#p-adic-hodge' },
          ]
        }
      ],
      '/reference/': [
        {
          text: '参考',
          items: [
            { text: '术语表', link: '/reference/glossary' },
            { text: '记号约定', link: '/reference/notation' },
            { text: '参考文献', link: '/reference/bibliography' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/author-xyz111/author_0' }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询',
            footer: { selectText: '选择', navigateText: '导航', closeText: '关闭' }
          }
        }
      }
    },

    footer: {
      message: '现代 Galois 理论 · 产品级数学教程',
      copyright: '基于 MIT 协议发布'
    },

    outline: {
      level: [2, 3],
      label: '本节导航'
    },

    docFooter: {
      prev: '上一节',
      next: '下一节'
    },

    editLink: {
      pattern: 'https://github.com/author-xyz111/author_0/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新于'
    }
  }
})
