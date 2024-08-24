# Lesson 03 - Auth
> Now we can begin!

Authentication requires setting up a few things:

1. The `auth` and `runtimeConfig` sections of the `nuxt.config.ts` file.
2. `.env` file to manage environment variables.
3. The `[...].ts` file located at `server/api/auth/[...].ts`.
4. Prisma and our database schema
5. Clientside code to sign in and sign out

### `nuxt.config.ts`

### 1. nuxt-auth module

We need to add our newly installed `@sidebase/nuxt-auth` package to our Nuxt config's `module` array.

```ts
// nuxt.config.ts

export default defineNuxtConfig({
  ...,
  modules: ['@nuxtjs/tailwindcss', '@sidebase/nuxt-auth']
})
```

#### Runtime Config

The recommended way of exposing our environment variables is to use Nuxt's [Runtime Config](https://nuxt.com/docs/guide/going-further/runtime-config). This enables us to utilize the `useRuntimeConfig` composable on both client and server which gives us access to environment variables.

Let's add the environment variables we need to roll out authentication.


```ts
// nuxt.config.ts

export default defineNuxtConfig({
  ...,
  modules: ['@nuxtjs/tailwindcss', '@sidebase/nuxt-auth'],
  runtimeConfig: {
	AUTH_SECRET: process.env.AUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  }
})
```

I'll explain where `AUTH_SECRET`, `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` come from later in this article.

#### auth config

Now, we need to add the `auth` config. The configuration options be explored further in [Sidebase's docs](https://auth.sidebase.io/guide/application-side/configuration).

```ts
// nuxt.config.ts

export default defineNuxtConfig({
  ...,
  modules: ['@nuxtjs/tailwindcss', '@sidebase/nuxt-auth'],
  runtimeConfig: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  },
  auth: {
    originEnvKey: 'AUTH_ORIGIN',
    baseURL: 'http://localhost:3000/api/auth',
    provider: {
      type: 'authjs',
      defaultProvider: 'github',
      addDefaultCallbackUrl: true,
    },
    sessionRefresh: {
      enablePeriodically: true,
      enableOnWindowFocus: true,
    },
  },
})
```

**Note:** I am not doing any custom `auth` configuration and am simply providing the default configuration that their [documentation](https://auth.sidebase.io/guide/application-side/configuration) suggests.

### 2. .env file

The `.env` file is where we manage environment variables, specifically, secret keys that we do not want to to end up in source control. Create the file if you do not already have one, and place it in your project's root directory. This file will grow with time, but initially, we just need three keys:

```toml
// .env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
AUTH_SECRET=
```

To get the values, you'll need to fill out this [Github application](https://github.com/settings/applications/new).  Here's what my form looks like:

![image|500](https://cln.sh/kJjW3vSQ+)

- **Application Name**: Name this whatever you like
- **Homepage URL:** This should be set to the port you are developing your application on. Nuxt's default is on port 3000 so that is what I set it to. Configure this as needed.
- **Authorization callback URL:** Same as the Homepage URL, I am using the default port 3000. What is **important** here is the `/api/auth/callback/github`. This is the default endpoint Nuxt Auth provides and is important for our authentication flow.

You should now see the Client ID and the ability to generate a Client Secret:

![github oauth panel|500](https://share.cleanshot.com/XM6tYFt8+)

Place **your** Client ID and Client Secret values into your .env file.

```toml
// .env
GITHUB_CLIENT_ID=Ov23liXNQBrzCfy450re
GITHUB_CLIENT_SECRET=ab00828302cd662072eaffe70c41f048d3879536
AUTH_SECRET=
```

> The values I am showing have already been deleted and will not work. You must generate your own.

`AUTH_SECRET` is a secret key that we must generate ourselves. The secret is a random string used to hash tokens, sign and encrypt cookie and generate cryptographic keys. This isn't necessary for development, but is **required** once the application is deployed.

Run `openssl rand -base64 32` in your terminal to generate this value. Copy and paste the output into your `.env` file and store it within `AUTH_SECRET`.

You can read more about in the [NuxtAuth docs](https://auth.sidebase.io/guide/authjs/nuxt-auth-handler#secret).

### 3. `server/api/auth/[...].ts`

Next up is our `[...].ts` file. This will be where the majority of the code that configures our authentication logic is held.

If you're not familiar, [...] is the Nuxt syntax for a [catch-all route](https://nuxt.com/docs/guide/directory-structure/server#catch-all-route).

By placing it at the endpoint `api/auth/[...].ts`, it allows there to be many valid values after `api/auth/`. Some of the defaults that are included with @sidebase/nuxt-auth include `api/auth/signin` and `api/auth/signout`.

Let's start with this code snippet:

```ts
// server/api/auth/[...].ts
import GithubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const runtimeConfig = useRuntimeConfig()
const prisma = new PrismaClient() 

export default NuxtAuthHandler({
  secret: runtimeConfig.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    // @ts-expect-error
    GithubProvider.default({
      clientId: runtimeConfig.GITHUB_CLIENT_ID,
      clientSecret: runtimeConfig.GITHUB_CLIENT_SECRET,
    }),
  ],
})
```

1. **Secret:** We use our `runtimeConfig` to access our `AUTH_SECRET` and `GITHUB_*` environment variables.
2. **Adapter:** We create a new `PrismaClient` that is passed to the NuxtAuthHandler's `adapter`. 
	- "Adapters are the bridge we use to connect NuxtAuth to your database." ([docs](https://authjs.dev/getting-started/database?_gl=1*1ry7ee*_gcl_au*NDc1MTI5NzEzLjE3MjM3Njg4Njk.)) Adapter's provide the functions that NuxtAuth call when authentication occurs. For example, when a user is created, NuxtAuth will call the PrismaAdapter's `createUser` function.
	- [Here's a reference to the PrismaAdapter code if you are curious.](https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-prisma/src/index.ts)
4. **Providers**: This is an array of the authentication providers we enable. 
	- In this course, we will only use Github. You can see we import the `GithubProvider` from `next-auth/providers/github`. There are lots of providers you can hook into in a similar way. Check out [Auth.js' docs](https://authjs.dev/getting-started/providers/github) for a larger list of built-in provider options.

### 4. Prisma ORM + Database Schema

[Prisma ORM](https://www.prisma.io/orm) is the database management tool I chose to use for this tutorial. It helps manage the database schema, database migrations, and database queries using Typescript.

When a user logs in, we use the `PrismaAdapter` to save the logged in user into our database. This is essential if we are to collect payments from them and persist their subscription status.

You should already have Prisma installed. But there is an additional command we have to run:

`npx prisma init --datasource-provider sqlite`

This will:
- Create a prisma directory in your application.
- Set the `DATABASE_URL` environment variable in your `.env` file to a local sqlite database
- Create a base `schema.prisma` file within the prisma directory pointing to your `DATABASE_URL`

```ts
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Following Auth.js [Prisma Adapter docs](https://authjs.dev/getting-started/adapters/prisma), we need to update the schema to:

```ts
// schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
 
generator client {
  provider = "prisma-client-js"
}
 
model User {
  id            String          @id @default(cuid())
  name          String?
  email         String?         @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
 
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
 
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
 
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
 
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
 
  @@unique([provider, providerAccountId])
}
 
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
 
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
 
model VerificationToken {
  identifier String
  token      String
  expires    DateTime
 
  @@unique([identifier, token])
}
```

**Note:** I deleted the optional `Authenticator` table from the documentation. We will not be implementing WebAuthn support.

This schema creates the tables used for the authentication flow. But, we need to run two additional commands:

`npx prisma generate` - This generates Typescript types that mirror your database schema, giving us excellent auto-complete and type-errors.
	
`npx prisma migrate dev` - This creates the migration file that contains the SQL that is then applied to your database. This command will prompt you to enter a name for the migration. This can be anything and should be used to describe the changes made to your database.

Your prisma directory should now look like:

```bash
prisma
- migrations
-- migrationName directory
--- migration.sql
-- migration_lock.toml
- dev.db
- dev.db-journal
- schema.prisma
```

We should now be hooked up and ready to authenticate on the client.
### 5. Client-side Authentication

> Let's now interact with the server-side code on the client. 

First, convert your `app.vue` file to navigate users to `NuxtPage`:

```html
// app.vue
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

And create a `pages` directory with the file `index.vue`:

```html
// pages/index.vue
<script lang="ts" setup></script>

<template>
  <div>Hello World</div>
</template>
```

We can now hook into the [useAuth](https://auth.sidebase.io/guide/application-side/session-access#useauth-composable) composable exposed by @sidebase/nuxt-auth and create signin and signout buttons as well as dynamically rendering the user's authentication status.

```html
// pages/index.vue
<script lang="ts" setup>
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
```

**Optional:** Here's a code snippet with a bit of styling:

```html
// pages/index.vue

<script setup lang="ts">
const { status, signIn, signOut } = useAuth()
</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <div class="flex flex-col gap-4">
      <div>You are currently {{ status }}.</div>
      <div>
        <div v-if="status === 'authenticated'">
          <button
            class="flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="signOut()"
          >
            Sign out
          </button>
        </div>
        <div v-else>
          <button
            @click="signIn('github')"
            class="flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clip-rule="evenodd"
              />
            </svg>
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
```

You should now be able to sign in and out using Github!
