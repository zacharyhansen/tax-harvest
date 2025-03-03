# b2b-stack

**Turborepo + NestJS + NextJS + tRPC + ShadcnUI + TailwindCSS + Postgrest + Tiptap + N8N**

## Stack

<div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
  <a href="https://turbo.build">
    <img src="https://user-images.githubusercontent.com/4060187/196936104-5797972c-ab10-4834-bd61-0d1e5f442c9c.png" alt="Turborepo" width="40" height="40" />
  </a>

  <a href="https://www.typescriptlang.org">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png" alt="TypeScript" width="40" height="40" style="border-radius: 10px" />
  </a>

  <a href="https://nextjs.org">
    <img src="https://www.drupal.org/files/project-images/nextjs-icon-dark-background.png" alt="NextJS" width="40" height="40" />
  </a>

  <a href="https://docs.postgrest.org/en/v12/index.html">
    <img src="https://docs.postgrest.org/en/v12/_images/postgrest.png" alt="Postgrest" width="110" height="40" />
  </a>

  <a href="https://nestjs.com">
    <img src="https://nestjs.com/img/logo-small.svg" alt="NestJS" width="40" height="40" />
  </a>

  <a href="https://trpc.io">
    <img src="https://trpc.io/img/logo.svg" alt="tRPC" width="40" height="40" />
  </a>

  <a href="https://www.nestjs-trpc.io">
    <img src="https://github.com/KevinEdry/nestjs-trpc/blob/main/docs/public/logo.png?raw=true" alt="NestJS tRPC" width="40" height="40" />
  </a>

  <a href="https://react.dev">
    <img src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png" alt="React" width="40" height="40" />
  </a>

  <a href="https://ui.shadcn.com">
    <img src="https://ui.shadcn.com/apple-touch-icon.png" style="border-radius: 12px" alt="ShadcnUI" width="40" height="40" />
  </a>

  <a href="https://tailwindcss.com">
    <img src="https://www.svgrepo.com/show/374118/tailwind.svg" alt="TailwindCSS" width="40" height="40" />
  </a>

  <a href="https://vercel.com">
    <img src="https://assets.vercel.com/image/upload/q_auto/front/favicon/vercel/180x180.png" alt="Vercel" width="40" height="40" />
  </a>

  <a href="https://vitest.dev">
    <img src="https://vitest.dev/logo.svg" alt="Vitest" width="40" height="40" />
  </a>
  
  <a href="https://testing-library.com">
    <img src="https://testing-library.com/img/logo-large.png" alt="Testing Library" width="40" height="40" />
  </a>

  <a href="https://zod.dev">
    <img src="https://zod.dev/logo.svg" alt="Zod" width="40" height="40" />
  </a>

  <a href="https://eslint.org">
    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/ESLint_logo.svg" alt="ESLint" width="40" height="40" />
  </a>

  <a href="https://prettier.io">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_5JKKZwBUda4VTSenmQwFta2rgoJZBo0Ikg&s" style="border-radius: 12px" alt="Prettier" width="40" height="40" />
  </a>

  <a href="https://commitlint.js.org">
    <img src="https://www.svgrepo.com/show/373518/commitlint.svg" alt="Commitlint" width="40" height="40" />
  </a>

  <a href="https://docs.github.com/en/actions">
    <img src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/GithubActions-Dark.svg" alt="Github Actions" width="40" height="40" />
  </a>

  <a href="https://pnpm.io">
    <img src="https://avatars.githubusercontent.com/u/21320719?v=4" alt="Github Actions" width="40" height="40" style="border-radius: 8px" />
  </a>

  <a href="https://tiptap.dev/docs">
    <img src="https://cdn.prod.website-files.com/645a9acecda2e0594fac6126/657c5d6268aea6c85dd4a066_tiptap-editor-hero.png" alt="Tiptap" width="40" height="40" style="border-radius: 8px" />
  </a>
</div>

### Apps and Packages

Web app uses [`next@15`](https://nextjs.org/blog/next-15-rc) and [`react@19`](https://react.dev/blog/2024/04/25/react-19). Also web app uses [T3 Env](https://env.t3.gg) for env variables.

UI library is [ShadcnUI](https://ui.shadcn.com) and it's included in `packages/ui` folder.

Each package/app is 100% [TypeScript](https://www.typescriptlang.org) and contains [@total-typescript/ts-reset](https://www.totaltypescript.com/ts-reset) and [Vitest](https://vitest.dev).

**If you want to see this template in action, you can check out this repository where it is used with Prisma: [share-your-thought](https://github.com/Mnigos/share-your-thought).**

### Build

To build all apps and packages, run the following command:

```bash
pnpm build
```

### Develop

ROOT: To install all packages:

```bash
pnpm install
```

APPS/API: To migrate the db:

```bash
pnpm migrate
```

APPS/API: To produce required codegen based on the current schemas:

```bash
pnpm codegen
```

APPS/API: To seed your db:

```bash
pnpm seed
```

ROOT: To develop all apps and packages, run the following command:

```bash
pnpm dev
```

### Test

To run all tests, run the following command:

```bash
pnpm test
```

### Lint

To run all linting, run the following command:

```bash
pnpm lint
```

### Add new ShadcnUI component

```bash
pnpm ui add <component-name>
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```bash
pnpm dlx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```bash
pnpm dlx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

## Database

### Prisma & Schemas

Prisma is utilized to manage **migrations only** for the most part as it provides an opinionated and declaritive way to our schema and programatically manage migration files.

We use multiple schema files to organize our schema into its logical parts. It is important to understand that every customer is able to extend tables within there specific schema with custom columns to tailor their instance to fit their business usecase.

#### Public `schema.prisma`

The `public` schema has the very basic central parts of the application that are available to each customer (mostly enums).

#### Auth `auth.prisma`

The `auth` schema manages tables that deal with objects that specify the auth, env, and user organization acress customers and their envs in the system. By their gloabl nature, these models are consistant bewtween all customers as these records often can belong to multiple customers ro envs.

For example:

- a user may belong to both the uat and the production env
- a user may belong to multiple business units in an organization
- an agent may be working within two different customers

**A customer never has access to this schema - they only have access to views of this schema in their own schema which make use of joins to ensure they can only view records relevant to their contet**

#### Configuration `configuration.prisma`

The `configuration` schema is shared between all customers and environemnts. Again their glabal nature means these records always are the same shape and should be as these records purley desrive the nature of configuration within a target customer schema.

**The configuration schema should not contain customer data except for very niche uses**

#### Customer Schema `{*,foundation}.prisma`

A `customer` schema is the secret sauce and requires a little more boiler plate. **Every single customer schema should be the exact same except with a different @@schme(schemaname) attribute on every table**

Why?

We use prisma to track the entity relationships and 'core' fields that exist in every customer schema and thus can be used by the platform as they always exist. However customers are able to add custom columns to each of these tables to represent their specific business. Becuase these custom columns cannot be shared we create a schema per customer.

The easiest way to accomplish this for now is to manually create the files and manage the columns for each. This means:

- If you add a core field you must add it to every customer schema file
- We can represent platform/application types using a single schema **foundation**

TODO: It would be greate to automate the migrations of customer schemas using a single schema but right now it is difficult as an addition of a new schema means that the migrations we have repsented in the prisma migs folder are the _history_ of what has happened meaning it needs to all be replayed to get a new schema setup.

Instead we manually create the new file which causes prisma to generate a new migrations for the new schema from scratch.

### Development Gotchas

#### One to One Relations

Prisma (dont ask me why) only creates a `unique index` and not a `unique constriant` in the DB when enforcing unqiueness. While for most use cases this is perfectly fine, postgREST infers one to one relations using `constraint` rather than `index`. In order for the API to work properly you must manually add an additional migration on the column representing the one to one relation.

```
ALTER TABLE table_name
ADD UNIQUE (column_name);
```

### New Schema Setup

To setup a new schema the following need to happen

1. Create the `<custoemr>.prisma` file via a copy of any of the other customer schemas (as they should be all the same)
2. Generate and apply migrations for this new schema
3. Manually create a new migration file using

```bash
pnpm migrate:create <name>
```

4. Add the following sql to manual mig file which triggers the pg fucntion that sets up roles, views, default values, etc. for the new schema

```sql
SELECT set_up_schemas(ARRAY['foundation']);
```

### Customer Schema Views

The following describes the general rules on how views and a customer schema are structured and named to support our model of custom columns and role based permissions while maintaing a common ERD.

Truths we try to maintain within the context of customer schema data access:

1. Customers only access data through views (using [postgrest](https://docs.postgrest.org/en/v12/index.html) api's). This is important for a few reasons:
   - We can change the underlying way to access the data for the view if we want
   - Views can be explicitely permissioned with roles
   - We can easily extend views with "generated" columns
   - they are clearly seen in any db gui for developers
2. We maintain a concept of a "root" view which is the superset of all possible columns for a underlying table in the schema.These root views are **named `v_<pg_table>` always**. This is done to:
   - Provide a deterministic interface that the application can use to "understand" the data. i.e. the application can know what available fields exist for a model (property for example) in the backend by querying the view `v_property` to see what columns come back.
   - Provide a 'superset' definition that restricted or filtered views can be built from for other system roles.
   - New "Role Views" can be spawned from the root views in order to provide access to data per role. These view follow the **convention `v_<pg_table>__<role>` always**. Again, these views can at most be equal to the columns on the root view but may be less to restrict access. As the database level, the specific role is granted access to this view (they do not have access ot the other root view by default).
3. Permissioning
   - Other than `admin` roles there is no access by default. `admin` roles by default can see and do anything.
   - Permissioning is managed at only 2 levels
     - "Role View" where the user's role determines which view is queried (if it exists). Attempting to query a different view would fail due to their role not having permissions on other views of the same model.
     - Row based access: TDB
4. The above results in and exists for some of the following
   - Tables within the customer schema can modified to include custom columns and will appear by default in the root views
   - Tables outside of the customer schema can appear as root views (i.e. organization, agent, user) but **cannot be extended** as these tables are constant accross customers. They can however be managed using the same permissioning logic described above.
