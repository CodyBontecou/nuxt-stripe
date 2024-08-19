export function useStripe() {
  const checkout = async (lookupKey: string) => {
    const res = await $fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      body: {
        lookup_key: lookupKey,
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

  const tiers = [
    {
      name: 'Freelancer',
      id: 'tier-freelancer',
      href: '#',
      price: '$24',
      description: 'The essentials to provide your best work for clients.',
      features: [
        '5 products',
        'Up to 1,000 subscribers',
        'Basic analytics',
        '48-hour support response time',
      ],
      mostPopular: false,
      type: 'monthly',
    },
    {
      name: 'Startup',
      id: 'tier-startup',
      href: '#',
      price: '$32',
      description: 'A plan that scales with your rapidly growing business.',
      features: [
        '25 products',
        'Up to 10,000 subscribers',
        'Advanced analytics',
        '24-hour support response time',
        'Marketing automations',
      ],
      mostPopular: true,
      type: 'monthly',
    },
    {
      name: 'Enterprise',
      id: 'tier-enterprise',
      href: '#',
      price: '$48',
      description: 'Dedicated support and infrastructure for your company.',
      features: [
        'Unlimited products',
        'Unlimited subscribers',
        'Advanced analytics',
        '1-hour, dedicated support response time',
        'Marketing automations',
      ],
      mostPopular: false,
      type: 'monthly',
    },

    {
      name: 'Freelancer',
      id: 'tier-freelancer-yearly',
      href: '#',
      price: '$240',
      description: 'The essentials to provide your best work for clients.',
      features: [
        '5 products',
        'Up to 1,000 subscribers',
        'Basic analytics',
        '48-hour support response time',
      ],
      mostPopular: false,
      type: 'yearly',
    },
    {
      name: 'Startup',
      id: 'tier-startup-yearly',
      href: '#',
      price: '$320',
      description: 'A plan that scales with your rapidly growing business.',
      features: [
        '25 products',
        'Up to 10,000 subscribers',
        'Advanced analytics',
        '24-hour support response time',
        'Marketing automations',
      ],
      mostPopular: true,
      type: 'yearly',
    },
    {
      name: 'Enterprise',
      id: 'tier-enterprise-yearly',
      href: '#',
      price: '$480',
      description: 'Dedicated support and infrastructure for your company.',
      features: [
        'Unlimited products',
        'Unlimited subscribers',
        'Advanced analytics',
        '1-hour, dedicated support response time',
        'Marketing automations',
      ],
      mostPopular: false,
      type: 'yearly',
    },
  ]

  return { checkout, navigateToStripeDashboard, tiers }
}
