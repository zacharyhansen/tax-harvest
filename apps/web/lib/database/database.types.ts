export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      _AssetToUser: {
        Row: {
          A: string;
          B: string;
        };
        Insert: {
          A: string;
          B: string;
        };
        Update: {
          A?: string;
          B?: string;
        };
        Relationships: [
          {
            foreignKeyName: '_AssetToUser_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'Asset';
            referencedColumns: ['symbol'];
          },
          {
            foreignKeyName: '_AssetToUser_A_fkey';
            columns: ['A'];
            isOneToOne: false;
            referencedRelation: 'LotCurrent';
            referencedColumns: ['symbol'];
          },
          {
            foreignKeyName: '_AssetToUser_B_fkey';
            columns: ['B'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      _prisma_migrations: {
        Row: {
          applied_steps_count: number;
          checksum: string;
          finished_at: string | null;
          id: string;
          logs: string | null;
          migration_name: string;
          rolled_back_at: string | null;
          started_at: string;
        };
        Insert: {
          applied_steps_count?: number;
          checksum: string;
          finished_at?: string | null;
          id: string;
          logs?: string | null;
          migration_name: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Update: {
          applied_steps_count?: number;
          checksum?: string;
          finished_at?: string | null;
          id?: string;
          logs?: string | null;
          migration_name?: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Relationships: [];
      };
      Account: {
        Row: {
          accountValueTotal: number | null;
          authConnectionId: string;
          balanceAccount: number | null;
          balanceMoneyMarket: number | null;
          balanceShortAdjustment: number | null;
          cashAvailableForInvestment: number | null;
          cashBalance: number | null;
          cashBuyingPower: number | null;
          cashForOpenOrders: number | null;
          cashNet: number | null;
          cashOpenOrderReserveDT: number | null;
          cashSettledForInvestment: number | null;
          cashUnsettledForInvestment: number | null;
          closedDate: string | null;
          createdAt: string;
          createdById: string;
          description: string | null;
          displayName: string;
          equityRegt: number | null;
          equityRegtPercent: number | null;
          externalId: string | null;
          fundsWithheldFromPurchasingPower: number | null;
          fundsWithheldFromWithdrawal: number | null;
          id: string;
          institution: Database['public']['Enums']['AccountInstitution'];
          key: string | null;
          liveURL: string | null;
          liveURLCreated: string | null;
          marginBuyingPower: number | null;
          marginBuyingPowerDT: number | null;
          marginOpenOrderReserveDT: number | null;
          marketValueTotal: number | null;
          mode: Database['public']['Enums']['AccountMode'] | null;
          optionLevel: Database['public']['Enums']['OptionLevel'] | null;
          plaidAccountMask: string | null;
          plaidAccountName: string | null;
          portfolioId: string;
          provider: Database['public']['Enums']['AccountProvider'];
          raw: Json | null;
          setRealizedValues: boolean;
          status: Database['public']['Enums']['AccountStatus'];
          subType: string | null;
          type: string;
          updatedAt: string;
          uploadedPositions: boolean;
        };
        Insert: {
          accountValueTotal?: number | null;
          authConnectionId: string;
          balanceAccount?: number | null;
          balanceMoneyMarket?: number | null;
          balanceShortAdjustment?: number | null;
          cashAvailableForInvestment?: number | null;
          cashBalance?: number | null;
          cashBuyingPower?: number | null;
          cashForOpenOrders?: number | null;
          cashNet?: number | null;
          cashOpenOrderReserveDT?: number | null;
          cashSettledForInvestment?: number | null;
          cashUnsettledForInvestment?: number | null;
          closedDate?: string | null;
          createdAt?: string;
          createdById: string;
          description?: string | null;
          displayName?: string;
          equityRegt?: number | null;
          equityRegtPercent?: number | null;
          externalId?: string | null;
          fundsWithheldFromPurchasingPower?: number | null;
          fundsWithheldFromWithdrawal?: number | null;
          id?: string;
          institution: Database['public']['Enums']['AccountInstitution'];
          key?: string | null;
          liveURL?: string | null;
          liveURLCreated?: string | null;
          marginBuyingPower?: number | null;
          marginBuyingPowerDT?: number | null;
          marginOpenOrderReserveDT?: number | null;
          marketValueTotal?: number | null;
          mode?: Database['public']['Enums']['AccountMode'] | null;
          optionLevel?: Database['public']['Enums']['OptionLevel'] | null;
          plaidAccountMask?: string | null;
          plaidAccountName?: string | null;
          portfolioId: string;
          provider?: Database['public']['Enums']['AccountProvider'];
          raw?: Json | null;
          setRealizedValues?: boolean;
          status?: Database['public']['Enums']['AccountStatus'];
          subType?: string | null;
          type?: string;
          updatedAt?: string;
          uploadedPositions?: boolean;
        };
        Update: {
          accountValueTotal?: number | null;
          authConnectionId?: string;
          balanceAccount?: number | null;
          balanceMoneyMarket?: number | null;
          balanceShortAdjustment?: number | null;
          cashAvailableForInvestment?: number | null;
          cashBalance?: number | null;
          cashBuyingPower?: number | null;
          cashForOpenOrders?: number | null;
          cashNet?: number | null;
          cashOpenOrderReserveDT?: number | null;
          cashSettledForInvestment?: number | null;
          cashUnsettledForInvestment?: number | null;
          closedDate?: string | null;
          createdAt?: string;
          createdById?: string;
          description?: string | null;
          displayName?: string;
          equityRegt?: number | null;
          equityRegtPercent?: number | null;
          externalId?: string | null;
          fundsWithheldFromPurchasingPower?: number | null;
          fundsWithheldFromWithdrawal?: number | null;
          id?: string;
          institution?: Database['public']['Enums']['AccountInstitution'];
          key?: string | null;
          liveURL?: string | null;
          liveURLCreated?: string | null;
          marginBuyingPower?: number | null;
          marginBuyingPowerDT?: number | null;
          marginOpenOrderReserveDT?: number | null;
          marketValueTotal?: number | null;
          mode?: Database['public']['Enums']['AccountMode'] | null;
          optionLevel?: Database['public']['Enums']['OptionLevel'] | null;
          plaidAccountMask?: string | null;
          plaidAccountName?: string | null;
          portfolioId?: string;
          provider?: Database['public']['Enums']['AccountProvider'];
          raw?: Json | null;
          setRealizedValues?: boolean;
          status?: Database['public']['Enums']['AccountStatus'];
          subType?: string | null;
          type?: string;
          updatedAt?: string;
          uploadedPositions?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'Account_authConnectionId_fkey';
            columns: ['authConnectionId'];
            isOneToOne: false;
            referencedRelation: 'AuthConnection';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Account_createdById_fkey';
            columns: ['createdById'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Account_portfolioId_fkey';
            columns: ['portfolioId'];
            isOneToOne: false;
            referencedRelation: 'Portfolio';
            referencedColumns: ['id'];
          },
        ];
      };
      Asset: {
        Row: {
          active: boolean;
          assetClass: Database['public']['Enums']['AssetClass'];
          assetTypeCode: string | null;
          cik: string | null;
          compositeFigi: string | null;
          currencyName: string | null;
          delistedDate: string | null;
          description: string | null;
          homepageUrl: string | null;
          iconUrl: string | null;
          lastClose: number;
          lastHigh: number;
          lastLow: number;
          lastOpen: number;
          lastPrice: number;
          lastUpdated: string;
          lastVolume: number;
          lastVolumeWeighted: number;
          listDate: string | null;
          locale: Database['public']['Enums']['AssetLocale'];
          logoUrl: string | null;
          marketCap: number | null;
          name: string | null;
          plaid_security_id: string | null;
          primaryExchange: string | null;
          shareClassSharesOutstanding: number | null;
          sicCode: string | null;
          sicDescription: string | null;
          symbol: string;
          todaysChange: number;
          todaysChangePerc: number;
          totalEmployees: number | null;
          type: string;
        };
        Insert: {
          active?: boolean;
          assetClass?: Database['public']['Enums']['AssetClass'];
          assetTypeCode?: string | null;
          cik?: string | null;
          compositeFigi?: string | null;
          currencyName?: string | null;
          delistedDate?: string | null;
          description?: string | null;
          homepageUrl?: string | null;
          iconUrl?: string | null;
          lastClose?: number;
          lastHigh?: number;
          lastLow?: number;
          lastOpen?: number;
          lastPrice?: number;
          lastUpdated?: string;
          lastVolume?: number;
          lastVolumeWeighted?: number;
          listDate?: string | null;
          locale?: Database['public']['Enums']['AssetLocale'];
          logoUrl?: string | null;
          marketCap?: number | null;
          name?: string | null;
          plaid_security_id?: string | null;
          primaryExchange?: string | null;
          shareClassSharesOutstanding?: number | null;
          sicCode?: string | null;
          sicDescription?: string | null;
          symbol: string;
          todaysChange?: number;
          todaysChangePerc?: number;
          totalEmployees?: number | null;
          type?: string;
        };
        Update: {
          active?: boolean;
          assetClass?: Database['public']['Enums']['AssetClass'];
          assetTypeCode?: string | null;
          cik?: string | null;
          compositeFigi?: string | null;
          currencyName?: string | null;
          delistedDate?: string | null;
          description?: string | null;
          homepageUrl?: string | null;
          iconUrl?: string | null;
          lastClose?: number;
          lastHigh?: number;
          lastLow?: number;
          lastOpen?: number;
          lastPrice?: number;
          lastUpdated?: string;
          lastVolume?: number;
          lastVolumeWeighted?: number;
          listDate?: string | null;
          locale?: Database['public']['Enums']['AssetLocale'];
          logoUrl?: string | null;
          marketCap?: number | null;
          name?: string | null;
          plaid_security_id?: string | null;
          primaryExchange?: string | null;
          shareClassSharesOutstanding?: number | null;
          sicCode?: string | null;
          sicDescription?: string | null;
          symbol?: string;
          todaysChange?: number;
          todaysChangePerc?: number;
          totalEmployees?: number | null;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Asset_assetTypeCode_fkey';
            columns: ['assetTypeCode'];
            isOneToOne: false;
            referencedRelation: 'AssetType';
            referencedColumns: ['code'];
          },
        ];
      };
      AssetType: {
        Row: {
          assetClass: Database['public']['Enums']['AssetClass'];
          code: string;
          description: string;
          locale: Database['public']['Enums']['AssetLocale'];
        };
        Insert: {
          assetClass: Database['public']['Enums']['AssetClass'];
          code: string;
          description: string;
          locale: Database['public']['Enums']['AssetLocale'];
        };
        Update: {
          assetClass?: Database['public']['Enums']['AssetClass'];
          code?: string;
          description?: string;
          locale?: Database['public']['Enums']['AssetLocale'];
        };
        Relationships: [];
      };
      AuthConnection: {
        Row: {
          authedAt: string;
          createdAt: string;
          externalId: string;
          id: string;
          isSyncing: boolean;
          portfolioId: string;
          secret: string | null;
          source: Database['public']['Enums']['AuthSource'];
          syncedAt: string | null;
          token: string | null;
          type: Database['public']['Enums']['AuthType'];
          updatedAt: string;
          userId: string;
          verificationUrl: string | null;
          verifier: string | null;
        };
        Insert: {
          authedAt?: string;
          createdAt?: string;
          externalId: string;
          id?: string;
          isSyncing?: boolean;
          portfolioId: string;
          secret?: string | null;
          source: Database['public']['Enums']['AuthSource'];
          syncedAt?: string | null;
          token?: string | null;
          type: Database['public']['Enums']['AuthType'];
          updatedAt?: string;
          userId: string;
          verificationUrl?: string | null;
          verifier?: string | null;
        };
        Update: {
          authedAt?: string;
          createdAt?: string;
          externalId?: string;
          id?: string;
          isSyncing?: boolean;
          portfolioId?: string;
          secret?: string | null;
          source?: Database['public']['Enums']['AuthSource'];
          syncedAt?: string | null;
          token?: string | null;
          type?: Database['public']['Enums']['AuthType'];
          updatedAt?: string;
          userId?: string;
          verificationUrl?: string | null;
          verifier?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'AuthConnection_portfolioId_fkey';
            columns: ['portfolioId'];
            isOneToOne: false;
            referencedRelation: 'Portfolio';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'AuthConnection_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      File: {
        Row: {
          accountId: string;
          createdAt: string;
          displayName: string;
          fileType: Database['public']['Enums']['FileType'];
          gcpFilename: string;
          id: string;
          type: string;
          updatedAt: string;
          uploadedBy: string;
        };
        Insert: {
          accountId: string;
          createdAt?: string;
          displayName: string;
          fileType?: Database['public']['Enums']['FileType'];
          gcpFilename: string;
          id?: string;
          type: string;
          updatedAt?: string;
          uploadedBy: string;
        };
        Update: {
          accountId?: string;
          createdAt?: string;
          displayName?: string;
          fileType?: Database['public']['Enums']['FileType'];
          gcpFilename?: string;
          id?: string;
          type?: string;
          updatedAt?: string;
          uploadedBy?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'File_accountId_fkey';
            columns: ['accountId'];
            isOneToOne: false;
            referencedRelation: 'Account';
            referencedColumns: ['id'];
          },
        ];
      };
      Harvest: {
        Row: {
          amount: number;
          createdAt: string;
          createdById: string;
          date: string;
          id: string;
          label: string;
          portfolioId: string;
          step: Database['public']['Enums']['HarvestStep'];
          type: Database['public']['Enums']['HarvestType'];
          updatedAt: string;
        };
        Insert: {
          amount: number;
          createdAt?: string;
          createdById: string;
          date?: string;
          id?: string;
          label: string;
          portfolioId: string;
          step?: Database['public']['Enums']['HarvestStep'];
          type: Database['public']['Enums']['HarvestType'];
          updatedAt?: string;
        };
        Update: {
          amount?: number;
          createdAt?: string;
          createdById?: string;
          date?: string;
          id?: string;
          label?: string;
          portfolioId?: string;
          step?: Database['public']['Enums']['HarvestStep'];
          type?: Database['public']['Enums']['HarvestType'];
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Harvest_createdById_fkey';
            columns: ['createdById'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Harvest_portfolioId_fkey';
            columns: ['portfolioId'];
            isOneToOne: false;
            referencedRelation: 'Portfolio';
            referencedColumns: ['id'];
          },
        ];
      };
      HarvestTransaction: {
        Row: {
          counterTransaction: boolean;
          createdAt: string;
          harvestId: string;
          harvestTransactionItemId: string;
          id: string;
          notify: boolean;
          replacementTransactionItemId: string | null;
          revert: boolean;
          revertDate: string;
          revertHarvestTransactionItemId: string | null;
          revertReplacementTransactionItemId: string | null;
          updatedAt: string;
        };
        Insert: {
          counterTransaction?: boolean;
          createdAt?: string;
          harvestId: string;
          harvestTransactionItemId: string;
          id?: string;
          notify?: boolean;
          replacementTransactionItemId?: string | null;
          revert?: boolean;
          revertDate?: string;
          revertHarvestTransactionItemId?: string | null;
          revertReplacementTransactionItemId?: string | null;
          updatedAt?: string;
        };
        Update: {
          counterTransaction?: boolean;
          createdAt?: string;
          harvestId?: string;
          harvestTransactionItemId?: string;
          id?: string;
          notify?: boolean;
          replacementTransactionItemId?: string | null;
          revert?: boolean;
          revertDate?: string;
          revertHarvestTransactionItemId?: string | null;
          revertReplacementTransactionItemId?: string | null;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'HarvestTransaction_harvestId_fkey';
            columns: ['harvestId'];
            isOneToOne: false;
            referencedRelation: 'Harvest';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'HarvestTransaction_harvestTransactionItemId_fkey';
            columns: ['harvestTransactionItemId'];
            isOneToOne: false;
            referencedRelation: 'HarvestTransactionItem';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'HarvestTransaction_replacementTransactionItemId_fkey';
            columns: ['replacementTransactionItemId'];
            isOneToOne: false;
            referencedRelation: 'HarvestTransactionItem';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'HarvestTransaction_revertHarvestTransactionItemId_fkey';
            columns: ['revertHarvestTransactionItemId'];
            isOneToOne: false;
            referencedRelation: 'HarvestTransactionItem';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'HarvestTransaction_revertReplacementTransactionItemId_fkey';
            columns: ['revertReplacementTransactionItemId'];
            isOneToOne: false;
            referencedRelation: 'HarvestTransactionItem';
            referencedColumns: ['id'];
          },
        ];
      };
      HarvestTransactionItem: {
        Row: {
          assetSymbol: string;
          completedDate: string | null;
          createdAt: string;
          id: string;
          lotId: string | null;
          orderType: Database['public']['Enums']['OrderType'];
          price: number;
          quantity: number;
          updatedAt: string;
        };
        Insert: {
          assetSymbol: string;
          completedDate?: string | null;
          createdAt?: string;
          id?: string;
          lotId?: string | null;
          orderType: Database['public']['Enums']['OrderType'];
          price: number;
          quantity: number;
          updatedAt?: string;
        };
        Update: {
          assetSymbol?: string;
          completedDate?: string | null;
          createdAt?: string;
          id?: string;
          lotId?: string | null;
          orderType?: Database['public']['Enums']['OrderType'];
          price?: number;
          quantity?: number;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'HarvestTransactionItem_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'Asset';
            referencedColumns: ['symbol'];
          },
          {
            foreignKeyName: 'HarvestTransactionItem_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'LotCurrent';
            referencedColumns: ['symbol'];
          },
          {
            foreignKeyName: 'HarvestTransactionItem_lotId_fkey';
            columns: ['lotId'];
            isOneToOne: false;
            referencedRelation: 'Lot';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'HarvestTransactionItem_lotId_fkey';
            columns: ['lotId'];
            isOneToOne: false;
            referencedRelation: 'LotCurrent';
            referencedColumns: ['id'];
          },
        ];
      };
      Log: {
        Row: {
          createdAt: string;
          data: Json;
          description: string | null;
          id: number;
          responseStatus: number | null;
          source: Database['public']['Enums']['AuthSource'] | null;
          type: Database['public']['Enums']['LogType'];
        };
        Insert: {
          createdAt?: string;
          data: Json;
          description?: string | null;
          id?: number;
          responseStatus?: number | null;
          source?: Database['public']['Enums']['AuthSource'] | null;
          type: Database['public']['Enums']['LogType'];
        };
        Update: {
          createdAt?: string;
          data?: Json;
          description?: string | null;
          id?: number;
          responseStatus?: number | null;
          source?: Database['public']['Enums']['AuthSource'] | null;
          type?: Database['public']['Enums']['LogType'];
        };
        Relationships: [];
      };
      Lot: {
        Row: {
          accountId: string;
          acquiredDate: string | null;
          adjPrice: number | null;
          assetSymbol: string;
          availableQty: number | null;
          commPerShare: number | null;
          costTotal: number | null;
          createdAt: string;
          exchangeRate: number | null;
          excludeFromHarvest: number;
          externalId: string | null;
          feesPerShare: number | null;
          fileId: string | null;
          gainDay: number | null;
          gainDayPct: number | null;
          gainTotal: number | null;
          id: string;
          legNo: number | null;
          locationCode: number | null;
          lotSourceCode: number | null;
          marketValue: number | null;
          orderNo: number | null;
          originalQty: number | null;
          paymentCurrency: string | null;
          positionId: string | null;
          price: number | null;
          remainingQty: number | null;
          settlementCurrency: string | null;
          shortType: number | null;
          termCode: number | null;
          totalCostForGainPct: number | null;
          updatedAt: string;
        };
        Insert: {
          accountId: string;
          acquiredDate?: string | null;
          adjPrice?: number | null;
          assetSymbol: string;
          availableQty?: number | null;
          commPerShare?: number | null;
          costTotal?: number | null;
          createdAt?: string;
          exchangeRate?: number | null;
          excludeFromHarvest?: number;
          externalId?: string | null;
          feesPerShare?: number | null;
          fileId?: string | null;
          gainDay?: number | null;
          gainDayPct?: number | null;
          gainTotal?: number | null;
          id?: string;
          legNo?: number | null;
          locationCode?: number | null;
          lotSourceCode?: number | null;
          marketValue?: number | null;
          orderNo?: number | null;
          originalQty?: number | null;
          paymentCurrency?: string | null;
          positionId?: string | null;
          price?: number | null;
          remainingQty?: number | null;
          settlementCurrency?: string | null;
          shortType?: number | null;
          termCode?: number | null;
          totalCostForGainPct?: number | null;
          updatedAt?: string;
        };
        Update: {
          accountId?: string;
          acquiredDate?: string | null;
          adjPrice?: number | null;
          assetSymbol?: string;
          availableQty?: number | null;
          commPerShare?: number | null;
          costTotal?: number | null;
          createdAt?: string;
          exchangeRate?: number | null;
          excludeFromHarvest?: number;
          externalId?: string | null;
          feesPerShare?: number | null;
          fileId?: string | null;
          gainDay?: number | null;
          gainDayPct?: number | null;
          gainTotal?: number | null;
          id?: string;
          legNo?: number | null;
          locationCode?: number | null;
          lotSourceCode?: number | null;
          marketValue?: number | null;
          orderNo?: number | null;
          originalQty?: number | null;
          paymentCurrency?: string | null;
          positionId?: string | null;
          price?: number | null;
          remainingQty?: number | null;
          settlementCurrency?: string | null;
          shortType?: number | null;
          termCode?: number | null;
          totalCostForGainPct?: number | null;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Lot_accountId_fkey';
            columns: ['accountId'];
            isOneToOne: false;
            referencedRelation: 'Account';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Lot_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'Asset';
            referencedColumns: ['symbol'];
          },
          {
            foreignKeyName: 'Lot_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'LotCurrent';
            referencedColumns: ['symbol'];
          },
          {
            foreignKeyName: 'Lot_fileId_fkey';
            columns: ['fileId'];
            isOneToOne: false;
            referencedRelation: 'File';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Lot_positionId_fkey';
            columns: ['positionId'];
            isOneToOne: false;
            referencedRelation: 'Position';
            referencedColumns: ['id'];
          },
        ];
      };
      Portfolio: {
        Row: {
          createdAt: string;
          createdById: string | null;
          harvestCycleWeeks: number;
          harvestShareDollarThreshold: number;
          harvestTickerBucketDollarSizeLong: number;
          harvestTickerBucketDollarSizeShort: number;
          harvestTickerBucketLowerLimitLong: number;
          harvestTickerBucketLowerLimitShort: number;
          id: string;
          name: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          createdById?: string | null;
          harvestCycleWeeks?: number;
          harvestShareDollarThreshold?: number;
          harvestTickerBucketDollarSizeLong?: number;
          harvestTickerBucketDollarSizeShort?: number;
          harvestTickerBucketLowerLimitLong?: number;
          harvestTickerBucketLowerLimitShort?: number;
          id?: string;
          name?: string;
          updatedAt?: string;
        };
        Update: {
          createdAt?: string;
          createdById?: string | null;
          harvestCycleWeeks?: number;
          harvestShareDollarThreshold?: number;
          harvestTickerBucketDollarSizeLong?: number;
          harvestTickerBucketDollarSizeShort?: number;
          harvestTickerBucketLowerLimitLong?: number;
          harvestTickerBucketLowerLimitShort?: number;
          id?: string;
          name?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Portfolio_createdById_fkey';
            columns: ['createdById'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      Position: {
        Row: {
          accountId: string;
          assetSymbol: string;
          change: number | null;
          changePCT: number | null;
          commissionDay: number | null;
          commissionTotal: number | null;
          costPerShare: number | null;
          costTotal: number | null;
          createdAt: string;
          dateAcquired: string | null;
          dateExpiration: string | null;
          externalId: string | null;
          feesDay: number | null;
          feesOther: number | null;
          gainDay: number | null;
          gainTotal: number | null;
          gainTotalPCT: number | null;
          id: string;
          marketValue: number | null;
          pricePaid: number | null;
          quantity: number;
          quoteStatus: string | null;
          type: string | null;
          updatedAt: string;
        };
        Insert: {
          accountId: string;
          assetSymbol: string;
          change?: number | null;
          changePCT?: number | null;
          commissionDay?: number | null;
          commissionTotal?: number | null;
          costPerShare?: number | null;
          costTotal?: number | null;
          createdAt?: string;
          dateAcquired?: string | null;
          dateExpiration?: string | null;
          externalId?: string | null;
          feesDay?: number | null;
          feesOther?: number | null;
          gainDay?: number | null;
          gainTotal?: number | null;
          gainTotalPCT?: number | null;
          id?: string;
          marketValue?: number | null;
          pricePaid?: number | null;
          quantity: number;
          quoteStatus?: string | null;
          type?: string | null;
          updatedAt?: string;
        };
        Update: {
          accountId?: string;
          assetSymbol?: string;
          change?: number | null;
          changePCT?: number | null;
          commissionDay?: number | null;
          commissionTotal?: number | null;
          costPerShare?: number | null;
          costTotal?: number | null;
          createdAt?: string;
          dateAcquired?: string | null;
          dateExpiration?: string | null;
          externalId?: string | null;
          feesDay?: number | null;
          feesOther?: number | null;
          gainDay?: number | null;
          gainTotal?: number | null;
          gainTotalPCT?: number | null;
          id?: string;
          marketValue?: number | null;
          pricePaid?: number | null;
          quantity?: number;
          quoteStatus?: string | null;
          type?: string | null;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Position_accountId_fkey';
            columns: ['accountId'];
            isOneToOne: false;
            referencedRelation: 'Account';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Position_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'Asset';
            referencedColumns: ['symbol'];
          },
          {
            foreignKeyName: 'Position_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'LotCurrent';
            referencedColumns: ['symbol'];
          },
        ];
      };
      PriceHourly: {
        Row: {
          assetSymbol: string;
          close: number;
          high: number;
          low: number;
          numberOfTransactions: number | null;
          open: number;
          startDate: string;
          volume: number;
          volumeWeightAverage: number;
        };
        Insert: {
          assetSymbol: string;
          close: number;
          high: number;
          low: number;
          numberOfTransactions?: number | null;
          open: number;
          startDate: string;
          volume: number;
          volumeWeightAverage: number;
        };
        Update: {
          assetSymbol?: string;
          close?: number;
          high?: number;
          low?: number;
          numberOfTransactions?: number | null;
          open?: number;
          startDate?: string;
          volume?: number;
          volumeWeightAverage?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'PriceHourly_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'Asset';
            referencedColumns: ['symbol'];
          },
          {
            foreignKeyName: 'PriceHourly_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'LotCurrent';
            referencedColumns: ['symbol'];
          },
        ];
      };
      PriceHourlyVector: {
        Row: {
          assetSymbol: string;
          createdAt: string;
          id: string;
          startDate: string;
          updatedAt: string;
          vector: string | null;
          vectorWindow: Database['public']['Enums']['VectorWindow'];
        };
        Insert: {
          assetSymbol: string;
          createdAt?: string;
          id?: string;
          startDate: string;
          updatedAt?: string;
          vector?: string | null;
          vectorWindow: Database['public']['Enums']['VectorWindow'];
        };
        Update: {
          assetSymbol?: string;
          createdAt?: string;
          id?: string;
          startDate?: string;
          updatedAt?: string;
          vector?: string | null;
          vectorWindow?: Database['public']['Enums']['VectorWindow'];
        };
        Relationships: [
          {
            foreignKeyName: 'PriceHourlyVector_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'Asset';
            referencedColumns: ['symbol'];
          },
          {
            foreignKeyName: 'PriceHourlyVector_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'LotCurrent';
            referencedColumns: ['symbol'];
          },
        ];
      };
      RealizedPAndL: {
        Row: {
          accountId: string;
          createdAt: string;
          deferredLoss: number;
          dividend: number;
          id: string;
          longTerm: number;
          shortTerm: number;
          updatedAt: string;
          year: number;
        };
        Insert: {
          accountId: string;
          createdAt?: string;
          deferredLoss?: number;
          dividend?: number;
          id?: string;
          longTerm?: number;
          shortTerm?: number;
          updatedAt?: string;
          year: number;
        };
        Update: {
          accountId?: string;
          createdAt?: string;
          deferredLoss?: number;
          dividend?: number;
          id?: string;
          longTerm?: number;
          shortTerm?: number;
          updatedAt?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'RealizedPAndL_accountId_fkey';
            columns: ['accountId'];
            isOneToOne: false;
            referencedRelation: 'Account';
            referencedColumns: ['id'];
          },
        ];
      };
      Transaction: {
        Row: {
          accountId: string;
          amount: number | null;
          assetSymbol: string;
          createdAt: string;
          datailsURI: string | null;
          description: string | null;
          detailsURI: string | null;
          displaySymbol: string | null;
          externalId: string;
          fee: number | null;
          id: string;
          memo: string | null;
          paymentCurrency: string | null;
          postDate: string | null;
          price: number | null;
          quantity: number | null;
          securityType: string | null;
          settlementCurrency: string | null;
          settlementDate: string | null;
          subtype: string | null;
          transactionDate: string | null;
          type: string | null;
          updatedAt: string;
        };
        Insert: {
          accountId: string;
          amount?: number | null;
          assetSymbol: string;
          createdAt?: string;
          datailsURI?: string | null;
          description?: string | null;
          detailsURI?: string | null;
          displaySymbol?: string | null;
          externalId: string;
          fee?: number | null;
          id?: string;
          memo?: string | null;
          paymentCurrency?: string | null;
          postDate?: string | null;
          price?: number | null;
          quantity?: number | null;
          securityType?: string | null;
          settlementCurrency?: string | null;
          settlementDate?: string | null;
          subtype?: string | null;
          transactionDate?: string | null;
          type?: string | null;
          updatedAt?: string;
        };
        Update: {
          accountId?: string;
          amount?: number | null;
          assetSymbol?: string;
          createdAt?: string;
          datailsURI?: string | null;
          description?: string | null;
          detailsURI?: string | null;
          displaySymbol?: string | null;
          externalId?: string;
          fee?: number | null;
          id?: string;
          memo?: string | null;
          paymentCurrency?: string | null;
          postDate?: string | null;
          price?: number | null;
          quantity?: number | null;
          securityType?: string | null;
          settlementCurrency?: string | null;
          settlementDate?: string | null;
          subtype?: string | null;
          transactionDate?: string | null;
          type?: string | null;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Transaction_accountId_fkey';
            columns: ['accountId'];
            isOneToOne: false;
            referencedRelation: 'Account';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Transaction_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'Asset';
            referencedColumns: ['symbol'];
          },
          {
            foreignKeyName: 'Transaction_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'LotCurrent';
            referencedColumns: ['symbol'];
          },
        ];
      };
      User: {
        Row: {
          createdAt: string;
          email: string | null;
          hashedRefreshToken: string | null;
          id: string;
          name: string | null;
          phoneNumber: string | null;
          photo: string | null;
          plaidCustomerId: string | null;
          plaidUserToken: string | null;
          stripeCustomerId: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          email?: string | null;
          hashedRefreshToken?: string | null;
          id: string;
          name?: string | null;
          phoneNumber?: string | null;
          photo?: string | null;
          plaidCustomerId?: string | null;
          plaidUserToken?: string | null;
          stripeCustomerId: string;
          updatedAt?: string;
        };
        Update: {
          createdAt?: string;
          email?: string | null;
          hashedRefreshToken?: string | null;
          id?: string;
          name?: string | null;
          phoneNumber?: string | null;
          photo?: string | null;
          plaidCustomerId?: string | null;
          plaidUserToken?: string | null;
          stripeCustomerId?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      UsersOnPortfolios: {
        Row: {
          createdAt: string;
          portfolioId: string;
          role: Database['public']['Enums']['PortfolioRole'];
          updatedAt: string;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          portfolioId: string;
          role?: Database['public']['Enums']['PortfolioRole'];
          updatedAt?: string;
          userId: string;
        };
        Update: {
          createdAt?: string;
          portfolioId?: string;
          role?: Database['public']['Enums']['PortfolioRole'];
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'UsersOnPortfolios_portfolioId_fkey';
            columns: ['portfolioId'];
            isOneToOne: false;
            referencedRelation: 'Portfolio';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'UsersOnPortfolios_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'User';
            referencedColumns: ['id'];
          },
        ];
      };
      VectorGraph: {
        Row: {
          assetSymbol: string;
          createdAt: string;
          data: Json[] | null;
          id: string;
          priceHourlyVectorId: string;
          type: Database['public']['Enums']['Graph'];
          updatedAt: string;
        };
        Insert: {
          assetSymbol: string;
          createdAt?: string;
          data?: Json[] | null;
          id?: string;
          priceHourlyVectorId: string;
          type: Database['public']['Enums']['Graph'];
          updatedAt?: string;
        };
        Update: {
          assetSymbol?: string;
          createdAt?: string;
          data?: Json[] | null;
          id?: string;
          priceHourlyVectorId?: string;
          type?: Database['public']['Enums']['Graph'];
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'VectorGraph_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'Asset';
            referencedColumns: ['symbol'];
          },
          {
            foreignKeyName: 'VectorGraph_assetSymbol_fkey';
            columns: ['assetSymbol'];
            isOneToOne: false;
            referencedRelation: 'LotCurrent';
            referencedColumns: ['symbol'];
          },
          {
            foreignKeyName: 'VectorGraph_priceHourlyVectorId_fkey';
            columns: ['priceHourlyVectorId'];
            isOneToOne: false;
            referencedRelation: 'PriceHourlyVector';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      LotCurrent: {
        Row: {
          accountId: string | null;
          acquiredDate: string | null;
          costBasis: number | null;
          dollarPerSharePnL: number | null;
          gainTotal: number | null;
          gainTotalPct: number | null;
          id: string | null;
          lastPrice: number | null;
          price: number | null;
          remainingQty: number | null;
          symbol: string | null;
          taxGain: Database['public']['Enums']['TaxGain'] | null;
          value: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Lot_accountId_fkey';
            columns: ['accountId'];
            isOneToOne: false;
            referencedRelation: 'Account';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      create_role_if_not_exists: {
        Args: {
          role_name: string;
          with_login?: boolean;
          with_noinherit?: boolean;
          with_password?: string;
        };
        Returns: undefined;
      };
      hnswhandler: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      ivfflathandler: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      vector_avg: {
        Args: {
          '': number[];
        };
        Returns: string;
      };
      vector_dims: {
        Args: {
          '': string;
        };
        Returns: number;
      };
      vector_norm: {
        Args: {
          '': string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          '': string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          '': string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          '': unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      AccountInstitution:
        | 'BROKERAGE'
        | 'GLOBALTRADING'
        | 'NONUS'
        | 'STOCKPLAN'
        | 'LENDING'
        | 'HELOC'
        | 'HEIL'
        | 'ONTRACK'
        | 'GENPACT'
        | 'AUTO'
        | 'AUTOLOAN'
        | 'BETA'
        | 'LOYALTY'
        | 'SBASKET'
        | 'CC_BALANCETRANSFER'
        | 'GENPACT_LEAD'
        | 'GANIS'
        | 'MORTGAGE'
        | 'EXTERNAL'
        | 'FUTURES'
        | 'VISA'
        | 'RJO'
        | 'WDBH';
      AccountMode: 'CASH' | 'MARGIN' | 'CHECKING' | 'IRA' | 'SAVINGS' | 'CD';
      AccountProvider: 'ETRADE' | 'PLAID' | 'SYSTEM';
      AccountStatus: 'ACTIVE' | 'CLOSED';
      AssetClass: 'stocks' | 'cryto' | 'fx' | 'otc' | 'indices' | 'UNKNOWN';
      AssetLocale: 'us' | 'global';
      AuthSource: 'ETRADE_REQUEST' | 'ETRADE_ACCESS' | 'PLAID' | 'LOCAL';
      AuthType: 'OAUTH_1' | 'PLAID_LINK';
      EtradeAccountType:
        | 'AMMCHK'
        | 'ARO'
        | 'BCHK'
        | 'BENFIRA'
        | 'BENFROTHIRA'
        | 'BENF_ESTATE_IRA'
        | 'BENF_MINOR_IRA'
        | 'BENF_ROTH_ESTATE_IRA'
        | 'BENF_ROTH_MINOR_IRA'
        | 'BENF_ROTH_TRUST_IRA'
        | 'BENF_TRUST_IRA'
        | 'BRKCD'
        | 'BROKER'
        | 'CASH'
        | 'C_CORP'
        | 'CONTRIBUTORY'
        | 'COVERDELL_ESA'
        | 'CONVERSION_ROTH_IRA'
        | 'COMM_PROP'
        | 'CONSERVATOR'
        | 'CORPORATION'
        | 'CSA'
        | 'CUSTODIAL'
        | 'DVP'
        | 'ESTATE'
        | 'EMPCHK'
        | 'EMPMMCA'
        | 'ETCHK'
        | 'ETMMCHK'
        | 'HEIL'
        | 'HELOC'
        | 'INDCHK'
        | 'INDIVIDUAL'
        | 'INDIVIDUAL_K'
        | 'INVCLUB'
        | 'INVCLUB_C_CORP'
        | 'INVCLUB_LLC_C_CORP'
        | 'INVCLUB_LLC_PARTNERSHIP'
        | 'INVCLUB_LLC_S_CORP'
        | 'INVCLUB_PARTNERSHIP'
        | 'INVCLUB_S_CORP'
        | 'INVCLUB_TRUST'
        | 'IRA_ROLLOVER'
        | 'JOINT'
        | 'JTTEN'
        | 'JTWROS'
        | 'LLC_C_CORP'
        | 'LLC_PARTNERSHIP'
        | 'LLC_S_CORP'
        | 'LLP'
        | 'LLP_C_CORP'
        | 'LLP_S_CORP'
        | 'IRA'
        | 'IRACD'
        | 'MONEY_PURCHASE'
        | 'MARGIN'
        | 'MRCHK'
        | 'MUTUAL_FUND'
        | 'NONCUSTODIAL'
        | 'NON_PROFIT'
        | 'OTHER'
        | 'PARTNER'
        | 'PARTNERSHIP'
        | 'PARTNERSHIP_C_CORP'
        | 'PARTNERSHIP_S_CORP'
        | 'PDT_ACCOUNT'
        | 'PM_ACCOUNT'
        | 'PREFCD'
        | 'PREFIRACD'
        | 'PROFIT_SHARING'
        | 'PROPRIETARY'
        | 'REGCD'
        | 'ROTHIRA'
        | 'ROTH_INDIVIDUAL_K'
        | 'ROTH_IRA_MINORS'
        | 'SARSEPIRA'
        | 'S_CORP'
        | 'SEPIRA'
        | 'SIMPLE_IRA'
        | 'TIC'
        | 'TRD_IRA_MINORS'
        | 'TRUST'
        | 'VARCD'
        | 'VARIRACD';
      FileType: 'ETRADE_LOTS';
      Graph: 'RETURN_PCT_LINE';
      HarvestStep: 'CONFIGURE' | 'REVIEW' | 'COMPLETE';
      HarvestType:
        | 'SELL'
        | 'REDUCE_COST_BASIS'
        | 'REDUCE_TAXES'
        | 'CAPTURE_GAINS_TAX_FREE';
      LogType: 'EXTERNAL_SYNC' | 'AUTH';
      OptionLevel: 'NO_OPTIONS' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4';
      OrderType:
        | 'BUY'
        | 'SELL'
        | 'SELL_TO_CLOSE'
        | 'SELL_TO_OPEN'
        | 'BUY_TO_CLOSE'
        | 'BUY_TO_OPEN';
      PlaidLinkStatus: 'NONE' | 'CREATED' | 'SESSION_FINISHED' | 'SYNCED';
      PortfolioRole: 'ADMIN' | 'VIEWER';
      TaxGain: 'LONG' | 'SHORT';
      VectorWindow: 'MONTH_1' | 'MONTH_3' | 'MONTH_6' | 'YEAR_1' | 'YEAR_2';
    };
    CompositeTypes: Record<never, never>;
  };
}

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
