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

const navigateToStripeDashboard = async () => {
  const res = await $fetch('/api/stripe/create-portal-session', {
    method: 'POST',
  })

  if (res && 'url' in res) {
    await navigateTo(res.url, {
      external: true,
    })
  } else {
    console.error('Error creating portal session:', res.error)
  }
}
</script>

<template>
  <AuthButton />
  <button @click="handleCheckout">Checkout</button>
  <button @click="navigateToStripeDashboard">Manage Subscription</button>
</template>
