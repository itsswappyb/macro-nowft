import React from 'react'
import Link from 'next/link'
import { Disclosure, Menu } from '@headlessui/react'
import { MenuIcon, XIcon, UserCircleIcon } from '@heroicons/react/outline'
import NavItems from './NavItems'
import ProfileDropdown from './ProfileDropdown'
import Image from 'next/Image'
import ConnectWallet from '@components/Shared/ConnectWallet'

const Navbar = () => {

  return (
    <Disclosure as="nav" className="bg-corbeau sticky top-0 z-10">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-16">
            <div className="relative flex h-16 items-center">
              <div className="flex-1 flex justify-start mr-auto">
                {/* Mobile menu button*/}
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-white">
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                {/* Menu */}
                <div className="hidden sm:block justify-center pt-1 mr-12 hover:cursor-pointer">
                  <Link href="/">
                    <Image src="/NowFT_transparent.svg" height={120} width={100}/>
                  </Link>
                </div>
                <div className="flex items-center justify-center">
                  <div className="hidden sm:block">
                    <div className="flex space-x-4 font-satoshi">
                      <NavItems/>
                    </div>
                  </div>
                </div>
              </div>
              {/* Profile w./ dropdown */}
              <Menu as="div" className="relative pr-2 sm:pr-0">
                <div>
                  {/* {(isAuthenticated)
                    ? (
                      <Menu.Button className="flex bg-transparent text-white py-2 px-6 border border-spritzig rounded-2xl">
                        <UserCircleIcon className="w-5 h-5 my-auto mr-1"/>
                        <p>0x3d2....863</p>
                      </Menu.Button>
                    )
                    : <button className="bg-transparent text-white py-2 px-6 border border-spritzig rounded-2xl">
                        Connect Wallet
                      </button>
                  } */}
                  <ConnectWallet/>
                </div>
                <ProfileDropdown/>
              </Menu>
            </div>
          </div>
          {/* Dropdown menu for mobile */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavItems mobile={true}/>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Navbar