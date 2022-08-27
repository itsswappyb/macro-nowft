import React from 'react'
import Link from 'next/link'
import { ParentGrid, GridSeven, GridFive } from '@components/Grid'

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-24 py-5">
        <ParentGrid className="mt-24">
            <GridSeven>
                <div>
                    <div className="text-6xl font-bold mb-6">Buy Now, Pay Later for NFTs has arrived</div>
                    <div className="text-gray-500 font-medium w-4/5 capitalize">Secure prices, avoid potential risks and save upfront cost on NFTs with as low as 25% down.</div>
                    <div className="flex mt-8">
                    <Link
                        href="/discover"
                    >
                        <button className="bg-corsair font-semibold py-3 px-16 rounded-2xl mr-8 hover:bg-cyan-900">
                            Buy
                        </button>
                    </Link>
                    <Link
                        href="/mycollection"
                    >
                        <button className="bg-transparent font-semibold py-3 px-16 border border-spritzig rounded-2xl hover:bg-spritzig">
                            List
                        </button>
                    </Link>
                    </div>
                </div>
            </GridSeven>
            <GridFive className="mt-24 md:mt-0">
                <img className="object-cover h-72 w-full rounded-3xl" src="/bayc.png"/>
            </GridFive>
        </ParentGrid>
    </div>
  )
}

export default Home