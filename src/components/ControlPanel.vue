<template>
  <div class="control-panel">
    <div class="button-group">
      <button
        @click="handlePlay"
        :disabled="isPlaying || isComplete"
        class="control-btn play-btn"
      >
        ▶️ Play
      </button>

      <button
        @click="handlePause"
        :disabled="!isPlaying"
        class="control-btn pause-btn"
      >
        ⏸️ Pause
      </button>

      <button
        @click="handleReset"
        class="control-btn reset-btn"
      >
        🔄 Reset
      </button>

      <button
        @click="handleStepForward"
        :disabled="isPlaying || isComplete"
        class="control-btn step-btn"
      >
        ⏭️ Step
      </button>

      <button
        @click="handleStepBackward"
        :disabled="isPlaying || currentStep <= 1"
        class="control-btn step-btn"
      >
        ⏮️ Back
      </button>
    </div>

    <div class="speed-control">
      <label for="speed-slider">Animation Speed:</label>
      <input
        id="speed-slider"
        type="range"
        min="0.5"
        max="3"
        step="0.5"
        v-model="animationSpeed"
        @change="handleSpeedChange"
      />
      <span>{{ animationSpeed }}x</span>
    </div>

    <div class="progress-info">
      <span>Step: {{ currentStep }} / {{ totalSteps }}</span>
      <span v-if="eliminatedNodes.length > 0">
        Eliminated: {{ eliminatedNodes.join(', ') }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  currentStep: {
    type: Number,
    default: 0
  },
  totalSteps: {
    type: Number,
    default: 0
  },
  isPlaying: {
    type: Boolean,
    default: false
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  eliminatedNodes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'play',
  'pause',
  'reset',
  'step-forward',
  'step-backward',
  'speed-change'
])

const animationSpeed = ref(1)

const isComplete = computed(() => {
  return props.currentStep >= props.totalSteps && props.totalSteps > 0
})

const handlePlay = () => {
  emit('play')
}

const handlePause = () => {
  emit('pause')
}

const handleReset = () => {
  emit('reset')
}

const handleStepForward = () => {
  emit('step-forward')
}

const handleStepBackward = () => {
  emit('step-backward')
}

const handleSpeedChange = () => {
  emit('speed-change', parseFloat(animationSpeed.value))
}
</script>

<style scoped>
.control-panel {
  height: 60px; /* Match gruvbox.scss height */
  background-color: #3c3836;
  border-top: 2px solid #504945;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 20px;
  flex-wrap: wrap;
  position: relative; /* Ensure it stays visible */
  z-index: 10; /* Higher z-index to stay on top */
}

.button-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-btn {
  padding: 10px 16px;
  background-color: #458588;
  color: #ebdbb2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 80px;
  justify-content: center;
}

.control-btn:hover:not(:disabled) {
  background-color: #83a598;
  transform: translateY(-1px);
}

.control-btn:active:not(:disabled) {
  transform: translateY(0);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-btn:hover:not(:disabled) {
  background-color: #8ec07c;
}

.pause-btn:hover:not(:disabled) {
  background-color: #fabd2f;
}

.reset-btn:hover:not(:disabled) {
  background-color: #d3869b;
}

.step-btn:hover:not(:disabled) {
  background-color: #fe8019;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.speed-control label {
  color: #ebdbb2;
  font-size: 14px;
  white-space: nowrap;
}

.speed-control input[type="range"] {
  width: 120px;
  height: 4px;
  background: #504945;
  outline: none;
  border-radius: 2px;
  -webkit-appearance: none;
}

.speed-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #458588;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.speed-control input[type="range"]::-webkit-slider-thumb:hover {
  background: #83a598;
}

.speed-control span {
  color: #a89984;
  font-size: 14px;
  min-width: 40px;
}

.progress-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.progress-info span {
  color: #a89984;
  font-size: 13px;
  text-align: right;
}

.progress-info span:first-child {
  color: #ebdbb2;
  font-weight: bold;
}

/* Responsive design */
@media (max-width: 768px) {
  .control-panel {
    height: auto;
    min-height: 80px;
    padding: 15px;
    flex-direction: column;
    gap: 15px;
  }

  .button-group {
    order: 1;
    flex-wrap: wrap;
    justify-content: center;
  }

  .speed-control {
    order: 2;
    justify-content: center;
  }

  .progress-info {
    order: 3;
    align-items: center;
    text-align: center;
  }

  .control-btn {
    min-width: 70px;
    font-size: 12px;
    padding: 8px 12px;
  }

  .speed-control input[type="range"] {
    width: 100px;
  }
}

@media (max-width: 480px) {
  .control-panel {
    padding: 10px;
    gap: 10px;
  }

  .button-group {
    gap: 5px;
  }

  .control-btn {
    min-width: 60px;
    padding: 6px 8px;
    font-size: 11px;
  }

  .progress-info span {
    font-size: 12px;
  }
}
</style>