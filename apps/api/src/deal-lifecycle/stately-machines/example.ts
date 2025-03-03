// import { assign, createMachine, setup } from "xstate";

// export const machine = setup({
//   types: {
//     context: {} as { error?: string; deal_id: number },
//     events: {} as
//       | { type: "user.price" }
//       | { type: "user.cancel" }
//       | { type: "user.submit" }
//       | { type: "user.archive" }
//       | { type: "system.submit" }
//       | { type: "system.completed" }
//       | { type: "user.approve_price" }
//       | { type: "user.funding_recieved" }
//       | { type: "user.contract_recieved" }
//       | { type: "user.contract_verified" }
//       | { type: "system.contract_recieved" }
//       | { type: "user.underwriting_approved" }
//       | { type: "user.underwriting_completed" },
//   },
//   actions: {
//     sendEmail: function ({ context, event }, params) {
//       // Add your action code here
//       // ...
//     },
//     createTask: function ({ context, event }, params) {
//       // Add your action code here
//     },
//     assign: assign({
//       // ...
//     }),
//   },
//   actors: {
//     validator: createMachine({
//       /* ... */
//     }),
//   },
// }).createMachine({
//   context: {
//     error: "",
//     deal_id: 1,
//   },
//   id: "lifecycle",
//   initial: "submission",
//   description:
//     'Represents the lifecycle of a deal of an opportunity. It is important to remember that an opportunities status is just the status of the active deal within the opportunity - in this way this is effectively a lifecycle for the opportunity as well. The active deal can be swapped out to different one to "move" an opportunity forward or backward in state.',
//   states: {
//     submission: {
//       on: {
//         "user.submit": {
//           target: "submission_validation",
//         },
//         "system.submit": {
//           target: "submission_validation",
//         },
//         "user.archive": {
//           target: "archived",
//         },
//       },
//     },
//     submission_validation: {
//       invoke: {
//         id: "submission_validator",
//         input: {
//           deal_id: "context.deal_id",
//         },
//         onDone: {
//           target: "pre_qualified",
//           actions: [
//             {
//               type: "createTask",
//             },
//             {
//               type: "sendEmail",
//             },
//           ],
//         },
//         onError: {
//           target: "failed_pre_qualification",
//         },
//         src: "validator",
//       },
//     },
//     archived: {},
//     pre_qualified: {
//       on: {
//         "user.price": {
//           target: "pricing",
//         },
//         "user.archive": {
//           target: "archived",
//         },
//       },
//     },
//     failed_pre_qualification: {
//       on: {
//         "user.submit": {
//           target: "submission_validation",
//         },
//         "user.archive": {
//           target: "archived",
//         },
//       },
//     },
//     pricing: {
//       on: {
//         "user.approve_price": {
//           target: "pricing_validation",
//         },
//         "user.archive": {
//           target: "archived",
//         },
//       },
//     },
//     pricing_validation: {
//       invoke: {
//         id: "pricing_validator",
//         input: {
//           deal_id: "context.deal_id",
//         },
//         onDone: {
//           target: "underwriting",
//           actions: {
//             type: "createTask",
//             params: {
//               title: "Ready for underwriting",
//               user_id: 238_923_892,
//               description:
//                 "[deal_id] has scompleted pricing. Please review and send out the contract.",
//             },
//           },
//         },
//         onError: {
//           target: "pricing",
//           actions: {
//             type: "assign",
//             params: {
//               error: "price rejected",
//             },
//           },
//         },
//         src: "validator",
//       },
//     },
//     underwriting: {
//       on: {
//         "user.archive": {
//           target: "archived",
//         },
//         "user.underwriting_completed": {
//           target: "final_underwriting_approval",
//         },
//       },
//     },
//     final_underwriting_approval: {
//       on: {
//         "user.underwriting_approved": {
//           target: "contract_out",
//           actions: {
//             type: "sendEmail",
//             params: {
//               body: "Your contract is ready for review.",
//               from: "zach@gmail.com",
//               subject: "Contract for [deal]",
//             },
//           },
//         },
//         "user.cancel": {
//           target: "archived",
//         },
//       },
//     },
//     contract_out: {
//       on: {
//         "system.contract_recieved": {
//           target: "contract_in",
//           actions: {
//             type: "createTask",
//           },
//         },
//         "user.contract_recieved": {
//           target: "contract_in",
//           actions: {
//             type: "createTask",
//           },
//         },
//         "user.cancel": {
//           target: "archived",
//         },
//       },
//     },
//     contract_in: {
//       on: {
//         "user.contract_verified": {
//           target: "pre_funding",
//           actions: {
//             type: "createTask",
//           },
//         },
//         "user.cancel": {
//           target: "archived",
//         },
//       },
//     },
//     pre_funding: {
//       on: {
//         "user.funding_recieved": {
//           target: "funded",
//         },
//         "user.cancel": {
//           target: "archived",
//         },
//       },
//     },
//     funded: {
//       on: {
//         "system.completed": {
//           target: "completed",
//         },
//         "user.cancel": {
//           target: "archived",
//         },
//       },
//     },
//     completed: {
//       on: {
//         "user.cancel": {
//           target: "archived",
//         },
//       },
//     },
//   },
// });
export const t = "test";
