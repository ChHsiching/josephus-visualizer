<template>
  <div class="animation-panel">
    <div class="animation-container">
      <svg
        ref="svgContainer"
        :width="svgSize"
        :height="svgSize"
        viewBox="0 0 900 900"
        class="circle-svg"
      >
        <!-- Render circle links -->
        <g class="links">
          <circle-link
            v-for="link in links"
            :key="`link-${link.from}-${link.to}-${link.type}`"
            :link="link"
            :state="link.state"
            :active="activeLinks.has(`${link.from}-${link.to}-${link.type}`)"
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
            @node-click="handleNodeClick"
          />
        </g>

        <!-- Center info -->
        <g class="center-info">
          <text
            x="450"
            y="450"
            text-anchor="middle"
            class="info-text"
          >
            {{ animationMessage }}
          </text>

          <text
            x="450"
            y="470"
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

  // Highlight both arrows of the active node (next and prev)
  if (activeNode && activeNode.exists) {
    // Highlight next arrow - 使用ID信息
    const nextNodeId = activeNode.nextId || (activeNode.next && activeNode.next.id)
    if (nextNodeId) {
      const nextNode = nodes.value.find(n => n.id === nextNodeId)
      if (nextNode && nextNode.exists) {
        links.add(`${activeNode.id}-${nextNodeId}-next`)
      }
    }

    // Highlight prev arrow - 使用ID信息
    const prevNodeId = activeNode.prevId || (activeNode.prev && activeNode.prev.id)
    if (prevNodeId) {
      const prevNode = nodes.value.find(n => n.id === prevNodeId)
      if (prevNode && prevNode.exists) {
        links.add(`${activeNode.id}-${prevNodeId}-prev`)
      }
    }
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

  
  // Create bidirectional arrows: each node has both 'next' and 'prev' arrows
  nodes.value.forEach(node => {
    // 修复：允许所有节点创建箭头，但根据状态设置不同样式
    // 这样删除节点后，相邻节点的连接箭头可以正确重新指向

    // Next arrow (clockwise direction) - 修复：nextLink状态优先级高于nextId
    let nextNodeId = null

    // 只有当nextLink明确为true时，才获取nextId并显示箭头
    if (node.nextLink === true) {
      nextNodeId = node.nextId || (node.next && node.next.id)
    }

    if (nextNodeId) {
      const nextNode = nodes.value.find(n => n.id === nextNodeId)
      if (nextNode) {
        let nextState = 'inactive'

        // 根据新的节点状态系统确定箭头状态
        if (!node.exists) {
          // 被删除的节点：箭头虚化
          nextState = 'removed'
        } else if (!nextNode.exists) {
          // 指向被删除节点的箭头：虚化
          nextState = 'fading'
        } else if (node.nextLink === true && nextNode.exists) {
          // 明确设置为true且目标节点存在：显示箭头
          nextState = 'active'
        }

        const edgePoints = getArrowEdgePoints(node.id, nextNodeId, 32, 'next')

        nodeLinks.push({
          from: node.id,
          to: nextNodeId,
          type: 'next',
          direction: 'clockwise',
          state: nextState,
          fromPos: edgePoints.start,
          toPos: edgePoints.end,
          curvature: edgePoints.curvature
        })
      }
    }

    // Prev arrow (counter-clockwise direction) - 修复：prevLink状态优先级高于prevId
    let prevNodeId = null

    // 只有当prevLink明确为true时，才获取prevId并显示箭头
    if (node.prevLink === true) {
      prevNodeId = node.prevId || (node.prev && node.prev.id)
    }

    if (prevNodeId) {
      const prevNode = nodes.value.find(n => n.id === prevNodeId)
      if (prevNode) {
        let prevState = 'inactive'

        // 根据新的节点状态系统确定箭头状态
        if (!node.exists) {
          // 被删除的节点：箭头虚化
          prevState = 'removed'
        } else if (!prevNode.exists) {
          // 指向被删除节点的箭头：虚化
          prevState = 'fading'
        } else if (node.prevLink === true && prevNode.exists) {
          // 明确设置为true且目标节点存在：显示箭头
          prevState = 'active'
        }

        const edgePoints = getArrowEdgePoints(node.id, prevNodeId, 32, 'prev')

        nodeLinks.push({
          from: node.id,
          to: prevNodeId,
          type: 'prev',
          direction: 'counter-clockwise',
          state: prevState,
          fromPos: edgePoints.start,
          toPos: edgePoints.end,
          curvature: edgePoints.curvature
        })
      }
    }
  })

  // Clean bidirectional arrow system completed
  // Next arrows: outer ring (clockwise)
  // Prev arrows: inner ring (counter-clockwise)
  // No special reconnection arrows - existing arrows dynamically update

  return nodeLinks
})

/**
 * Get position for node in circular layout
 */
function getNodePosition(nodeId, totalNodes) {
  // Fixed: Always use 20 nodes for circular layout
  const angle = (nodeId - 1) * (2 * Math.PI / 20) - Math.PI / 2
  const radius = 420  // Increased from 400 to 420 for better spacing
  const centerX = 450
  const centerY = 450

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  }
}

/**
 * Calculate arrow start/end points with dual-ring separation system
 */
function getArrowEdgePoints(fromNodeId, toNodeId, nodeRadius = 32, arrowType = 'next') {
  const centerX = 450
  const centerY = 450
  const baseRadius = 420 // Current node radius

  // Determine ring radius based on arrow type
  let ringRadius
  if (arrowType === 'next') {
    // Next arrows: outer ring (clockwise)
    ringRadius = baseRadius + 25 // 445px
  } else if (arrowType === 'prev') {
    // Prev arrows: inner ring (counter-clockwise)
    ringRadius = baseRadius - 25 // 395px
  }

  // Calculate node positions on their respective rings
  const fromAngle = (fromNodeId - 1) * (2 * Math.PI / 20) - Math.PI / 2
  const toAngle = (toNodeId - 1) * (2 * Math.PI / 20) - Math.PI / 2

  const fromPos = {
    x: centerX + ringRadius * Math.cos(fromAngle),
    y: centerY + ringRadius * Math.sin(fromAngle)
  }

  const toPos = {
    x: centerX + ringRadius * Math.cos(toAngle),
    y: centerY + ringRadius * Math.sin(toAngle)
  }

  // Calculate direction vector from center to center
  const dx = toPos.x - fromPos.x
  const dy = toPos.y - fromPos.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  // Normalize to unit vector
  const unitX = dx / distance
  const unitY = dy / distance

  // Calculate perpendicular vector for curvature
  const perpX = -unitY
  const perpY = unitX

  // Determine curvature based on arrow type and ring
  let curvatureOffset = 0

  if (arrowType === 'next') {
    // Next arrows on outer ring: curve outward
    curvatureOffset = 30
  } else if (arrowType === 'prev') {
    // Prev arrows on inner ring: curve inward
    curvatureOffset = -20
  }

  // Calculate control point for curved path
  const controlPoint = {
    x: (fromPos.x + toPos.x) / 2 + perpX * curvatureOffset,
    y: (fromPos.y + toPos.y) / 2 + perpY * curvatureOffset
  }

  // Calculate edge points (account for node radius)
  const startEdge = {
    x: fromPos.x + unitX * nodeRadius,
    y: fromPos.y + unitY * nodeRadius
  }

  const endEdge = {
    x: toPos.x - unitX * nodeRadius,
    y: toPos.y - unitY * nodeRadius
  }

  return {
    start: startEdge,
    end: endEdge,
    controlPoint: controlPoint,
    ringRadius: ringRadius,
    curvature: curvatureOffset,
    arrowType: arrowType
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
  // Nodes are now visible by default, no need for manual opacity manipulation
  console.log('Ring initialization complete')
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
  max-width: 800px;
  max-height: 800px;
}

.info-text {
  fill: #fbf1c7;
  font-size: 28px;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
}

.round-text {
  fill: #928374;
  font-size: 22px;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
}

/* Node animation classes */
.circle-node {
  opacity: 1;
  transition: opacity 0.3s ease;
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
    max-width: 500px;
    max-height: 500px;
  }

  .info-text {
    font-size: 16px;
  }

  .round-text {
    font-size: 14px;
  }
}
</style>