import React from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useDisconnect } from "wagmi";
import Link from 'next/link'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const ProfileDropdown = () => {

    const { disconnect } = useDisconnect();

  return (
    <div className="z-50">
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md py-1 bg-gray-800">
                <Menu.Item>
                    {({ active }) => (
                        <Link
                            href="/installments"
                        >
                            <div className={classNames(active ? 'text-white' : 'text-gray-500 hover:text-white', 'block px-4 py-2 hover:cursor-pointer')}>
                                My Installments
                            </div>
                        </Link>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <Link
                            href="/mycollection"
                        >
                            <div className={classNames(active ? 'text-white' : 'text-gray-500 hover:text-white', 'block px-4 py-2 hover:cursor-pointer')}>
                                My Collection
                            </div>
                        </Link>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <button
                            className={classNames(active ? 'text-white' : 'text-gray-500 hover:text-white', 'block px-4 py-2')}
                            onClick={disconnect}
                        >
                            Log Out
                        </button>
                    )}
                </Menu.Item>
            </Menu.Items>
        </Transition>
    </div>
  )
}

export default ProfileDropdown