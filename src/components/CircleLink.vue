<template>
  <g class="circle-link">
    <!-- Arrow markers for next and prev types -->
    <defs>
      <!-- Next arrow marker (blue, triangular) -->
      <marker
        id="arrowhead-next"
        markerWidth="8"
        markerHeight="6"
        refX="7"
        refY="3"
        orient="auto"
      >
        <polygon
          points="0 0, 8 3, 0 6"
          :fill="active ? '#83a598' : '#458588'"
        />
      </marker>

      <!-- Prev arrow marker (green, circular) -->
      <marker
        id="arrowhead-prev"
        markerWidth="8"
        markerHeight="6"
        refX="7"
        refY="3"
        orient="auto"
      >
        <circle
          cx="4"
          cy="3"
          r="2"
          :fill="active ? '#b8bb26' : '#98971a'"
        />
      </marker>
    </defs>

    <!-- Curved path for the arrow -->
    <path
      :d="pathData"
      class="circle-link"
      :class="[
        { 'active': active },
        `type-${link.type}`,
        `state-${state}`
      ]"
      :marker-end="`url(#arrowhead-${link.type})`"
      fill="none"
    />
  </g>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  link: {
    type: Object,
    required: true
  },
  state: {
    type: String,
    default: 'active', // 'active' | 'fading' | 'removed' | 'new-connection'
    validator: (value) => ['active', 'fading', 'removed', 'new-connection'].includes(value)
  },
  active: {
    type: Boolean,
    default: false
  }
})

// Generate SVG path data for curved arrows
const pathData = computed(() => {
  const { fromPos, toPos, controlPoint } = props.link

  if (controlPoint) {
    // Curved path using quadratic Bezier curve
    return `M ${fromPos.x} ${fromPos.y} Q ${controlPoint.x} ${controlPoint.y} ${toPos.x} ${toPos.y}`
  } else {
    // Fallback to straight line
    return `M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`
  }
})
</script>

<style scoped>
.circle-link {
  fill: none;
  transition: all 0.3s ease;
  stroke-linecap: round;
}

/* Next arrow styles (blue, outer ring) */
.circle-link.type-next {
  stroke: #458588;
  stroke-width: 2.5;
  stroke-dasharray: none;
  opacity: 0.9;
}

.circle-link.type-next.active {
  stroke: #83a598;
  stroke-width: 3.5;
  opacity: 1;
  filter: drop-shadow(0 0 4px #83a598);
}

/* Prev arrow styles (green, inner ring) */
.circle-link.type-prev {
  stroke: #98971a;
  stroke-width: 2;
  stroke-dasharray: 5, 3;
  opacity: 0.8;
}

.circle-link.type-prev.active {
  stroke: #b8bb26;
  stroke-width: 3;
  stroke-dasharray: none;
  opacity: 1;
  filter: drop-shadow(0 0 4px #b8bb26);
}

/* State-based styles */
.circle-link.state-fading {
  opacity: 0.3;
  stroke-width: 1.5;
  stroke-dasharray: 3, 3;
}

.circle-link.state-removed {
  opacity: 0.1;
  stroke-width: 1;
  stroke-dasharray: 2, 4;
}

/* Different styles for removed next/prev arrows */
.circle-link.type-next.state-removed {
  stroke: #45858850; /* Very faded blue */
}

.circle-link.type-prev.state-removed {
  stroke: #98971a50; /* Very faded green */
}

/* Hover effects for better interactivity */
.circle-link:hover:not(.state-removed) {
  filter: brightness(1.4) drop-shadow(0 0 3px currentColor);
  stroke-width: 4;
}

/* Special highlight for dual-ring system */
.circle-link.type-next:hover {
  stroke: #88c9d9;
}

.circle-link.type-prev:hover {
  stroke: #b8bb26;
}
</style>