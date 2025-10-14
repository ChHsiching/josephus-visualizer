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
import { ref, computed, onMounted, watch } from 'vue'
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

// Computed properties
const animationState = computed(() => {
  return simulator.value?.getAnimationState() || {
    phase: 'initialization',
    currentLine: 1,
    message: 'Initializing...',
    nodes: [],
    eliminatedNodes: []
  }
})

const totalSteps = computed(() => {
  return simulator.value?.stepHistory.length || 0
})

const isComplete = computed(() => {
  return currentStep.value >= totalSteps.value && totalSteps.value > 0
})

const eliminatedNodes = computed(() => {
  return simulator.value?.eliminationOrder || []
})

// Load C code
const loadCCode = async () => {
  try {
    const response = await fetch('/joseph-ring-algorithm.c')
    const code = await response.text()
    cCode.value = code
  } catch (error) {
    console.error('Failed to load C code:', error)
    // Fallback C code if fetch fails
    cCode.value = `#include<stdlib.h>
#include<stdio.h>
#define N 20
typedef struct node {
    int id;
    struct node* next;
    struct node* pre;
}Node, *pNode;

pNode RingConstruct(int n) {
    int i;
    pNode head, p, q;
    head = (pNode)malloc(sizeof(Node));
    head->id = 1;
    p = head;
    for (i = 2; i <= n; i++) {
        q = (pNode)malloc(sizeof(Node));
        q->id = i;
        p->next = q;
        q->pre = p;
        p = p->next;
    }
    p->next = head;
    head->pre = p;
    return head;
}

int boundMachine(int order) {
    int boundList[4] = { 3, 5, 7, 13 };
    return boundList[(order - 1) % 4];
}

pNode count(pNode first, int bound) {
    pNode q;
    q = first;
    for (int i = 2; i <= bound; i++) {
        q = q->next;
    }
    return q;
}

pNode removeNode(pNode currentNode) {
    pNode first = currentNode->next;
    currentNode->pre->next = currentNode->next;
    first->pre = currentNode->pre;
    printf("%d ", currentNode->id);
    free(currentNode);
    return first;
}

int main() {
    pNode first;
    pNode toRemove;
    int i;
    first = RingConstruct(N);
    for (int i = 1; i <= N; i++) {
        toRemove = count(first, boundMachine(i));
        first = removeNode(toRemove);
    }
    return 0;
}`
  }
}

// Initialize simulator
const initializeSimulator = () => {
  simulator.value = new JosephusSimulator(20)
  currentStep.value = 0
  activeLine.value = 1
}

// Control handlers
const handlePlay = () => {
  if (isComplete.value) return

  isPlaying.value = true

  playInterval.value = setInterval(() => {
    if (currentStep.value < totalSteps.value) {
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
  if (currentStep.value < totalSteps.value) {
    currentStep.value++
    const step = simulator.value.stepHistory[currentStep.value - 1]
    if (step) {
      activeLine.value = step.line
      simulator.value.executeToLine(step.line)
    }
  }
}

const handleStepBackward = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    if (currentStep.value > 0) {
      const step = simulator.value.stepHistory[currentStep.value - 1]
      if (step) {
        activeLine.value = step.line
        simulator.value.executeToLine(step.line)
      }
    } else {
      activeLine.value = 1
      simulator.value.reset()
    }
  }
}

const handleLineClick = (lineNumber) => {
  handlePause()
  activeLine.value = lineNumber

  if (simulator.value) {
    simulator.value.executeToLine(lineNumber)

    // Update current step to match the line
    const stepIndex = simulator.value.stepHistory.findIndex(
      step => step.line === lineNumber
    )
    if (stepIndex !== -1) {
      currentStep.value = stepIndex + 1
    }
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

// Watch for animation speed changes
watch(animationSpeed, (newSpeed) => {
  if (playInterval.value) {
    handlePause()
    handlePlay()
  }
})

// Initialize on mount
onMounted(async () => {
  await loadCCode()
  initializeSimulator()
})
</script>

<style>
@import './styles/gruvbox-dark.scss';

#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-container {
  display: flex;
  flex: 1;
  height: calc(100vh - 80px);
}

/* Global resets */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  overflow: hidden;
}
</style>