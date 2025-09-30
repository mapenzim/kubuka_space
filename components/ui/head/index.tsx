"use client"

import { Popover, PopoverButton, PopoverGroup, PopoverPanel, Transition } from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { cn } from "~/lib/utils";
import ProfileDropdown from "./dropdown";
import { MobileHead } from "./mobile-menu";
import { Solutions } from "./parts/solutions";
import { ViewMore } from "./parts/viewMore";
import { ViewResources } from "./parts/resources";
import { RecentPosts } from "./parts/recent-posts";
import { LogInIcon } from "lucide-react";

export function NavigationBar({ user }: any) {

  return (
    <Popover 
      className="bg-white fixed top-0 right-0 left-0 z-30 hover:shadow-sm shadow-fuchsia-400"
    >
      <div className="w-full lg:max-w-7xl lg:px-4 px-6">
        <div className="flex w-full justify-between items-center border-b-2 border-gray-100 py-2 md:justify-start md:space-x-10 ">
          <div className="flex justify-start">
            <Link href="/">
              <span className="sr-only">Kubuka</span>
              <Image
                className="h-8 w-auto sm:h-10"
                src={"/images/kubuka-logo.png"}
                alt="main logo"
                width={20}
                height={20}
              />
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <PopoverButton className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </PopoverButton>
          </div>
          <PopoverGroup as="nav" className="hidden w-full lg:flex justify-center space-x-10">
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <PopoverButton
                      className={cn(
                        open ? 'text-gray-900' : 'text-gray-500',
                        'group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      )}
                    >
                      <span>Solutions</span>
                      <ChevronDownIcon
                        className={cn(
                          open ? 'text-gray-600' : 'text-gray-400',
                          'ml-2 h-5 w-5 group-hover:text-gray-500'
                        )}
                        aria-hidden="true"
                      />
                    </PopoverButton>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <PopoverPanel className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                          <Solutions />
                          <ViewMore />
                        </div>
                      </PopoverPanel>
                    </Transition>
                  </>
                )}
              </Popover>

            <Link href="/store" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/blog" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Blog
            </Link>

            <Popover className="relative">
              {({ open }) => (
                <>
                  <PopoverButton
                    className={cn(
                      open ? 'text-gray-900' : 'text-gray-500',
                      'group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    )}
                  >
                    <span>More</span>
                    <ChevronDownIcon
                      className={cn(
                        open ? 'text-gray-600' : 'text-gray-400',
                        'ml-2 h-5 w-5 group-hover:text-gray-500'
                      )}
                      aria-hidden="true"
                    />
                  </PopoverButton>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <PopoverPanel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0">
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <ViewResources />
                        <RecentPosts />
                      </div>
                    </PopoverPanel>
                  </Transition>
                </>
              )}
            </Popover>
          </PopoverGroup>
          <div className="hidden lg:flex items-center justify-end md:flex-1 lg:w-0">
            {
              !user ? (
                <a
                  className="block items-center justify-items-center rounded-full text-sm hover:bg-teal-100 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-10 p-1.5 h-10 bg-teal-200/10 text-indigo-400 border border-dashed border-indigo-300 cursor-pointer"
                  href="/authentication"
                >
                  <LogInIcon />
                </a>
              ) : (
              <ProfileDropdown />
              )
            }
          </div>
        </div>
      </div>
      {/** Mobile Head */}
      <MobileHead />
    </Popover>
  );
};
