<script setup lang="ts">
import { createApp } from "vue";
import App from "./App.vue";
import route from "@/route.js"; // Changed this line

const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "app",
  render() {
    return (void 0 === App ? null : App());
  }
});
</script>

<template>
  <App />
</template>

<style scoped></style>
