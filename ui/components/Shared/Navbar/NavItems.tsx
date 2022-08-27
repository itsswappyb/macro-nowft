import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Disclosure } from '@headlessui/react'

const navigation = [
    { name: 'Home', url: '/'},
    { name: 'Discover', url: '/discover'},
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

type NavItemProps = {
    url?: string;
    name?: string;
    current?: boolean;
    mobile?: boolean;
};

type NavItemsProps = {
    mobile?: boolean;
}

const NavItem = ({ url, name, current, mobile = false }: NavItemProps) => {
    return (
      <Link href={url}>
        {mobile ? (
          <Disclosure.Button
            key={name}
            as="a"
            href={url}
            className={classNames(
              current ? 'text-white' : 'text-gray-500 hover:text-white',
              'block px-3 py-2 rounded-md text-base font-medium'
            )}
            aria-current={current ? 'page' : undefined}
          >
            {name}
          </Disclosure.Button>
        ) : (
          <a
            key={name}
            href={url}
            className={classNames(
              current ? 'text-white' : 'text-gray-500 hover:text-white',
              'px-3 py-2 rounded-md text-base font-semibold'
            )}
            aria-current={current ? 'page' : undefined}
          >
            {name}
          </a>
        )}
      </Link>
    )
}

const NavItems = ({ mobile }: NavItemsProps) => {
    const router = useRouter()
    return (
        <>
            {navigation.map((item) => (
                <NavItem
                  key={item.name}
                  url={item.url} 
                  name={item.name} 
                  current={router.pathname == item.url} 
                  mobile={mobile}
                />
            ))}
        </>
    )
}

export default NavItems