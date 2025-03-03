import type {
  task_priority__foundation,
  task_status__foundation,
} from "@prisma/client";
import type {
  datasetInputs,
  input_typeEnum,
  schemaEnum,
  state_usaEnum,
} from "@snaplet/seed";

import { faker } from "@snaplet/copycat";

export const task_statuses: Partial<task_status__foundation>[] = [
  { id: 0, label: "Backlog" },
  { id: 1, label: "Todo" },
  { id: 2, label: "In Progress" },
  { id: 3, label: "In Review" },
  { id: 4, label: "Done" },
  { id: 5, label: "Cancelled" },
];

export const task_priorities: Partial<task_priority__foundation>[] = [
  { id: 0, label: "Urgent" },
  { id: 1, label: "High" },
  { id: 2, label: "Medium" },
  { id: 3, label: "Low" },
  { id: 4, label: "No Priority" },
];

export const genUniqueNumeric = (number: number, length: number) => {
  const set = new Set<string>();
  while (set.size < number) {
    set.add(faker.string.numeric(length));
  }
  return [...set];
};

export const genAddress = () => ({
  address: faker.location.streetAddress(),
  address_line_2: faker.location.secondaryAddress(),
  zip: faker.location.zipCode(),
  state: faker.location.state({
    abbreviated: true,
  }) as state_usaEnum,
  city: faker.location.city(),
  county: faker.location.county(),
});

export const range = (n: number) =>
  Array.from({ length: n }, (_, index) => index);

const agGridDefault = {
  input_type: "text" as input_typeEnum,
  ag_width: 200,
  ag_min_width: 50,
  ag_flex: null,
  ag_editable: false,
  ag_resizable: true,
  ag_pinned: null,
  order: 0,
};

export const createDealDataset = (
  configuration_schema: schemaEnum,
): datasetInputs => {
  const datasetId = faker.string.uuid();

  return {
    configuration_schema,
    id: datasetId,
    dataview: () => ({
      configuration_schema,
      role_view_name: "_p_deal__admin",
      constraint: "placeholder",
      dataset_id: datasetId,
      dataview_column_dataview_column_parent_dataview_idTodataview: () => [
        {
          role_column_name: "opportunity_id",
          configuration_schema,
          role_view_name: "_p_deal__admin",
          ...agGridDefault,
          header_group: null,
          dataview_dataview_column_child_dataview_idTodataview: {
            configuration_schema,
            role_view_name: "_p_opportunity__admin",
            constraint: "deal_opportunity_id_fkey",
            dataset_id: datasetId,
            dataview_column_dataview_column_parent_dataview_idTodataview: [
              {
                role_column_name: "label",
                label: "label",
                configuration_schema,
                role_view_name: "_p_opportunity__admin",
                ...agGridDefault,
              },
              {
                role_column_name: "created_at",
                label: "created_at",
                configuration_schema,
                role_view_name: "_p_opportunity__admin",
                ...agGridDefault,
              },
              {
                role_column_name: "external_id",
                label: "external_id",
                configuration_schema,
                role_view_name: "_p_opportunity__admin",
                ...agGridDefault,
              },
            ],
          },
        },
        {
          role_column_name: "label",
          label: "label",
          configuration_schema,
          role_view_name: "_p_deal__admin",
          ...agGridDefault,
          ag_editable: true,
          input_type: "text",
          header_group: null,
        },
        {
          role_column_name: "created_at",
          label: "created_at",
          configuration_schema,
          role_view_name: "_p_deal__admin",
          ...agGridDefault,
          ag_editable: true,
          input_type: "date",
          header_group: null,
        },
        {
          role_column_name: "source",
          label: "source",
          configuration_schema,
          role_view_name: "_p_deal__admin",
          ...agGridDefault,
          header_group: null,
        },
        {
          role_column_name: "appetite",
          label: "appetite",
          header_group: "Machine Learning",
          configuration_schema,
          role_view_name: "_p_deal__admin",
          ...agGridDefault,
          ag_editable: true,
          input_type: "number",
        },
        {
          role_column_name: "winnability",
          label: "winnability",
          header_group: "Machine Learning",
          configuration_schema,
          role_view_name: "_p_deal__admin",
          ...agGridDefault,
          ag_editable: true,
          input_type: "number",
        },
        {
          role_column_name: "ssbs_score",
          label: "ssbs_score",
          configuration_schema,
          role_view_name: "_p_deal__admin",
          ...agGridDefault,
          ag_editable: true,
          input_type: "number",
          header_group: null,
        },
        {
          role_column_name: "external_id",
          label: "external_id",
          configuration_schema,
          role_view_name: "_p_deal__admin",
          ...agGridDefault,
          input_type: "textarea",
          header_group: null,
        },
        {
          role_column_name: "loan_amount",
          label: "loan_amount",
          configuration_schema,
          role_view_name: "_p_deal__admin",
          ...agGridDefault,
          input_type: "usd",
          ag_editable: true,
          header_group: null,
        },
        {
          role_column_name: "loan_processing_fee",
          label: "loan_processing_fee",
          configuration_schema,
          role_view_name: "_p_deal__admin",
          ...agGridDefault,
          input_type: "usd",
          header_group: null,
        },
        {
          role_column_name: "id",
          label: "id",
          configuration_schema,
          role_view_name: "_p_deal__admin",
          ...agGridDefault,
          header_group: null,
        },
        {
          role_column_name: "interest_rate",
          label: "interest_rate",
          configuration_schema,
          role_view_name: "_p_deal__admin",
          ...agGridDefault,
          ag_editable: true,
          input_type: "percentage",
          header_group: null,
        },
      ],
    }),
    query: `
    label,
    source,
    appetite,
    winnability,
    ssbs_score,
    external_id,
    loan_amount,
    loan_processing_fee,
    id,
    interest_rate,
    opportunity_id,
    _p_opportunity__admin!deal_opportunity_id_fkey(
      label,
      external_id,
      created_at
  )`,
  };
};
