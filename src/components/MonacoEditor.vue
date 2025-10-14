<template>
  <div class="monaco-editor-panel" ref="editorContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'

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

const editorContainer = ref(null)
let editor = null
let decorations = []

/**
 * Initialize Monaco Editor
 */
const initEditor = async () => {
  if (!editorContainer.value) return

  try {
    // Create editor instance with minimal config
    editor = monaco.editor.create(editorContainer.value, {
      value: props.code,
      language: 'c',
      theme: 'vs-dark',
      readOnly: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineHeight: 1.6,
      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
      lineNumbers: 'on',
      glyphMargin: false,
      folding: false,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 3,
      renderWhitespace: 'none',
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
      overviewRulerLanes: 0
    })
  } catch (error) {
    console.error('Failed to initialize Monaco Editor:', error)
  }

  // Add click handler for line numbers
  editor.onMouseDown((e) => {
    if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
      const lineNumber = e.target.position.lineNumber
      emit('line-click', lineNumber)
    }
  })

  // Set initial active line
  if (props.activeLine) {
    highlightActiveLine(props.activeLine)
  }
}

/**
 * Highlight active line
 */
const highlightActiveLine = (lineNumber) => {
  if (!editor) return

  // Clear previous decorations
  decorations = editor.deltaDecorations(decorations, [])

  if (lineNumber > 0) {
    const newDecorations = [
      {
        range: new monaco.Range(
          lineNumber,
          1,
          lineNumber,
          1
        ),
        options: {
          isWholeLine: true,
          className: 'active-line-highlight',
          glyphMarginClassName: 'active-line-glyph'
        }
      }
    ]
    decorations = editor.deltaDecorations(decorations, newDecorations)
  }
}

/**
 * Update editor content
 */
const updateEditorContent = () => {
  if (!editor) return

  const currentContent = editor.getValue()
  if (currentContent !== props.code) {
    editor.setValue(props.code)
  }
}

/**
 * Scroll to active line
 */
const scrollToActiveLine = async () => {
  if (!editor || !props.activeLine) return

  await nextTick()
  editor.revealLineInCenter(props.activeLine)
}

// Watch for prop changes
watch(() => props.code, () => {
  updateEditorContent()
})

watch(() => props.activeLine, (newLine) => {
  highlightActiveLine(newLine)
  scrollToActiveLine()
}, { immediate: true })

// Handle resize
const handleResize = () => {
  if (editor) {
    editor.layout()
  }
}

onMounted(() => {
  initEditor()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (editor) {
    editor.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.monaco-editor-panel {
  width: 100%;
  height: 100%;
  background-color: #1e1e1e;
}

/* Custom styles for active line highlighting */
:global(.active-line-highlight) {
  background-color: rgba(0, 122, 204, 0.1) !important;
}

:global(.active-line-glyph) {
  background-color: rgba(0, 122, 204, 0.3) !important;
  width: 3px !important;
}

/* Hide cursor for read-only mode */
:global(.monaco-editor.vs-dark .cursor) {
  display: none !important;
}

/* Ensure proper scrollbar styling */
:global(.monaco-editor .monaco-scrollable-element) {
  scrollbar-width: thin;
  scrollbar-color: #424242 transparent;
}

:global(.monaco-editor .monaco-scrollable-element::-webkit-scrollbar) {
  width: 10px;
  height: 10px;
}

:global(.monaco-editor .monaco-scrollable-element::-webkit-scrollbar-track) {
  background: transparent;
}

:global(.monaco-editor .monaco-scrollable-element::-webkit-scrollbar-thumb) {
  background-color: #424242;
  border-radius: 5px;
}

:global(.monaco-editor .monaco-scrollable-element::-webkit-scrollbar-thumb:hover) {
  background-color: #4f4f4f;
}
</style>