import React from 'react'
import { SearchIcon } from '@heroicons/react/outline'
import NFTCardMock from '@components/Shared/NFTCardMock'

import { mockExplore } from '@components/mockData.js'

const Discover = () => {

  return (
    <div className="px-2 py-2 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4 px-4 sm:px-0">
        <div className="mt-8 mb-5">
            <h3 className="font-semibold text-2xl text-center">
                Explore Collectibles
            </h3>
        </div>
        <div className="flex">
          <div className="relative mx-auto text-gray-500 flex bg-gray-700 rounded-xl px-2">
            <SearchIcon className="h-4 w-4 ml-2 my-auto"/>
            <input className="w-96 h-8 px-5 pr-16 text-sm bg-transparent" type="text" name="search" placeholder="Search items and collections"/>  
          </div>
        </div>
        <div className="container mt-6 mb-12 mx-auto px-4 md:px-12">
          <div className="flex flex-wrap">
            {mockExplore.map((item) => (
              <NFTCardMock listed={true}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Discover