<script lang="ts" setup>
interface Props {
  src: string
}

defineProps<Props>()
</script>

<template>
  <img
    class="inline-block h-10 w-10 rounded-full bg-gray-500"
    :src="src"
    alt="User avatar"
  />
</template>
