<template>
  <line
    :x1="link.fromPos.x"
    :y1="link.fromPos.y"
    :x2="link.toPos.x"
    :y2="link.toPos.y"
    class="circle-link"
    :class="{ 'active': active }"
  />
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  link: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.circle-link {
  fill: none;
  stroke: #504945;
  stroke-width: 2;
  stroke-dasharray: 5, 5;
  transition: all 0.3s ease;
}

.circle-link.active {
  stroke: #458588;
  stroke-dasharray: none;
  stroke-width: 3;
}

.circle-link:hover {
  stroke: #665c54;
  stroke-width: 3;
}
</style>