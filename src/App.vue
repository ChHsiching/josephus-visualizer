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
  console.log('=== DEBUG: App initializeSimulator ===')
  simulator.value = new JosephusSimulator()
  currentStep.value = 0
  activeLine.value = 1

  console.log('Simulator initialized')
  console.log('Total steps:', simulator.value.getTotalSteps())
  console.log('Initial animation state type:', simulator.value.getAnimationState().type)
  console.log('Initial nodes count:', simulator.value.getAnimationState().nodes.length)
  console.log('=== END DEBUG: initializeSimulator ===')
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
  if (simulator.value && simulator.value.nextStep()) {
    currentStep.value = simulator.value.currentStep
    const state = simulator.value.getAnimationState()
    if (state && state.line) {
      activeLine.value = state.line
    }
  }
}

const handleStepBackward = () => {
  if (simulator.value && simulator.value.previousStep()) {
    currentStep.value = simulator.value.currentStep
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
    // Map line numbers to animation steps with fine-grained function-level details
    let targetStep = 0
    const totalSteps = simulator.value.getTotalSteps()

    // RingConstruct function initialization (lines 13-24)
    if (lineNumber >= 13 && lineNumber <= 24) {
      // Detailed initialization steps:
      // Line 13: Creating first node
      if (lineNumber === 13) {
        targetStep = 0
      }
      // Line 14: Setting first node ID
      else if (lineNumber === 14) {
        targetStep = 1
      }
      // Lines 17-21: Node creation loop (5 steps per node)
      else if (lineNumber >= 17 && lineNumber <= 21) {
        const nodeIndex = lineNumber - 17  // 0 to 4
        const nodeId = 2  // Starting from node 2
        targetStep = 2 + (nodeId - 2) * 5 + nodeIndex
      }
      // Line 23: Circular link from last to first
      else if (lineNumber === 23) {
        targetStep = totalSteps - 20 - 3  // Near the end of initialization
      }
      // Line 24: Circular link from first to last
      else if (lineNumber === 24) {
        targetStep = totalSteps - 20 - 2  // Just before main loop starts
      }
    }
    // boundMachine function (lines 28-31)
    else if (lineNumber >= 28 && lineNumber <= 31) {
      // boundMachine call happens in each round
      const round = Math.floor(currentStep.value / 8) + 1
      targetStep = Math.min(25 + (round - 1) * 8, totalSteps - 2)
    }
    // count function (lines 33-40)
    else if (lineNumber >= 33 && lineNumber <= 40) {
      // count function execution in each round
      const round = Math.floor(currentStep.value / 8) + 1
      if (lineNumber === 35) {
        // Initialize q pointer
        targetStep = Math.min(25 + (round - 1) * 8 + 1, totalSteps - 2)
      } else if (lineNumber === 36) {
        // For loop start
        targetStep = Math.min(25 + (round - 1) * 8 + 2, totalSteps - 2)
      } else if (lineNumber === 37) {
        // q = q->next (multiple steps depending on bound)
        const boundIndex = (round - 1) % 4
        const bound = [3, 5, 7, 13][boundIndex]
        const currentStepInRound = (currentStep.value - 25 - (round - 1) * 8) % 8
        if (currentStepInRound >= 3 && currentStepInRound <= 3 + bound - 2) {
          targetStep = currentStep.value  // Stay in current counting step
        } else {
          targetStep = Math.min(25 + (round - 1) * 8 + 3, totalSteps - 2)
        }
      }
    }
    // removeNode function (lines 42-49)
    else if (lineNumber >= 42 && lineNumber <= 49) {
      // removeNode function execution in each round
      const round = Math.floor(currentStep.value / 8) + 1
      if (lineNumber === 43) {
        targetStep = Math.min(25 + (round - 1) * 8 + 5, totalSteps - 2)
      } else if (lineNumber === 44) {
        targetStep = Math.min(25 + (round - 1) * 8 + 6, totalSteps - 2)
      } else if (lineNumber === 45) {
        targetStep = Math.min(25 + (round - 1) * 8 + 7, totalSteps - 2)
      } else if (lineNumber >= 46 && lineNumber <= 49) {
        targetStep = Math.min(25 + (round - 1) * 8 + 8, totalSteps - 2)
      }
    }
    // main function - the actual algorithm (lines 51-61)
    else if (lineNumber >= 51 && lineNumber <= 61) {
      if (lineNumber === 55) {
        targetStep = 0  // RingConstruct call starts
      } else if (lineNumber === 56) {
        targetStep = 25  // Main for loop starts (after initialization)
      } else if (lineNumber === 57) {
        // This maps to count function call
        const round = Math.floor(currentStep.value / 8) + 1
        targetStep = Math.min(25 + (round - 1) * 8, totalSteps - 2)
      } else if (lineNumber === 58) {
        // This maps to removeNode function call
        const round = Math.floor(currentStep.value / 8) + 1
        targetStep = Math.min(25 + (round - 1) * 8 + 5, totalSteps - 2)
      } else if (lineNumber === 60) {
        targetStep = totalSteps - 1  // Complete state: return 0;
      } else {
        // Default to current step for other lines in main
        targetStep = currentStep.value
      }
    }

    // Sync simulator state
    targetStep = Math.max(0, Math.min(targetStep, totalSteps - 1))
    simulator.value.executeToStep(targetStep)
    currentStep.value = simulator.value.currentStep
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