import type { StepperStep } from './HarvestStepper';

import { HarvestStep, HarvestType } from '~/generated/gql';

export const headerMap: Record<
  StepperStep,
  Record<HarvestType, { title: string; description: string }>
> = {
  [HarvestStep.Configure]: {
    [HarvestType.ReduceTaxes]: {
      description:
        'Do you want to purchase a similar stock while we wait for the wash sale rule.',
      title: 'Stock Replacement & Notification',
    },
    [HarvestType.ReduceCostBasis]: {
      description:
        'Do you want to purchase a similar stock while we wait for the wash sale rule.',
      title: 'Stock Replacement & Notification',
    },
    [HarvestType.Sell]: {
      description:
        'Purchasing a similar stock during the wash sale window reduces the oppurtunity cost of the harvest.',
      title: 'Stock Replacement & Notification',
    },
    [HarvestType.CaptureGainsTaxFree]: {
      description:
        'Purchasing a similar stock during the wash sale window reduces the oppurtunity cost of the harvest.',
      title: 'Stock Replacement & Notification',
    },
  },
  [HarvestStep.Review]: {
    [HarvestType.ReduceTaxes]: {
      description:
        'We do not sell stocks for you. Store this list to make the sales in your brokerage account. We will remind you when it is time to repurchase these positions.',
      title: 'Finalize Sales',
    },
    [HarvestType.ReduceCostBasis]: {
      description:
        'We do not sell stocks for you. Store this list to make the sales in your brokerage account. We will remind you when it is time to repurchase these positions.',
      title: 'Finalize Sales',
    },
    [HarvestType.Sell]: {
      description:
        'We do not sell stocks for you. Store this list to make the sales in your brokerage account. We will remind you when it is time to repurchase these positions.',
      title: 'Finalize Sales',
    },
    [HarvestType.CaptureGainsTaxFree]: {
      description:
        'We do not sell stocks for you. Store this list to make the sales in your brokerage account. We will remind you when it is time to repurchase these positions.',
      title: 'Finalize Sales',
    },
  },
  [HarvestStep.Complete]: {
    [HarvestType.ReduceTaxes]: {
      description:
        "You have completed the Harvest. An overview of all harvests can be found in the left panel 'Harvests' tab.",
      title: 'Congratulations!',
    },
    [HarvestType.ReduceCostBasis]: {
      description:
        "You have completed the Harvest. An overview of all harvests can be found in the left panel 'Harvests' tab.",
      title: 'Congratulations!',
    },
    [HarvestType.Sell]: {
      description:
        "You have completed the Harvest. An overview of all harvests can be found in the left panel 'Harvests' tab.",
      title: 'Congratulations!',
    },
    [HarvestType.CaptureGainsTaxFree]: {
      description:
        "You have completed the Harvest. An overview of all harvests can be found in the left panel 'Harvests' tab.",
      title: 'Congratulations!',
    },
  },
  LOT_SELECTION: {
    [HarvestType.ReduceTaxes]: {
      description: 'Select which lots you plan to sell.',
      title: 'Offset Realized Gains',
    },
    [HarvestType.ReduceCostBasis]: {
      description:
        'Take advantage of your extra losses by offsetting unrealized gains. This will lead you to take profits from your winners tax free, and reduce the amount you pay in the future.',
      title: 'Raise Average Cost Basis',
    },
    [HarvestType.Sell]: {
      description:
        'Optimize your sale event to incur the lowest possible tax burden.',
      title: 'Plan a Sale Event',
    },
    [HarvestType.CaptureGainsTaxFree]: {
      description: 'Use your portolio losses to capture tax free gains.',
      title: 'Capture Tax Free Gains',
    },
  },
};
