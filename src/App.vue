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
  activeLine.value = 52  // 修复：从第52行main函数的pNode first;开始，而不是第1行

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
    // Map line numbers to animation steps with line-by-line execution details
    let targetStep = 0
    const totalSteps = simulator.value.getTotalSteps()

    // main函数开始 (lines 54-62)
    if (lineNumber >= 54 && lineNumber <= 62) {
      if (lineNumber === 54) {
        targetStep = 1  // pNode first;
      } else if (lineNumber === 55) {
        targetStep = 2  // pNode toRemove;
      } else if (lineNumber === 56) {
        targetStep = 3  // int i;
      } else if (lineNumber === 57) {
        targetStep = 4  // first = RingConstruct(N);
      } else if (lineNumber === 58) {
        targetStep = 115  // for (int i = 1; i <= N; i++)
      } else if (lineNumber === 59) {
        // This maps to count function call in current round
        const round = Math.floor(currentStep.value / 10) + 1
        targetStep = Math.min(116 + (round - 1) * 10, totalSteps - 2)
      } else if (lineNumber === 60) {
        // This maps to removeNode function call in current round
        const round = Math.floor(currentStep.value / 10) + 1
        targetStep = Math.min(124 + (round - 1) * 10, totalSteps - 2)
      } else if (lineNumber === 61) {
        targetStep = 316  // for loop结束
      } else if (lineNumber === 62) {
        targetStep = 317  // return 0;
      }
    }
    // RingConstruct函数 (lines 11-25)
    else if (lineNumber >= 11 && lineNumber <= 25) {
      if (lineNumber === 11) {
        targetStep = 5  // int i; pNode head, p, q;
      } else if (lineNumber === 13) {
        targetStep = 6  // head = malloc()
      } else if (lineNumber === 14) {
        targetStep = 7  // head->id = 1;
      } else if (lineNumber === 15) {
        targetStep = 8  // p = head;
      } else if (lineNumber === 16) {
        targetStep = 9  // for循环开始
      }
      // Lines 17-21: for循环体 (每个节点5步)
      else if (lineNumber >= 17 && lineNumber <= 21) {
        // 根据当前所在回合和具体行号计算目标步骤
        const stepInLoop = lineNumber - 17  // 0 to 4
        // 找到当前在哪个节点的创建过程中
        let currentRound = Math.floor((currentStep.value - 10) / 5) + 2
        if (currentRound < 2 || currentRound > 20) {
          currentRound = 2  // 默认从第2个节点开始
        }
        targetStep = 10 + (currentRound - 2) * 5 + stepInLoop
        targetStep = Math.max(10, Math.min(targetStep, 109))  // 限制在for循环范围内
      } else if (lineNumber === 22) {
        targetStep = 110  // for循环结束
      } else if (lineNumber === 23) {
        targetStep = 111  // p->next = head;
      } else if (lineNumber === 24) {
        targetStep = 112  // head->pre = p;
      } else if (lineNumber === 25) {
        targetStep = 113  // return head;
      }
    }
    // boundMachine function (lines 28-31)
    else if (lineNumber >= 28 && lineNumber <= 31) {
      const round = Math.floor(currentStep.value / 10) + 1
      if (lineNumber === 29) {
        targetStep = Math.min(117 + (round - 1) * 10, totalSteps - 2)
      } else if (lineNumber === 30) {
        targetStep = Math.min(118 + (round - 1) * 10, totalSteps - 2)
      }
    }
    // count function (lines 33-40)
    else if (lineNumber >= 33 && lineNumber <= 40) {
      const round = Math.floor(currentStep.value / 10) + 1
      if (lineNumber === 34) {
        targetStep = Math.min(119 + (round - 1) * 10, totalSteps - 2)
      } else if (lineNumber === 35) {
        targetStep = Math.min(120 + (round - 1) * 10, totalSteps - 2)
      } else if (lineNumber === 36) {
        targetStep = Math.min(121 + (round - 1) * 10, totalSteps - 2)
      } else if (lineNumber === 37) {
        // q = q->next (multiple steps depending on bound)
        const bounds = [3, 5, 7, 13]
        const bound = bounds[(round - 1) % 4]
        const currentStepInRound = (currentStep.value - 116 - (round - 1) * 10) % 10

        if (currentStepInRound >= 6 && currentStepInRound <= 6 + bound - 2) {
          targetStep = currentStep.value  // Stay in current counting step
        } else {
          targetStep = Math.min(122 + (round - 1) * 10, totalSteps - 2)
        }
      } else if (lineNumber === 39) {
        targetStep = Math.min(123 + (round - 1) * 10, totalSteps - 2)
      }
    }
    // removeNode function (lines 42-49)
    else if (lineNumber >= 42 && lineNumber <= 49) {
      const round = Math.floor(currentStep.value / 10) + 1
      if (lineNumber === 44) {
        targetStep = Math.min(125 + (round - 1) * 10, totalSteps - 2)
      } else if (lineNumber === 45) {
        targetStep = Math.min(126 + (round - 1) * 10, totalSteps - 2)
      } else if (lineNumber === 46) {
        targetStep = Math.min(127 + (round - 1) * 10, totalSteps - 2)
      } else if (lineNumber === 48) {
        targetStep = Math.min(128 + (round - 1) * 10, totalSteps - 2)
      } else if (lineNumber === 49) {
        targetStep = Math.min(129 + (round - 1) * 10, totalSteps - 2)
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