import React from 'react'
import { SearchIcon } from '@heroicons/react/outline'
import NFTCard from '@components/Shared/NFTCard'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import { mockExplore } from '@components/mockData.js'

const Home = () => {
    return (
        <div className="px-2 py-2 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 px-4 sm:px-0">
            
            <div className="mt-16 mb-5 font-semibold  text-center">
                <Jazzicon diameter={100} seed={jsNumberForAddress("0xb3646A67E800a8bCd6Fb7872BE18FDE2CE16473c")}/>
                <div className="mt-3 text-2xl">0x3d2....863</div>
            </div>
            <div className="container mt-6 mb-12 mx-auto px-4 md:px-12">
              <div className="flex flex-wrap">
                <NFTCard listed={true}/>
                <NFTCard listed={true}/>
                <NFTCard listed={true}/>
                <NFTCard listed={true}/>
                <NFTCard listed={false}/>
                <NFTCard listed={false}/>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Home