"use client";

import { Avatar } from "@/components/catalyst/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/catalyst/dropdown";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "@/components/catalyst/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "@/components/catalyst/sidebar";
import { SidebarLayout } from "@/components/catalyst/sidebar-layout";
import LogoutButton from "@/components/LogoutButton";
import { getEvents } from "@/data";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  CubeIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/16/solid";
import {
  BuildingOfficeIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  HomeIcon,
  InboxStackIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TableCellsIcon,
  TicketIcon,
  MegaphoneIcon,
} from "@heroicons/react/20/solid";

import { useSession } from "next-auth/react";

import { usePathname } from "next/navigation";

function AccountDropdownMenu({
  anchor,
}: {
  anchor: "top start" | "bottom end";
}) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />

      <DropdownItem href="#">
        <ArrowRightStartOnRectangleIcon />

        <DropdownLabel>
          {" "}
          <LogoutButton text="Sign out" />
        </DropdownLabel>

      </DropdownItem>
    </DropdownMenu>
  );
}

export function ApplicationLayout({
  events,
  children,
}: {
  events: Awaited<ReturnType<typeof getEvents>>;
  children: React.ReactNode;
}) {
  let pathname = usePathname();

  const { data: session } = useSession();


  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/users/erica.jpg" square />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarItem href="/" current={pathname === "/"}>
              <Avatar src="/teams/catalyst.svg" />
              <SidebarLabel>Admin</SidebarLabel>
            </SidebarItem>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current={pathname === "/"}>
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/companies"
                current={pathname === "/companies"}
              >
                <BuildingOfficeIcon />
                <SidebarLabel>Companies</SidebarLabel>
              </SidebarItem>
              <SidebarHeading>Company types</SidebarHeading>
              <SidebarItem
                href="/companies/status/pending"
                current={pathname === "/companies/status/pending"}
              >
                <TableCellsIcon />
                <SidebarLabel> Pending Companies</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/companies/status/active"
                current={pathname === "/companies/status/rejected"}
              >
                <TableCellsIcon />
                <SidebarLabel>Active Companies</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/companies/status/rejected"
                current={pathname === "/companies/status/rejected"}
              >
                <TableCellsIcon />
                <SidebarLabel>Rejected Companies</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>Only for company users</SidebarHeading>
              <SidebarItem
                href="/categories"
                current={pathname === "/categories"}
              >
                <CircleStackIcon />
                <SidebarLabel>Categories</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/products" current={pathname === "/products"}>
                <CubeIcon />
                <SidebarLabel>Products</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/combo-products"
                current={pathname === "/combo-products"}
              >
                <InboxStackIcon />
                <SidebarLabel>Combo Products</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/Announcements"
                current={pathname === "/Announcements"}
              >
                <MegaphoneIcon />
                <SidebarLabel>Announcements</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
          {/* <SidebarSpacer /> */}

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar
                    src="/users/erica.jpg"
                    className="size-10"
                    square
                    alt=""
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">

               

                      {session?.user?.name}

                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {session?.user.email}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
            <LogoutButton />
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
