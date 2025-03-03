import { copycat, faker } from "@snaplet/copycat";
import { createSeedClient, type schemaEnum } from "@snaplet/seed";

import { createDealDataset } from "./utils";

faker.seed(0);

const userId = "user_2loU8MkjCrmULtpAZvbXj9QExWr";

// Env is synonomous with schema
const configurationSchemas: schemaEnum[] = ["foundation"];

const FORM_COUNT = 4;
const TABLE_COUNT = 4;
const COMPONENT_VERSION_COUNT = 3;

async function main() {
  const seed = await createSeedClient();
  // Truncate all tables in the database - ignore the schema infered tables (these are reset through pnpm sync)
  await seed.$resetDatabase([
    "!foundation.*",
    "!auth.*",
    "!public.*",
    "!configuration.role",
    "!configuration.role_view",
    "!configuration.role_link",
    "!configuration.role_column",
    "!configuration.column",
    "!configuration.link",
    "!configuration.view",
  ]);

  for (const configuration_schema of configurationSchemas) {
    const { published_component: publishedForms } = await seed.component(x =>
      x(FORM_COUNT, ({ seed }) => ({
        configuration_schema,
        type: "form",
        label: copycat.words(seed, { min: 1, max: 3 }),
        created_by_id: userId,
        role_name: "admin",
        component_version: x =>
          x(COMPONENT_VERSION_COUNT, ({ index }) => ({
            configuration_schema,
            version: index + 1,
            type: "form",
            created_by_id: userId,
            role_name: "admin",
            form: {
              configuration_schema,
              dataset: createDealDataset(configuration_schema),
              form_instance: [],
            },
          })),
        published_component: [
          {
            configuration_schema,
            environment_schema: configuration_schema,
            version: copycat.int(seed, {
              min: 1,
              max: COMPONENT_VERSION_COUNT,
            }),
            published_by_id: userId,
            published_at: copycat.dateString(seed),
            role_name: "admin",
          },
        ],
      })),
    );

    const { published_component: publishedTables } = await seed.component(x =>
      x(TABLE_COUNT, ({ seed }) => ({
        configuration_schema,
        type: "table",
        label: copycat.words(seed, { min: 1, max: 3 }),
        created_by_id: userId,
        role_name: "admin",
        component_version: x =>
          x(COMPONENT_VERSION_COUNT, ({ index }) => ({
            configuration_schema,
            version: index + 1,
            type: "table",
            created_by_id: userId,
            role_name: "admin",
            table: {
              configuration_schema,
              dataset: createDealDataset(configuration_schema),
            },
          })),
        published_component: [
          {
            configuration_schema,
            environment_schema: configuration_schema,
            version: copycat.int(seed, {
              min: 1,
              max: COMPONENT_VERSION_COUNT,
            }),
            published_by_id: userId,
            published_at: copycat.dateString(seed),
            role_name: "admin",
          },
        ],
      })),
    );

    // Layouts;
    await seed.component(() => [
      {
        configuration_schema,
        type: "layout",
        label: ctx => copycat.words(ctx.seed, { min: 1, max: 3 }),
        created_by_id: userId,
        role_name: "admin",
        slug: "DEAL_PAGE",
        component_version: x =>
          x(COMPONENT_VERSION_COUNT, ({ index }) => ({
            configuration_schema,
            version: index + 1,
            type: "layout",
            created_by_id: userId,
            role_name: "admin",
            slug: "DEAL_PAGE",
            layout: {
              configuration_schema,
              slug: "DEAL_PAGE",
              label: ctx => copycat.words(ctx.seed, { min: 1, max: 3 }),
              tile: x =>
                x({ min: 1, max: 5 }, ({ index }) => ({
                  label: ctx => copycat.words(ctx.seed, { min: 1, max: 3 }),
                  order: index + 1,
                  widget: x =>
                    x({ min: 1, max: 4 }, ({ index }) => ({
                      order: index + 1,
                      label: ctx => copycat.words(ctx.seed, { min: 1, max: 3 }),
                      published_component_on_widget: x =>
                        x(
                          {
                            min: 1,
                            max: 3,
                          },
                          ({ index, seed }) => ({
                            published_component_id:
                              copycat.oneOf(seed, [
                                ...publishedForms.map(x => x.id),
                                ...publishedTables.map(x => x.id),
                              ]) ?? "",
                            order: index + 1,
                          }),
                        ),
                    })),
                })),
            },
          })),
        published_component: x =>
          x(1, ({ seed }) => ({
            configuration_schema,
            slug: "DEAL_PAGE",
            environment_schema: configuration_schema,
            version: copycat.int(seed, {
              min: 1,
              max: COMPONENT_VERSION_COUNT,
            }),
            published_by_id: userId,
            published_at: copycat.dateString(seed),
            role_name: "admin",
          })),
      },
    ]);
  }
}

main()
  .then(() => {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit();
  })
  .catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  });
