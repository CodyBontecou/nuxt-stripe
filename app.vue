<script setup lang="ts">
const { status, signIn } = useAuth()
</script>

<template>
  <div>
    <div class="right-4 top-4 absolute">
      <AuthMenu v-if="status === 'authenticated'" />
      <button v-else @click="() => signIn('github')">Sign In</button>
    </div>
    <NuxtPage />
  </div>
</template>
