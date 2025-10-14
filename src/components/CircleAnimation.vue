<template>
  <div class="animation-panel">
    <div class="animation-container">
      <svg
        ref="svgContainer"
        :width="svgSize"
        :height="svgSize"
        viewBox="0 0 700 700"
        class="circle-svg"
      >
        <!-- Render circle links -->
        <g class="links">
          <circle-link
            v-for="link in links"
            :key="`link-${link.from}-${link.to}`"
            :link="link"
            :active="activeLinks.has(`${link.from}-${link.to}`)"
          />
        </g>

        <!-- Render nodes -->
        <g class="nodes">
          <circle-node
            v-for="node in nodes"
            :key="node.id"
            :node="node"
            :position="getNodePosition(node.id, 20)"
            :active="activeNodeId === node.id"
            :to-remove="nodesToRemove.includes(node.id)"
            :removed="!node.exists"
            :class="{ 'node-visible': node.exists }"
            @node-click="handleNodeClick"
          />
        </g>

        <!-- Center info -->
        <g class="center-info">
          <text
            x="300"
            y="300"
            text-anchor="middle"
            class="info-text"
          >
            {{ animationMessage }}
          </text>

          <text
            x="300"
            y="320"
            text-anchor="middle"
            class="round-text"
            v-if="currentRound > 0"
          >
            Round: {{ currentRound }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import CircleNode from './CircleNode.vue'
import CircleLink from './CircleLink.vue'

const props = defineProps({
  animationState: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['animation-complete'])

const svgContainer = ref(null)
const svgSize = 600

// Computed properties
const nodes = computed(() => props.animationState.nodes || [])
const existingNodes = computed(() => nodes.value.filter(n => n.exists))
const activeNodeId = computed(() => props.animationState.activeNode?.id)
const nodesToRemove = computed(() => props.animationState.nodesToRemove?.map(n => n.id) || [])
const activeLinks = computed(() => {
  const links = new Set()
  const activeNode = props.animationState.activeNode

  if (activeNode && activeNode.exists) {
    // Add links from and to active node
    links.add(`${activeNode.prev?.id || 0}-${activeNode.id}`)
    links.add(`${activeNode.id}-${activeNode.next?.id || 0}`)
  }

  return links
})

const currentRound = computed(() => {
  const eliminatedCount = props.animationState.eliminatedNodes?.length || 0
  return eliminatedCount + 1
})

const animationMessage = computed(() => {
  return props.animationState.message || 'Ready to start'
})

const links = computed(() => {
  const nodeLinks = []
  const existingNodes = nodes.value.filter(n => n.exists)

  existingNodes.forEach(node => {
    const nextNode = nodes.value.find(n => n.id === node.next?.id)
    if (nextNode && nextNode.exists) {
      nodeLinks.push({
        from: node.id,
        to: nextNode.id,
        fromPos: getNodePosition(node.id, 20),
        toPos: getNodePosition(nextNode.id, 20)
      })
    }
  })

  return nodeLinks
})

/**
 * Get position for node in circular layout
 */
function getNodePosition(nodeId, totalNodes) {
  // Fixed: Always use 20 nodes for circular layout
  const angle = (nodeId - 1) * (2 * Math.PI / 20) - Math.PI / 2
  const radius = 250  // Increased from 200 to 250
  const centerX = 350
  const centerY = 350

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  }
}

/**
 * Handle node click events
 */
const handleNodeClick = (nodeId) => {
  // Could be used for interaction or debugging
  console.log('Node clicked:', nodeId)
}

/**
 * Trigger animations based on state changes
 */
const triggerAnimations = async () => {
  await nextTick()

  if (!svgContainer.value) return

  const phase = props.animationState.type

  switch (phase) {
    case 'initialization':
      await animateInitialization()
      break
    case 'counting':
      await animateCountingPhase()
      break
    case 'removing':
      await animateRemovalPhase()
      break
    case 'complete':
      await animateCompletion()
      break
  }
}

/**
 * Simple CSS-based animation helpers
 */
const applyNodeClass = (element, className) => {
  // Remove existing node classes
  element.className = element.className.replace(/\bnode-\w+/g, '')
  // Add new class
  element.classList.add(className)
}

/**
 * Animate ring initialization
 */
const animateInitialization = () => {
  // Add staggered entrance animation for nodes
  const nodes = document.querySelectorAll('.circle-node')
  nodes.forEach((node, index) => {
    setTimeout(() => {
      node.style.opacity = '1'
    }, index * 50)
  })
}

/**
 * Animate counting phase
 */
const animateCountingPhase = () => {
  // Animation is now handled by Vue's reactive class bindings
  console.log('Counting phase animation for node:', props.animationState.activeNode?.id)
}

/**
 * Animate removal phase
 */
const animateRemovalPhase = () => {
  // Animation is now handled by Vue's reactive class bindings
  // Emit completion after a short delay for visual feedback
  setTimeout(() => {
    emit('animation-complete')
  }, 500)
}

/**
 * Animate completion
 */
const animateCompletion = () => {
  // Animation is now handled by Vue's reactive class bindings
  console.log('Completion animation started')
}

// Watch for animation state changes
watch(() => props.animationState, () => {
  triggerAnimations()
}, { deep: true, immediate: true })

onMounted(() => {
  triggerAnimations()
})
</script>

<style scoped>
.animation-panel {
  flex: 1;
  background-color: #1d2021;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.animation-container {
  width: 90%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-svg {
  width: 100%;
  height: 100%;
  max-width: 600px;
  max-height: 600px;
}

.info-text {
  fill: #ebdbb2;
  font-size: 16px;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
}

.round-text {
  fill: #928374;
  font-size: 14px;
  text-anchor: middle;
  dominant-baseline: middle;
}

/* Node animation classes */
.circle-node {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.circle-node.node-visible {
  opacity: 1;
}

.circle-node.node-removed {
  opacity: 0.3;
}


/* Responsive design */
@media (max-width: 768px) {
  .animation-container {
    width: 95%;
    height: 95%;
  }

  .circle-svg {
    max-width: 400px;
    max-height: 400px;
  }

  .info-text {
    font-size: 14px;
  }

  .round-text {
    font-size: 12px;
  }
}
</style>