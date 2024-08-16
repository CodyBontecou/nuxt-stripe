<script setup lang="ts">
const handleCheckout = async () => {
  const PRICE_LOOKUP_KEY = 'monthly_standard'

  const res = await $fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    body: {
      lookup_key: PRICE_LOOKUP_KEY,
    },
  })

  if (res) {
    await navigateTo(res.url, {
      external: true,
    })
  }
}
</script>

<template>
  <AuthButton />
  <button @click="handleCheckout">Checkout</button>
</template>
