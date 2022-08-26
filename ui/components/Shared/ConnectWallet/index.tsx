import React from 'react'
import { ConnectKitButton } from "connectkit";
import { shortenAddress } from '@utils/shortenAddress'
import { Disclosure, Menu } from '@headlessui/react'
import { MenuIcon, XIcon, UserCircleIcon } from '@heroicons/react/outline'

const index = () => {
  return (
    <div>
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, hide, address, ensName }) => {
          return (
            <div>
              {isConnected ? 
                (<Menu.Button className="flex bg-transparent text-white py-2 px-6 border border-spritzig rounded-2xl">
                  <UserCircleIcon className="w-5 h-5 my-auto mr-1"/>
                  <p>{shortenAddress(address)}</p>
                </Menu.Button>) : 
                (<div onClick={show} className="bg-transparent text-white py-2 px-6 border border-spritzig rounded-2xl hover:cursor-pointer hover:bg-spritzig">
                    Connect Wallet
                </div>)
              }
            </div>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  )
}

export default index