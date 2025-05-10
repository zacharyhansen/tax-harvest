'use client'

import { Button } from '@repo/ui/components/button'
import { cn } from '@repo/ui/utils'
import { Bell, CreditCard, Wallet2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TypedRoutes } from '~/lib/routes'

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: TypedRoutes.settings(),
      label: 'Overview',
      exact: true,
    },
    {
      href: TypedRoutes.settingsPortfolio(),
      label: 'Portfolio',
      icon: Wallet2,
    },
    {
      href: TypedRoutes.settingsNotifications(),
      label: 'Notifications',
      icon: Bell,
    },
    {
      href: TypedRoutes.settingsPayment(),
      label: 'Payment',
      icon: CreditCard,
    },
  ]

  return (
    <nav className="flex flex-col space-y-2">
      {routes.map((route) => {
        const isActive = route.exact ? pathname === route.href : pathname?.startsWith(route.href)

        return (
          <Button
            key={route.href}
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn('justify-start', isActive ? 'bg-muted font-medium' : 'font-normal')}
            asChild
          >
            <Link href={route.href}>
              {route.icon && <route.icon className="mr-2 size-4" />}
              {route.label}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
