<template>
  <div class="proof-explorer" :class="{ 'proof-explorer--expanded': expanded }">
    <div class="proof-explorer__header" @click="expanded = !expanded">
      <div class="proof-explorer__header-left">
        <svg class="proof-explorer__icon" :class="{ 'proof-explorer__icon--rotated': expanded }" width="16" height="16" viewBox="0 0 16 16">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="proof-explorer__title">
          <span class="proof-explorer__label">证明</span>
          <span v-if="of" class="proof-explorer__of">{{ of }}</span>
        </span>
      </div>
      <div class="proof-explorer__header-right">
        <span v-if="strategy" class="proof-explorer__strategy">{{ strategy }}</span>
        <span class="proof-explorer__step-count">{{ currentStep + 1 }} / {{ totalSteps }}</span>
      </div>
    </div>

    <Transition name="proof-explorer-slide">
      <div v-show="expanded" class="proof-explorer__body">
        <!-- Strategy overview -->
        <div v-if="strategy" class="proof-explorer__overview">
          <span class="proof-explorer__overview-label">策略：</span>
          <span class="proof-explorer__overview-text">{{ strategy }}</span>
        </div>

        <!-- Steps navigation -->
        <div class="proof-explorer__steps">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="proof-explorer__step"
            :class="{
              'proof-explorer__step--active': i === currentStep,
              'proof-explorer__step--done': i < currentStep,
              'proof-explorer__step--pending': i > currentStep
            }"
          >
            <div class="proof-explorer__step-indicator" @click="goToStep(i)">
              <span class="proof-explorer__step-num">{{ i + 1 }}</span>
            </div>
            <div class="proof-explorer__step-content">
              <div v-if="step.label" class="proof-explorer__step-label">{{ step.label }}</div>
              <div class="proof-explorer__step-text" v-html="step.text"></div>
              <div v-if="step.note" class="proof-explorer__step-note">
                <span class="proof-explorer__step-note-icon">💡</span>
                {{ step.note }}
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation buttons -->
        <div class="proof-explorer__nav">
          <button
            class="proof-explorer__btn proof-explorer__btn--prev"
            :disabled="currentStep === 0"
            @click="prevStep"
          >
            ← 上一步
          </button>
          <div class="proof-explorer__progress">
            <div
              v-for="(_, i) in steps"
              :key="i"
              class="proof-explorer__dot"
              :class="{ 'proof-explorer__dot--active': i === currentStep, 'proof-explorer__dot--done': i < currentStep }"
              @click="goToStep(i)"
            ></div>
          </div>
          <button
            class="proof-explorer__btn proof-explorer__btn--next"
            :disabled="currentStep >= totalSteps - 1"
            @click="nextStep"
          >
            下一步 →
          </button>
        </div>

        <!-- Summary -->
        <div v-if="summary && currentStep >= totalSteps - 1" class="proof-explorer__summary">
          <span class="proof-explorer__summary-icon">✅</span>
          <span class="proof-explorer__summary-text">{{ summary }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ProofStep {
  label?: string
  text: string
  note?: string
}

const props = defineProps<{
  of?: string
  strategy?: string
  steps: ProofStep[]
  summary?: string
  defaultExpanded?: boolean
}>()

const expanded = ref(props.defaultExpanded ?? false)
const currentStep = ref(0)

const totalSteps = computed(() => props.steps.length)

function goToStep(i: number) {
  currentStep.value = Math.max(0, Math.min(i, totalSteps.value - 1))
}

function nextStep() {
  if (currentStep.value < totalSteps.value - 1) currentStep.value++
}

function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}
</script>

<style scoped>
.proof-explorer {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  margin: 16px 0;
  background: var(--vp-c-bg);
  transition: box-shadow 0.2s;
}

.proof-explorer:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.proof-explorer--expanded {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.proof-explorer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid transparent;
  transition: background 0.2s;
}

.proof-explorer--expanded .proof-explorer__header {
  border-bottom-color: var(--vp-c-divider);
}

.proof-explorer__header:hover {
  background: var(--vp-c-bg-alt);
}

.proof-explorer__header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.proof-explorer__icon {
  transition: transform 0.25s ease;
  color: var(--vp-c-text-3);
}

.proof-explorer__icon--rotated {
  transform: rotate(180deg);
}

.proof-explorer__label {
  font-weight: 700;
  color: var(--env-proof-text);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.proof-explorer__of {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin-left: 8px;
}

.proof-explorer__header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.proof-explorer__strategy {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  padding: 2px 8px;
  background: var(--vp-c-bg-alt);
  border-radius: 4px;
  font-style: italic;
}

.proof-explorer__step-count {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

/* Body */
.proof-explorer__body {
  padding: 0;
}

.proof-explorer__overview {
  padding: 10px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.88rem;
}

.proof-explorer__overview-label {
  font-weight: 600;
  color: var(--env-proof-text);
}

.proof-explorer__overview-text {
  color: var(--vp-c-text-2);
}

/* Steps */
.proof-explorer__steps {
  padding: 16px;
}

.proof-explorer__step {
  display: flex;
  gap: 14px;
  padding: 10px 0;
  opacity: 0.45;
  transition: opacity 0.3s;
}

.proof-explorer__step--active {
  opacity: 1;
}

.proof-explorer__step--done {
  opacity: 0.7;
}

.proof-explorer__step-indicator {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  transition: all 0.2s;
}

.proof-explorer__step--active .proof-explorer__step-indicator {
  background: var(--galois-primary);
  border-color: var(--galois-primary);
}

.proof-explorer__step--done .proof-explorer__step-indicator {
  background: var(--env-proof-bg);
  border-color: var(--env-proof-text);
}

.proof-explorer__step-num {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-3);
}

.proof-explorer__step--active .proof-explorer__step-num {
  color: #fff;
}

.proof-explorer__step--done .proof-explorer__step-num {
  color: var(--env-proof-text);
}

.proof-explorer__step-content {
  flex: 1;
  min-width: 0;
}

.proof-explorer__step-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--env-proof-text);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 3px;
}

.proof-explorer__step-text {
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}

.proof-explorer__step-note {
  margin-top: 6px;
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  font-style: italic;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.proof-explorer__step-note-icon {
  flex-shrink: 0;
}

/* Navigation */
.proof-explorer__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.proof-explorer__btn {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.15s;
}

.proof-explorer__btn:hover:not(:disabled) {
  border-color: var(--galois-primary);
  color: var(--galois-primary);
}

.proof-explorer__btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.proof-explorer__progress {
  display: flex;
  gap: 6px;
}

.proof-explorer__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.2s;
}

.proof-explorer__dot--active {
  background: var(--galois-primary);
  transform: scale(1.3);
}

.proof-explorer__dot--done {
  background: var(--env-proof-text);
}

/* Summary */
.proof-explorer__summary {
  padding: 12px 16px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--env-proof-bg);
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.88rem;
  color: var(--vp-c-text-1);
}

.proof-explorer__summary-icon {
  flex-shrink: 0;
}

/* Slide transition */
.proof-explorer-slide-enter-active,
.proof-explorer-slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.proof-explorer-slide-enter-from,
.proof-explorer-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.proof-explorer-slide-enter-to,
.proof-explorer-slide-leave-from {
  max-height: 2000px;
  opacity: 1;
}
</style>
