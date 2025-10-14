<template>
  <div class="code-panel">
    <div class="code-content">
      <div
        ref="codeContainer"
        class="code-container"
        @click="handleCodeClick"
      >
        <!-- Code content will be rendered here -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { addLineNumbers, scrollToLine } from '../utils/highlight.js'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  activeLine: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['line-click'])

const codeContainer = ref(null)

/**
 * Handle code line clicks
 */
const handleCodeClick = (event) => {
  const target = event.target
  const lineElement = target.closest('.code-line')

  if (lineElement) {
    const lineNumber = parseInt(lineElement.dataset.line)
    emit('line-click', lineNumber)
  }
}

/**
 * Render code with syntax highlighting and line numbers
 */
const renderCode = () => {
  if (codeContainer.value && props.code) {
    addLineNumbers(props.code, codeContainer.value, props.activeLine)
  }
}

/**
 * Update active line highlighting
 */
const updateActiveLine = () => {
  if (!codeContainer.value) return

  // Remove all active classes
  const allLines = codeContainer.value.querySelectorAll('.code-line')
  allLines.forEach(line => line.classList.remove('active'))

  // Add active class to current line
  if (props.activeLine) {
    const activeLineElement = codeContainer.value.querySelector(`[data-line="${props.activeLine}"]`)
    if (activeLineElement) {
      activeLineElement.classList.add('active')
      scrollToLine(codeContainer.value, props.activeLine)
    }
  }
}

// Watch for code changes
watch(() => props.code, () => {
  renderCode()
}, { immediate: true })

// Watch for active line changes
watch(() => props.activeLine, () => {
  updateActiveLine()
}, { immediate: true })

// Initial render
onMounted(() => {
  renderCode()
})
</script>

<style scoped>
.code-panel {
  flex: 1;
  background-color: #1d2021;
  border-right: 2px solid #504945;
  overflow-y: auto;
  padding: 20px;
}

.code-content {
  background-color: #282828;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  height: 100%;
}

.code-container {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-y: auto;
  height: 100%;
}

.code-container :deep(.code-line) {
  display: block;
  padding: 2px 0;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  padding-left: 10px;
  margin-left: -10px;
}

.code-container :deep(.code-line:hover) {
  background-color: rgba(80, 73, 69, 0.3);
  cursor: pointer;
}

.code-container :deep(.code-line.active) {
  background-color: rgba(69, 133, 136, 0.2);
  border-left-color: #458588;
  color: #fbf1c7;
  font-weight: bold;
}

.code-container :deep(.line-number) {
  display: inline-block;
  width: 30px;
  color: #665c54;
  text-align: right;
  margin-right: 15px;
  user-select: none;
}

.code-container :deep(.code-line.active .line-number) {
  color: #ebdbb2;
}

/* Gruvbox syntax highlighting */
.code-container :deep(.hljs) {
  background-color: #282828 !important;
  color: #ebdbb2 !important;
}

.code-container :deep(.hljs-keyword) {
  color: #cc241d !important;
}

.code-container :deep(.hljs-type) {
  color: #d79921 !important;
}

.code-container :deep(.hljs-number) {
  color: #b16286 !important;
}

.code-container :deep(.hljs-string) {
  color: #98971a !important;
}

.code-container :deep(.hljs-comment) {
  color: #928374 !important;
  font-style: italic;
}

.code-container :deep(.hljs-function) {
  color: #98971a !important;
}

.code-container :deep(.hljs-variable) {
  color: #458588 !important;
}

.code-container :deep(.hljs-operator) {
  color: #d65d0e !important;
}

.code-container :deep(.hljs-built_in) {
  color: #d79921 !important;
}

.code-container :deep(.hljs-title) {
  color: #458588 !important;
}

/* Scrollbar styling */
.code-container::-webkit-scrollbar {
  width: 8px;
}

.code-container::-webkit-scrollbar-track {
  background: #1d2021;
}

.code-container::-webkit-scrollbar-thumb {
  background: #504945;
  border-radius: 4px;
}

.code-container::-webkit-scrollbar-thumb:hover {
  background: #665c54;
}
</style>