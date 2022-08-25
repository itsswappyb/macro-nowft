import React from 'react'
import Image from 'next/Image'
import { ParentGrid, GridSix } from '@components/Grid'

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 md:px-24 lg:px-48 py-5">
        <ParentGrid className="mt-12">
            <GridSix>
                <img className="w-full rounded-2xl mb-4"
                    src="doodles.png"
                />
                <div className="mt-12 text-gray-200">
                  <div className="mb-4 text-2xl font-bold text-white">Description</div>
                  <div>A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.</div>
                  <div className="max-w-x mt-4">
                    <div className="flex justify-between mb-4">
                      <div className="font-bold">Contract Address</div>
                      <div>0x49cf...a28b</div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="font-bold">Token ID</div>
                      <div>4133</div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="font-bold">Token Standard</div>
                      <div>ERC-721</div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="font-bold">Blockchain</div>
                      <div>Ethereum</div>
                    </div>
                  </div>
                </div>
            </GridSix>
            <GridSix>
                <div className="mb-6">
                  <div className="text-5xl font-bold mb-2">Doodles #8876</div>
                  <div className="text-2xl font-bold">Doodles Collection</div>
                </div>
                <div className="mb-6">
                  <div className="text-gray-400 mb-1">Sale ends</div>
                  <div className="text-2xl font-bold">August 24, 2022 at 11:17pm GMT+7</div>
                </div>
                <div className="mb-6">
                  <div className="text-gray-400 mb-1">Base Price</div>
                  <div className="text-2xl font-bold">3.59 ETH</div>
                </div>
                <div>
                  <div className="text-gray-300 font-bold mt-4 mb-1">BNPL Terms</div>
                  <div className="flex max-w-sm justify-between">
                      <div>
                          <div className="text-gray-400 text-xs mb-1">Min. Down Payment</div>
                          <div className="font-bold">3 ETH</div>
                      </div>
                      <div>
                          <div className="text-gray-400 text-xs mb-1">Loan Duration</div>
                          <div className="font-bold">30 Days</div>
                      </div>
                      <div>
                          <div className="text-gray-400 text-xs mb-1">Interest (APR)</div>
                          <div className="font-bold">5.00%</div>
                      </div>
                      <div>
                          <div className="text-gray-400 text-xs mb-1">Total BNPL Price</div>
                          <div className="font-bold">4.80 ETH</div>
                      </div>
                  </div>
              </div>
              <button className="mt-5 bg-corsair font-semibold py-3 px-8 border border-corsair rounded-2xl mr-8">
                  BNPL Now
              </button>
            </GridSix>
        </ParentGrid>
    </div>
  )
}

export default Home