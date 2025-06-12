'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/tabs';
import { Input } from '@repo/ui/components/input';
import { Button } from '@repo/ui/components/button';

import { Loader2, Trash2 } from 'lucide-react';
import { toast } from '@repo/ui/components/toast-sonner';
import { usePortfolio } from '~/modules/portfolio';
import {
  useAddUserToPortfolioMutation,
  useInviteUsersToPlatformMutation,
  useRemoveUserFromPortfolioMutation,
  usePortfolioAuthedQuery,
  useUsersOnPortfolioQuery,
  UsersOnPortfolioDocument,
} from '~/generated/gql';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog';
export default function InvitePage() {
  const [platformEmail, setPlatformEmail] = useState('');
  const [portfolioEmail, setPortfolioEmail] = useState('');
  const [invitePlatformUser, { loading: platformLoading }] =
    useInviteUsersToPlatformMutation();

  const [addUserToPortfolio, { loading: portfolioLoading }] =
    useAddUserToPortfolioMutation({
      refetchQueries: [UsersOnPortfolioDocument],
      awaitRefetchQueries: true,
    });

  const [removeUserFromPortfolio] = useRemoveUserFromPortfolioMutation({
    refetchQueries: [UsersOnPortfolioDocument],
    awaitRefetchQueries: true,
  });

  const { data: portfolioData } = usePortfolioAuthedQuery();

  const { data: usersOnPortfolioData } = useUsersOnPortfolioQuery();

  const handlePlatformInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      invitePlatformUser({
        variables: {
          emails: [platformEmail],
        },
      }),
      {
        loading: 'Sending platform invitation',
        success: 'Platform invitation sent',
        error: 'Failed to send platform invitation',
      }
    );
    setPlatformEmail('');
  };

  const handlePortfolioInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      addUserToPortfolio({
        variables: {
          email: portfolioEmail,
        },
      }),
      {
        loading: 'Adding user to portfolio',
        success: ({ data }) =>
          data?.addUserToPortfolio
            ? 'User added to portfolio'
            : 'User invited to platform. Once they sign up, they can be added to the portfolio',
        error: 'Failed to add user to portfolio',
      }
    );
    setPortfolioEmail('');
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Invite Friends</h1>

      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2">
          <TabsTrigger value="platform">Tax Harvest.AI Invite</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Collaboration</TabsTrigger>
        </TabsList>

        <TabsContent value="platform">
          <Card>
            <CardHeader>
              <CardTitle>Invite to Platform</CardTitle>
              <CardDescription>
                Invite new users to join TaxHarvest platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePlatformInvite} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={platformEmail}
                    onChange={e => setPlatformEmail(e.target.value)}
                    required
                    disabled={platformLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={platformLoading}
                >
                  {platformLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Platform Invitation'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>Invite to Portfolio</CardTitle>
              <CardDescription>
                {portfolioData
                  ? `Invite users to collaborate on portfolio: ${portfolioData.portfolioAuthed.name}`
                  : null}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePortfolioInvite} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={portfolioEmail}
                    onChange={e => setPortfolioEmail(e.target.value)}
                    required
                    disabled={!portfolioData || portfolioLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!portfolioData || portfolioLoading}
                >
                  {portfolioLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Add user to Portfolio'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="mt-2 space-y-4">
            {usersOnPortfolioData?.usersOnPortfolio?.map(user => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center justify-between">
                      {user.name}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={
                              portfolioData?.portfolioAuthed.createdById ===
                              user.id
                            }
                          >
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove the user from the portfolio.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() =>
                                removeUserFromPortfolio({
                                  variables: { userId: user.id },
                                })
                              }
                            >
                              Remove User
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
