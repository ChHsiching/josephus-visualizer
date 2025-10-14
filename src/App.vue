<template>
  <div id="app">
    <div class="main-container">
      <!-- Left Panel: Code Display -->
      <CodeDisplay
        :code="cCode"
        :active-line="activeLine"
        @line-click="handleLineClick"
      />

      <!-- Right Panel: Animation -->
      <CircleAnimation
        :animation-state="animationState"
        @animation-complete="handleAnimationComplete"
      />
    </div>

    <!-- Control Panel -->
    <ControlPanel
      :current-step="currentStep"
      :total-steps="totalSteps"
      :is-playing="isPlaying"
      :is-complete="isComplete"
      :eliminated-nodes="eliminatedNodes"
      @play="handlePlay"
      @pause="handlePause"
      @reset="handleReset"
      @step-forward="handleStepForward"
      @step-backward="handleStepBackward"
      @speed-change="handleSpeedChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CodeDisplay from './components/CodeDisplay.vue'
import CircleAnimation from './components/CircleAnimation.vue'
import ControlPanel from './components/ControlPanel.vue'
import { JosephusSimulator } from './utils/josephus-simulator.js'

// Reactive state
const simulator = ref(null)
const cCode = ref('')
const activeLine = ref(1)
const currentStep = ref(0)
const isPlaying = ref(false)
const animationSpeed = ref(1)
const playInterval = ref(null)

// Performance optimization: debounce state
const isExecuting = ref(false)
const lineClickDebounce = ref(null)

// Computed properties
const animationState = computed(() => {
  return simulator.value?.getAnimationState() || {
    type: 'initialization',
    message: 'Initializing...',
    nodes: [],
    activeNode: null,
    nodesToRemove: []
  }
})

const totalSteps = computed(() => {
  return simulator.value?.getTotalSteps() || 0
})

const isComplete = computed(() => {
  return currentStep.value >= totalSteps.value && totalSteps.value > 0
})

const eliminatedNodes = computed(() => {
  const state = simulator.value?.getAnimationState()
  if (!state) return []
  return state.nodes.filter(n => !n.exists).map(n => n.id)
})

// Initialize with dummy content (real code is now in CodeDisplay component)
const initializeCCode = () => {
  cCode.value = "dummy"
}

// Initialize simulator
const initializeSimulator = () => {
  simulator.value = new JosephusSimulator()
  currentStep.value = 0
  activeLine.value = 1
}

// Control handlers
const handlePlay = () => {
  if (isComplete.value) return

  isPlaying.value = true

  playInterval.value = setInterval(() => {
    if (currentStep.value < totalSteps.value - 1) {
      handleStepForward()
    } else {
      handlePause()
    }
  }, 2000 / animationSpeed.value)
}

const handlePause = () => {
  isPlaying.value = false
  if (playInterval.value) {
    clearInterval(playInterval.value)
    playInterval.value = null
  }
}

const handleReset = () => {
  handlePause()
  initializeSimulator()
}

const handleStepForward = () => {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
    simulator.value.executeToStep(currentStep.value)
    const state = simulator.value.getAnimationState()
    if (state && state.line) {
      activeLine.value = state.line
    }
  }
}

const handleStepBackward = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    simulator.value.executeToStep(currentStep.value)
    const state = simulator.value.getAnimationState()
    if (state && state.line) {
      activeLine.value = state.line
    } else {
      activeLine.value = 1
    }
  }
}

const handleLineClick = (lineNumber) => {
  handlePause()
  activeLine.value = lineNumber

  if (simulator.value) {
    // Map line numbers to animation steps
    let targetStep = 0
    if (lineNumber >= 10 && lineNumber <= 26) {
      targetStep = 0  // Initialization
    } else if (lineNumber >= 58 && lineNumber <= 60) {
      // Calculate round based on current step
      const round = Math.floor((currentStep.value - 1) / 2) + 1
      if (lineNumber === 58) {
        targetStep = 1 + (round - 1) * 2  // Counting phase
      } else if (lineNumber === 59) {
        targetStep = 1 + (round - 1) * 2  // Counting phase
      } else if (lineNumber === 60) {
        targetStep = 2 + (round - 1) * 2  // Removal phase
      }
    }

    currentStep.value = Math.min(targetStep, simulator.value.getTotalSteps() - 1)
  }
}

const handleSpeedChange = (newSpeed) => {
  animationSpeed.value = newSpeed

  // If currently playing, restart interval with new speed
  if (isPlaying.value) {
    handlePause()
    handlePlay()
  }
}

const handleAnimationComplete = () => {
  // Animation completed, could trigger next step if playing
}

// Cleanup on unmount to prevent memory leaks
onUnmounted(() => {
  handlePause() // Clear any running intervals

  // Clear debounce timers
  if (lineClickDebounce.value) {
    clearTimeout(lineClickDebounce.value)
    lineClickDebounce.value = null
  }
})

// Initialize on mount
onMounted(() => {
  initializeCCode()
  initializeSimulator()
})
</script>

<style>
@import './styles/gruvbox-dark.scss';

/* App-specific overrides */
.main-container {
  display: flex;
  flex: 1;
  height: calc(100vh - 80px); /* Fixed height calculation */
  overflow: hidden;
}

/* Ensure control panel is always visible */
.control-panel {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1000 !important;
  height: 80px !important;
  background-color: #3c3836 !important;
  border-top: 2px solid #504945 !important;
}

/* Global resets are already in gruvbox-dark.scss */
</style>