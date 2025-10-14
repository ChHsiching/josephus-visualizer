<template>
  <div class="animation-panel">
    <div class="animation-container">
      <svg
        ref="svgContainer"
        :width="svgSize"
        :height="svgSize"
        viewBox="0 0 600 600"
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
            :position="getNodePosition(node.id, existingNodes.length)"
            :active="activeNodeId === node.id"
            :to-remove="nodesToRemove.includes(node.id)"
            :removed="!node.exists"
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
import { animateNodeHighlight, animateNodeRemoval, animateCounting, animatePulse } from '../utils/highlight.js'
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
        fromPos: getNodePosition(node.id, existingNodes.length),
        toPos: getNodePosition(nextNode.id, existingNodes.length)
      })
    }
  })

  return nodeLinks
})

/**
 * Get position for node in circular layout
 */
function getNodePosition(nodeId, totalNodes) {
  const angle = (nodeId - 1) * (2 * Math.PI / totalNodes) - Math.PI / 2
  const radius = 200
  const centerX = 300
  const centerY = 300

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

  const phase = props.animationState.phase

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
 * Animate ring initialization
 */
const animateInitialization = async () => {
  const nodeElements = svgContainer.value.querySelectorAll('.circle-node')

  for (let i = 0; i < nodeElements.length; i++) {
    const node = nodeElements[i]
    node.style.opacity = '0'
    node.style.transform = 'scale(0.5)'
  }

  setTimeout(() => {
    animatePulse(nodeElements, false)
    nodeElements.forEach((node, index) => {
      node.style.transition = `all 0.5s ease ${index * 0.1}s`
      node.style.opacity = '1'
      node.style.transform = 'scale(1)'
    })
  }, 100)
}

/**
 * Animate counting phase
 */
const animateCountingPhase = async () => {
  if (!props.animationState.activeNode) return

  const activeElement = svgContainer.value.querySelector(`.circle-node[data-node-id="${props.animationState.activeNode.id}"]`)
  if (activeElement) {
    animatePulse(activeElement, true)
  }
}

/**
 * Animate removal phase
 */
const animateRemovalPhase = async () => {
  const nodeToRemove = props.animationState.nodesToRemove?.[0]
  if (!nodeToRemove) return

  const element = svgContainer.value.querySelector(`.circle-node[data-node-id="${nodeToRemove.id}"]`)
  if (element) {
    animateNodeRemoval(element, () => {
      emit('animation-complete')
    })
  }
}

/**
 * Animate completion
 */
const animateCompletion = async () => {
  const remainingNodes = svgContainer.value.querySelectorAll('.circle-node:not(.removed)')

  remainingNodes.forEach((node, index) => {
    setTimeout(() => {
      animatePulse(node, false)
    }, index * 200)
  })
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