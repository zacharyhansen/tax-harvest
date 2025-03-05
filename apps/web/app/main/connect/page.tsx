'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button, RDialog, RDialogTrigger } from 'ui';
import { CreateAuthConnectionDialog } from 'modules/authConnection';
import PageWrapper from 'modules/page/page-wrapper';
import { PlaidConnectButton } from 'modules/plaid';
import Stepper from 'ui/composed/stepper/stepper';

import etradeIcon from '../../../public/icons/ETrade.svg';

export default function ConnectPage() {
  const [openAuthModal, setOpenAuthModal] = useState(false);

  return (
    <PageWrapper
      title="Supported Connectors"
      description=" We never store your credentials and use them only to retrieve a secure
        access tokens."
    >
      <Stepper
        steps={[
          {
            id: '1',
            title: 'Link Account(s)',
          },
          {
            id: '2',
            title: 'Setup Account(s)',
          },
          {
            id: '3',
            title: 'Harvest',
          },
        ]}
      />
      <div className="flex space-x-4">
        <PlaidConnectButton variant="outline" className="h-40 w-40" />
        <RDialog open={openAuthModal} onOpenChange={setOpenAuthModal}>
          <RDialogTrigger asChild>
            <Button variant="outline" className="h-40 w-40">
              <Image src={etradeIcon} alt="Etrade" width={100} height={100} />
            </Button>
          </RDialogTrigger>
          <CreateAuthConnectionDialog
            open={openAuthModal}
            closeDialog={() => {
              setOpenAuthModal(false);
            }}
          />
        </RDialog>
      </div>
    </PageWrapper>
  );
}
