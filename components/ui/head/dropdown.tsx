"use client"

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { UserIcon, TicketIcon, PowerIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Logout } from "./signout_btn";

export default function ProfileDropdown() {

  return (
    <div className="relative w-56 text-right z-20">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton
            className="block items-center justify-items-center rounded-full text-sm hover:bg-teal-100 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-10 h-10 bg-teal-200/10 text-indigo-400 border border-dashed border-indigo-300 cursor-pointer"
          >
            <UserIcon className="h-7 w-7 bg-cover object-cover mx-auto" aria-hidden="true" />
          </MenuButton>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <MenuItem>
                <a
                  href="/profile"
                  className="group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-violet-500 hover:text-white text-gray-800"
                >
                  <UserIcon
                    className="mr-2 h-5 w-5 stroke-[2px] fill-[#8B5CF6] hover:fill-white stroke-[#C4B5FD]"
                    aria-hidden="true"
                  />
                    Profile
                </a>
              </MenuItem>
            </div>
            <div className="px-1 py-1 ">
              <MenuItem>
                <a 
                  href="/membership"
                  className="group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-violet-500 hover:text-white text-gray-800"
                >
                  <TicketIcon
                    className="mr-2 h-5 w-5 stroke-[2px] fill-[#8B5CF6] stroke-[#C4B5FD]"
                    aria-hidden='true'
                  />
                  Membership
                </a>
              </MenuItem>
            </div>
            <div className="px-1 py-1">
              <MenuItem>
                <Logout />
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
};
