import React from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const ProfileDropdown = () => {

    const logOut = async () => {
        console.log("logged out");
    }

  return (
    <div className="z-100">
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md py-1 bg-corbeau border-2 border-gray-800">
                <Menu.Item>
                    {({ active }) => (
                        <a
                            href="#"
                            className={classNames(active ? 'text-white' : 'text-gray-500 hover:text-white', 'block px-4 py-2 font-archivo')}
                        >
                            My Profile
                        </a>
                    )}
                </Menu.Item>
                <Menu.Item>
                    {({ active }) => (
                        <a
                            href="#"
                            className={classNames(active ? 'text-white' : 'text-gray-500 hover:text-white', 'block px-4 py-2 font-archivo')}
                            onClick={logOut}
                        >
                            Log Out
                        </a>
                    )}
                </Menu.Item>
            </Menu.Items>
        </Transition>
    </div>
  )
}

export default ProfileDropdown