<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
const { data, signOut } = useAuth()
const { navigateToStripeDashboard } = useStripe()

const solutions = [
  { name: 'Manage Billing', fn: navigateToStripeDashboard },
  { name: 'Sign Out', fn: signOut },
]
</script>

<template>
  <Popover class="relative">
    <PopoverButton
      class="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
    >
      <AuthAvatar :src="data?.user?.image" />
    </PopoverButton>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <PopoverPanel
        class="absolute left-1/2 z-10 mt-2 flex w-screen max-w-min -translate-x-[90%] px-4"
      >
        <div
          class="w-44 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5"
        >
          <button
            v-for="item in solutions"
            :key="item.name"
            @click="() => item.fn()"
            class="block p-2 hover:text-indigo-600"
          >
            {{ item.name }}
          </button>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
