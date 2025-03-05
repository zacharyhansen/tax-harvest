export interface StripeSession {
  id: string;
  client_secret: string | null;
}

export interface StripeProduct {
  id: string;

  active: boolean;

  description: string | null;

  marketing_features: StripeMarketingFeature[];
}

export interface StripeMarketingFeature {
  name?: string;
}
