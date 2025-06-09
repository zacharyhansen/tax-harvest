import { clerkClient } from '@clerk/nextjs/server'
import { Button } from '@repo/ui/components/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { checkRole } from '~/modules/clerk'

import { SearchUsers } from '../search-users'

import { removeRole, setRole } from './_actions'

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string }>
}) {
  if (!checkRole('admin')) {
    redirect('/')
  }

  const query = (await params.searchParams).search

  const client = clerkClient()

  const users = query ? (await (await client).users.getUserList({ query })).data : []

  return (
    <>
      <p className="p-4">
        For more control see
        {' '}
        <Link
          href="https://dashboard.clerk.com/apps/app_2iq02nd3uM3K6Z9TQbsnfwB67et/instances/ins_2iq02hocj7OaCbX1ICNo5DaqDyn/users"
          className="text-blue-500"
        >
          Clerk Users Page
        </Link>
      </p>

      <SearchUsers />

      {users.map((user) => {
        return (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>
                {user.firstName}
                {' '}
                {user.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <span className="font-bold">Email:</span>
                {' '}
                {
                  user.emailAddresses.find(
                    email => email.id === user.primaryEmailAddressId,
                  )?.emailAddress
                }
              </div>

              <div>
                <span className="font-bold">Role:</span>
                {' '}
                {user.publicMetadata.role as string}
              </div>

              <div className="flex gap-2">
                {/* @ts-expect-error - pullled direct from clerk */}
                <form action={setRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="admin" name="role" />
                  <Button type="submit">Make Admin</Button>
                </form>

                {/* @ts-expect-error - pullled direct from clerk */}
                <form action={removeRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <Button type="submit">Remove Role</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}
