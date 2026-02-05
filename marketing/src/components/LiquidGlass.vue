<template>
  <div ref="root" class="liquid-glass-wrapper">
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import { Container } from "../lib/liquid-glass/Container.js";

const props = defineProps({
  cornerRadius: {
    type: Number,
    default: 16,
  },
  tintOpacity: {
    type: Number,
    default: 0.2,
  },
  type: {
    type: String,
    default: "rounded",
  },
});

const root = ref(null);
let containerInstance = null;

onMounted(() => {
  if (root.value) {
    containerInstance = new Container({
      element: root.value,
      borderRadius: props.cornerRadius,
      tintOpacity: props.tintOpacity,
      type: props.type,
    });
  }
});

onBeforeUnmount(() => {
  // Ideally we remove instance from Container.instances and clean up WebGL
});
</script>

<style scoped>
.liquid-glass-wrapper {
  position: relative;
}
</style>
