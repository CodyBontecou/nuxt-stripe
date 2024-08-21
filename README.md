# Lesson 02 - Installation

Let's get your project installed and running. This lesson is all about front-loading our dependencies so we don't have to worry about them in later lessons.

Start by creating a Nuxt application if you do not already have one set up. Run the following command to do this:

`npx nuxi init nuxt-stripe`
## Auth Dependencies

We'll be relying on [Nuxt Auth](https://auth.sidebase.io) for our authentication needs. This is a wrapper around Next Auth that makes it easy to use with Nuxt. There is an issue that makes Nuxt Auth reliant on next-auth version 4.21.1, so we'll install that version specifically.

`npm install @auth/core @sidebase/nuxt-auth next-auth@4.21.1`

## DB Dependencies

[Prisma](https://www.prisma.io) is my go-to ORM for Node.js projects. It's easy to use and has a great query builder. We'll be using it to interact with our database. 

If you prefer a different solution, use it. There's nothing specific that Prisma solves that other ORM's and database drivers don't. It's just my preference and what I will be showing in the code snippets.

`npm install prisma @prisma/client @next-auth/prisma-adapter`

## UI Dependencies

The UI for this project will be built with [Tailwind CSS](https://tailwindcss.com) and [Headless UI](https://headlessui.com). Headless UI is a collection of unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.

I'm using components directly from [TailwindUI](http://tailwindui.com). Because this is a course on Nuxt and Stripe, I won't be explaining much about the UI. I'm just bringing these dependencies in for presentation reasons.

`npx nuxi@latest module add @nuxtjs/tailwindcss`

`npm install @headlessui/vue @heroicons/vue`

## Stripe Dependencies

Stripe is easy. We'll only need one dependency: the Stripe Node.js library.

`npm install stripe`

## TLDR:

You can expedite this running these commands:

`npx nuxi init nuxt-stripe`
`npm install @auth/core @sidebase/nuxt-auth next-auth@4.21.1 prisma @prisma/client @next-auth/prisma-adapter @headlessui/vue @heroicons/vue stripe`
`npx nuxi@latest module add @nuxtjs/tailwindcss
