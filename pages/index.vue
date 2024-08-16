<script setup lang="ts">
const { status, signIn, signOut } = useAuth()
</script>

<template>
  <div>You are currently {{ status }}.</div>
  <div v-if="status === 'authenticated'">
    <button @click="signOut()">Sign out</button>
  </div>
  <div v-else>
    <button @click="signIn('github')">Sign in with GitHub</button>
  </div>
</template>
