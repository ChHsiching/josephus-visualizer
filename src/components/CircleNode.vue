<template>
  <g
    class="circle-node"
    :class="nodeClasses"
    :data-node-id="node.id"
    @click="handleClick"
    :transform="`translate(${position.x}, ${position.y})`"
  >
    <circle
      :r="nodeRadius * (removed ? 0.8 : (active || toRemove ? (toRemove ? 1.2 : 1.1) : 1.0))"
      class="node-circle"
      :class="circleClasses"
    />
    <text
      v-if="node.hasId !== false"
      class="node-text"
      :class="textClasses"
      y="0"
    >
      {{ node.id }}
    </text>
  </g>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  toRemove: {
    type: Boolean,
    default: false
  },
  removed: {
    type: Boolean,
    default: false
  },
  position: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['node-click'])

const nodeRadius = 32

const nodeClasses = computed(() => ({
  'active': props.active,
  'to-remove': props.toRemove,
  'removed': props.removed
}))

const circleClasses = computed(() => ({
  'active': props.active,
  'to-remove': props.toRemove,
  'removed': props.removed
}))

const textClasses = computed(() => ({
  'active': props.active,
  'to-remove': props.toRemove,
  'removed': props.removed
}))

const handleClick = () => {
  emit('node-click', props.node.id)
}
</script>

<style scoped>
.circle-node {
  cursor: pointer;
  transition: all 0.3s ease;
}

.node-circle {
  fill: #1d2021;
  stroke: #928374;
  stroke-width: 2;
  transition: all 0.3s ease;
}

.node-circle.active {
  fill: #076678;
  stroke: #83a598;
  stroke-width: 3;
}

.node-circle.to-remove {
  fill: #cc241d;
  stroke: #fb4934;
  animation: pulse 1s infinite;
}

.node-circle.removed {
  fill: #1d2021;
  stroke: #665c54;
  opacity: 0.3;
}

.node-text {
  fill: #000000;
  font-size: 22px;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
  user-select: none;
}

.node-text.active,
.node-text.to-remove {
  fill: #000000;
  font-weight: bold;
}

.node-text.removed {
  fill: #665c54;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.circle-node:hover .node-circle:not(.removed) {
  stroke-width: 3;
  filter: brightness(1.2);
}
</style>