import { env, schema, tenant } from "@prisma/client";
import { copycat, faker } from "@snaplet/copycat";
import { createSeedClient } from "@snaplet/seed";

import {
  genAddress,
  genUniqueNumeric,
  task_priorities,
  task_statuses,
} from "./utils";

faker.seed(0);

const deal_states = [
  "Submission",
  "Failed Pre Qualification",
  "Submission Validation",
  "Pre Qualified",
  "Pricing",
  "Pricing Validation",
  "Underwriting",
  "Final Underwriting Approval",
  "Contract Out",
  "Contract In",
  "Pre Funding",
  "Funded",
  "Archived",
  "Completed",
];

const scale = 50;

async function main() {
  const seed = await createSeedClient();
  // Truncate all tables in the database
  await seed.$resetDatabase();

  const { environment } = await seed.business_unit([
    {
      tenant: tenant.foundation_tenant,
      configuration_schema: schema.foundation,
      environment: () => [
        {
          clerk_id: "org_2ko38RckCbvGDqbOE3WO4XXpjKP",
          schema: schema.foundation,
          configuration_schema: schema.foundation,
          env: env.prod,
          name: "Foundation Prod Environment",
          tenant: tenant.foundation_tenant,
          external_id: "external_12345",
        },
      ],
    },
  ]);

  await seed.role(
    environment.flatMap(env => [
      { name: "admin", configuration_schema: env.configuration_schema },
      { name: "underwriter", configuration_schema: env.configuration_schema },
      { name: "agent", configuration_schema: env.configuration_schema },
      { name: "auditor", configuration_schema: env.configuration_schema },
      { name: "borrower", configuration_schema: env.configuration_schema },
    ]),
  );

  const all_users = await Promise.all(
    ["admin", "underwriter", "agent", "auditor", "borrower"].map(role =>
      seed.auth_user(x =>
        x(scale, ({ seed }) => ({
          clerk_id: copycat.uuid(seed),
          email: copycat.email(seed),
          name: copycat.fullName(seed),
          user: environment.map(env => ({
            email: context => copycat.email(context.seed),
            date_of_birth: faker.date.birthdate(),
            credit_score: context =>
              copycat.int(context.seed, {
                max: 820,
                min: 380,
              }),
            name: context => copycat.fullName(context.seed),
            phone: context => copycat.phoneNumber(context.seed),
            ssn: faker.string.numeric(9),
            ...genAddress(),
            configuration_schema: env.configuration_schema,
            role_name: role,
          })),
        })),
      ),
    ),
  );

  const devUsers = await seed.auth_user([
    {
      clerk_id: "user_2loU8MkjCrmULtpAZvbXj9QExWr",
      email: context => copycat.email(context.seed),
      user: environment.map(env => ({
        email: "zachary.r.hansen@gmail.com",
        date_of_birth: faker.date.birthdate(),
        credit_score: context =>
          copycat.int(context.seed, {
            max: 820,
            min: 380,
          }),
        name: "Zachary Hansen",
        phone: context => copycat.phoneNumber(context.seed),
        ssn: faker.string.numeric(9),
        ...genAddress(),
        configuration_schema: env.configuration_schema,
        role_name: "admin",
      })),
    },
  ]);

  for (const env of environment) {
    const bussinessCount = scale;
    const dbas = [...genUniqueNumeric(bussinessCount, 6)];
    const duns = [...genUniqueNumeric(bussinessCount, 9)];
    const tins = [...genUniqueNumeric(bussinessCount, 9)];

    const { business: businesses } = await seed.business(x =>
      x(bussinessCount, {
        business_type: faker.company.buzzNoun(),
        date_business_began: new Date(faker.date.birthdate()),
        dba: () => `DBA_${dbas.pop()}`,
        debt: faker.number.int({
          max: 10_000_000,
          min: 100_000,
        }),
        duns: () => duns.pop() ?? "",
        email: faker.internet.email(),
        industry: faker.commerce.department(),
        name_display: faker.company.name(),
        name_legal: faker.company.name(),
        phone: faker.phone.number(),
        revenue_average: faker.number.int({
          max: 10_000_000,
          min: 100_000,
        }),
        tin: () => tins.pop() ?? "",
      }),
    );

    // const { auth_user: org_admins } = all_users[0];
    const { user: org_underwriters } = all_users[1];
    const { user: org_agents } = all_users[2];
    // const { auth_user: org_auditors } = all_users[3];
    const { user: org_borrowers } = all_users[4];

    const users = [...all_users, devUsers].flatMap(({ user }) =>
      user.map(user => user),
    );

    const org_businesses = copycat
      .someOf(
        env.schema,
        [businesses.length / 2, businesses.length],
        businesses,
      )
      .map(b => ({
        id: b.id,
      }));

    await seed.task_status(task_statuses);

    await seed.task_priority(task_priorities);

    const opportunityIds: string[] = [];
    const { deal_state } = await seed.deal_state(
      deal_states.map((state, index) => ({
        label: state,
        order: index,
      })),
    );
    // This is effectively seeding "active" deals as opportunity is created as a child
    await seed.deal(x =>
      x(scale, ({ seed }) => {
        const dealId = copycat.uuid(seed);
        return {
          id: dealId,
          label: copycat.words(seed, { min: 1, max: 3 }),
          opportunity: ({ seed }) => {
            const opportunityId = copycat.uuid(seed);
            opportunityIds.push(opportunityId);
            return {
              id: opportunityId,
              active_deal_id: dealId,
              label: copycat.words(seed, { min: 1, max: 3 }),
              created_by_id: copycat.oneOf(seed, users).user_id,
              borrower_user_id: copycat.oneOf(seed, org_borrowers).user_id,
              agent_id: copycat.oneOf(seed, org_agents).user_id,
              borrower_business_id: copycat.int(seed, {
                min: 0,
                max: 1,
              })
                ? copycat.oneOf(seed, org_businesses).id
                : null,
            };
          },
          deal_event: x =>
            x({ min: Math.floor(scale / 2), max: scale }, ({ seed }) => ({
              created_by: copycat.oneOf(seed, [
                ...org_underwriters,
                ...org_agents,
              ]).user_id,
            })),
          deal_assignee: () => copycat.someOf(seed, [0, 3], org_underwriters),
          created_by_id: faker.helpers.arrayElement(users).user_id,
          appetite: faker.number.int({
            max: 100,
            min: 0,
          }),
          task: x =>
            x({ min: 0, max: 10 }, ({ seed, index }) => ({
              task_subscriber: () =>
                copycat.someOf(seed, [0, 5], org_underwriters),
              created_by_id: copycat.oneOf(seed, [
                ...org_underwriters,
                ...org_agents,
              ]).user_id,
              assignee_id: copycat.oneOf(seed + index.toString(), [
                ...org_underwriters,
                ...org_agents,
              ]).user_id,
              priority_id: copycat.int(seed, {
                min: 0,
                max: task_priorities.length - 1,
              }),
              status_id: copycat.int(seed, {
                min: 0,
                max: task_statuses.length - 1,
              }),
              task_event: x =>
                x({ min: 0, max: 10 }, ({ seed }) => ({
                  created_by: copycat.oneOf(seed, [
                    ...org_underwriters,
                    ...org_agents,
                  ]).user_id,
                  timestamp: copycat.dateString(seed, {
                    max: new Date(),
                    min: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
                  }),
                  comment: copycat.bool(seed)
                    ? copycat.words(seed, { min: 0, max: 30 })
                    : null,
                  metadata: {
                    parts: [
                      {
                        primary: false,
                        text: faker.lorem.words({ min: 1, max: 3 }),
                      },
                      {
                        primary: true,
                        text:
                          copycat.oneOf(seed, [
                            ...task_statuses,
                            ...task_priorities,
                          ]).label ?? "unknown",
                      },
                      {
                        primary: false,
                        text: faker.lorem.words({ min: 1, max: 3 }),
                      },
                    ],
                  },
                  source: faker.lorem.word(),
                })),
            })),
          property: x =>
            x({ min: 1, max: 3 }, ({ seed }) => ({
              tags: copycat.words(seed, { min: 1, max: 5 }).split(" "),
              ...genAddress(),
            })),
          deal_user: copycat.someOf(
            seed,
            [0, org_underwriters.length],
            org_underwriters,
          ),
          interest_rate: Number.parseFloat(
            faker.number
              .float({
                fractionDigits: 6,
                max: 0.07,
                min: 0.035,
              })
              .toFixed(4),
          ),
          loan_amount: Number.parseFloat(
            faker.number
              .float({
                max: 10_000_000,
                min: 100_000,
              })
              .toFixed(2),
          ),
          loan_processing_fee: Number.parseFloat(
            faker.number
              .float({
                fractionDigits: 2,
                max: 3000,
                min: 15,
              })
              .toFixed(2),
          ),
          source: faker.lorem.word(),
          ssbs_score: faker.number.int({
            max: 1000,
            min: 500,
          }),
          deal_state_id: copycat.oneOf(seed, deal_state).id,
          winnability: copycat.int(seed, {
            max: 100,
            min: 0,
          }),
        };
      }),
    );
    // Insert more deal versions for opportuinities
    for (const opportunity_id of opportunityIds) {
      await seed.deal(x =>
        x({ min: 0, max: 4 }, ({ seed }) => ({
          opportunity_id,
          label: copycat.words(seed, { min: 1, max: 3 }),
          task: x =>
            x({ min: 0, max: 10 }, ({ seed, index }) => ({
              task_subscriber: () =>
                copycat.someOf(seed, [0, 5], org_underwriters),
              assignee_id: copycat.oneOf(seed + index.toString(), [
                ...org_underwriters,
                ...org_agents,
              ]).user_id,
              created_by_id: copycat.oneOf(seed, [
                ...org_underwriters,
                ...org_agents,
              ]).user_id,
              priority_id: copycat.int(seed, {
                min: 0,
                max: task_priorities.length - 1,
              }),
              status_id: copycat.int(seed, {
                min: 0,
                max: task_statuses.length - 1,
              }),
              task_event: x =>
                x({ min: 0, max: 10 }, ({ seed }) => ({
                  created_by: copycat.oneOf(seed, [
                    ...org_underwriters,
                    ...org_agents,
                  ]).user_id,
                  comment: copycat.bool(seed)
                    ? copycat.words(seed, { min: 0, max: 30 })
                    : null,
                  timestamp: copycat.dateString(seed, {
                    max: new Date(),
                    min: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
                  }),
                  metadata: {
                    parts: [
                      {
                        primary: false,
                        text: faker.lorem.words({ min: 1, max: 3 }),
                      },
                      {
                        primary: true,
                        text:
                          copycat.oneOf(seed, [
                            ...task_statuses,
                            ...task_priorities,
                          ]).label ?? "unknown",
                      },
                      {
                        primary: false,
                        text: faker.lorem.words({ min: 1, max: 3 }),
                      },
                    ],
                  },
                  source: faker.lorem.word(),
                })),
            })),
          property: x =>
            x({ min: 1, max: 3 }, ({ seed }) => ({
              tags: copycat.words(seed, { min: 1, max: 5 }).split(" "),
              ...genAddress(),
            })),
          deal_user: () => copycat.someOf(seed, [0, 10], org_underwriters),
          interest_rate: Number.parseFloat(
            faker.number
              .float({
                fractionDigits: 6,
                max: 0.07,
                min: 0.035,
              })
              .toFixed(4),
          ),
          loan_amount: Number.parseFloat(
            faker.number
              .float({
                max: 10_000_000,
                min: 100_000,
              })
              .toFixed(2),
          ),
          loan_processing_fee: Number.parseFloat(
            faker.number
              .float({
                fractionDigits: 2,
                max: 3000,
                min: 15,
              })
              .toFixed(2),
          ),
          source: faker.lorem.word(),
          ssbs_score: faker.number.int({
            max: 1000,
            min: 500,
          }),
          created_by_id: faker.helpers.arrayElement(users).user_id,
          deal_assignee: () => copycat.someOf(seed, [0, 3], org_underwriters),
          deal_state_id: copycat.oneOf(seed, deal_state).id,
          winnability: copycat.int(seed, {
            max: 100,
            min: 0,
          }),
        })),
      );
    }
  }
}

main()
  .then(() => {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  })
  .catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  });
