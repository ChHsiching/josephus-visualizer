<template>
  <div class="code-panel" @click="handleCodeClick">
    <div class="code-lines">
      <div
        v-for="line in codeLines"
        :key="line.number"
        :class="['code-line', { active: line.number === activeLine }]"
        :data-line="line.number"
      >
        <span class="line-number">{{ line.number }}</span>
        <span class="code-text" v-html="highlightedCode(line.content)"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, nextTick, ref, onMounted } from 'vue'
import { createHighlighter } from 'shiki'

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

// Shiki highlighter instance
const highlighter = ref(null)

/**
 * Initialize Shiki highlighter
 */
const initHighlighter = async () => {
  highlighter.value = await createHighlighter({
    themes: ['one-dark-pro', 'vitesse-dark', 'github-dark'],
    langs: ['c']
  })
}

/**
 * Manual highlighting function using Shiki
 */
const highlightedCode = (code) => {
  if (!highlighter.value) return code

  try {
    return highlighter.value.codeToHtml(code, {
      lang: 'c',
      theme: 'one-dark-pro'
    })
  } catch (error) {
    console.warn('Shiki highlighting failed:', error)
    return code
  }
}

/**
 * Parse the hardcoded C code into lines (pure text)
 */
const codeLines = computed(() => {
  const lines = [
    { number: 1, content: '#include<stdlib.h>' },
    { number: 2, content: '#include<stdio.h>' },
    { number: 3, content: '#define N 20' },
    { number: 4, content: 'typedef struct node {' },
    { number: 5, content: '    int id;' },
    { number: 6, content: '    struct node* next;' },
    { number: 7, content: '    struct node* pre;' },
    { number: 8, content: '}Node, *pNode;' },
    { number: 9, content: '' },
    { number: 10, content: 'pNode RingConstruct(int n) {' },
    { number: 11, content: '    int i;' },
    { number: 12, content: '    pNode head, p, q;' },
    { number: 13, content: '    head = (pNode)malloc(sizeof(Node));' },
    { number: 14, content: '    head->id = 1;' },
    { number: 15, content: '    p = head;' },
    { number: 16, content: '    for (i = 2; i <= n; i++) {' },
    { number: 17, content: '        q = (pNode)malloc(sizeof(Node));' },
    { number: 18, content: '        q->id = i;' },
    { number: 19, content: '        p->next = q;' },
    { number: 20, content: '        q->pre = p;' },
    { number: 21, content: '        p = p->next;' },
    { number: 22, content: '    }' },
    { number: 23, content: '    p->next = head;' },
    { number: 24, content: '    head->pre = p;' },
    { number: 25, content: '    return head;' },
    { number: 26, content: '}' },
    { number: 27, content: '' },
    { number: 28, content: 'int boundMachine(int order) {' },
    { number: 29, content: '    int boundList[4] = { 3, 5, 7, 13 };' },
    { number: 30, content: '    return boundList[(order - 1) % 4];' },
    { number: 31, content: '}' },
    { number: 32, content: '' },
    { number: 33, content: 'pNode count(pNode first, int bound) {' },
    { number: 34, content: '    pNode q;' },
    { number: 35, content: '    q = first;' },
    { number: 36, content: '    for (int i = 2; i <= bound; i++) {' },
    { number: 37, content: '        q = q->next;' },
    { number: 38, content: '    }' },
    { number: 39, content: '    return q;' },
    { number: 40, content: '}' },
    { number: 41, content: '' },
    { number: 42, content: 'pNode removeNode(pNode currentNode) {' },
    { number: 43, content: '    pNode first = currentNode->next;' },
    { number: 44, content: '    currentNode->pre->next = currentNode->next;' },
    { number: 45, content: '    first->pre = currentNode->pre;' },
    { number: 46, content: '    printf("%d ", currentNode->id);' },
    { number: 47, content: '    free(currentNode);' },
    { number: 48, content: '    return first;' },
    { number: 49, content: '}' },
    { number: 50, content: '' },
    { number: 51, content: 'int main() {' },
    { number: 52, content: '    pNode first;' },
    { number: 53, content: '    pNode toRemove;' },
    { number: 54, content: '    int i;' },
    { number: 55, content: '    first = RingConstruct(N);' },
    { number: 56, content: '    for (int i = 1; i <= N; i++) {' },
    { number: 57, content: '        toRemove = count(first, boundMachine(i));' },
    { number: 58, content: '        first = removeNode(toRemove);' },
    { number: 59, content: '    }' },
    { number: 60, content: '    return 0;' },
    { number: 61, content: '}' }
  ]
  return lines
})

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
 * Scroll to active line when it changes
 */
const scrollToActiveLine = async () => {
  await nextTick()
  if (!props.activeLine) return

  const activeElement = document.querySelector(`[data-line="${props.activeLine}"]`)
  if (activeElement) {
    activeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }
}

// Watch for active line changes to scroll
watch(() => props.activeLine, () => {
  scrollToActiveLine()
}, { immediate: true })

// Initialize Shiki on mount
onMounted(() => {
  initHighlighter()
})
</script>

<style scoped>
/* Main editor panel */
.code-panel {
  flex: 1;
  background-color: #282828; /* Editor background */
  border-right: 2px solid #504945;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #ebdbb2; /* Default text color */
}

/* Code lines container */
.code-lines {
  padding: 20px;
  background-color: #282828;
  text-align: left; /* Ensure left alignment */
}

/* Individual code lines - block layout like real editor */
.code-line {
  display: block;
  position: relative;
  min-height: 1.6em;
  white-space: pre;
  padding-left: 50px; /* Space for line numbers */
  border-left: 3px solid transparent;
  transition: background-color 0.15s ease;
}

.code-line:hover {
  background-color: rgba(80, 73, 69, 0.2);
  cursor: pointer;
}

.code-line.active {
  background-color: rgba(69, 133, 136, 0.15);
  border-left-color: #458588;
}

/* Line numbers - positioned like real editor */
.line-number {
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 100%;
  color: #665c54;
  text-align: right;
  padding-right: 10px;
  user-select: none;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.6;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.code-line.active .line-number {
  color: #a89984;
}

/* Code text - main content area */
.code-text {
  color: #ebdbb2;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.6;
  white-space: pre;
}

/* Shiki code highlighting styles */
.code-text :deep(.shiki) {
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.code-text :deep(code) {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  background: none !important;
  padding: 0 !important;
}

/* Scrollbar styling */
.code-panel::-webkit-scrollbar {
  width: 10px;
}

.code-panel::-webkit-scrollbar-track {
  background: #1d2021;
}

.code-panel::-webkit-scrollbar-thumb {
  background: #504945;
  border-radius: 5px;
}

.code-panel::-webkit-scrollbar-thumb:hover {
  background: #665c54;
}
</style>