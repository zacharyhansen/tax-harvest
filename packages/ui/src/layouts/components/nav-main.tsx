'use client';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@repo/ui/components/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@repo/ui/components/sidebar';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@repo/ui/components/badge';

export type NavItem = {
	title: string;
	url: string;
	icon?: LucideIcon;
	isActive?: boolean;
	beta?: boolean;
	items?: {
		title: string;
		url: string;
		icon?: LucideIcon;
	}[];
	roles?: string[];
};

export function NavMain({
	items,
	title,
	pathname,
	userRole,
}: Readonly<{
	items: NavItem[];
	title: string;
	userRole?: string;
	pathname: string;
}>) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>{title}</SidebarGroupLabel>
			<SidebarMenu>
				{items
					.filter((item) =>
						item.roles ? item.roles.includes(userRole ?? '') : true,
					)
					.map((item) => (
						<Collapsible
							key={item.title}
							asChild
							className="group/collapsible"
							defaultOpen={item.items?.some(
								(subItem) =>
									pathname === subItem.url ||
									pathname.includes(`${subItem.url}/`),
							)}
						>
							<SidebarMenuItem>
								{item.items ? (
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton
												tooltip={item.title}
												isActive={pathname === item.url}
											>
												{item.icon && <item.icon />}
												<span>{item.title}</span>
												{item.beta && (
													<Badge variant="secondary" className="ml-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800 px-1.5 py-0 text-[10px] uppercase">
														Beta
													</Badge>
												)}
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<AnimatePresence>
											<CollapsibleContent>
												<motion.div
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: 'auto', opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													transition={{ duration: 0.3, ease: 'easeInOut' }}
												>
													<SidebarMenuSub>
														{item.items.map((subItem) => (
															<SidebarMenuSubItem key={subItem.title}>
																<SidebarMenuSubButton
																	asChild
																	isActive={
																		pathname === subItem.url ||
																		pathname.includes(`${subItem.url}/`)
																	}
																>
																	<Link href={subItem.url}>
																		{subItem.icon && <subItem.icon />}
																		<span>{subItem.title}</span>
																	</Link>
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														))}
													</SidebarMenuSub>
												</motion.div>
											</CollapsibleContent>
										</AnimatePresence>
									</>
								) : (
									<Link href={item.url}>
										<SidebarMenuButton
											tooltip={item.title}
											isActive={
												pathname === item.url ||
												pathname.includes(`${item.url}/`)
											}
										>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											{item.beta && (
												<Badge variant="secondary" className="ml-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800 px-1.5 py-0 text-[10px] uppercase">
													Beta
												</Badge>
											)}
										</SidebarMenuButton>
									</Link>
								)}
							</SidebarMenuItem>
						</Collapsible>
					))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
