import React, { useState, useEffect } from 'react'
import NFTCard from '@components/Shared/NFTCard'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useAccount } from 'wagmi'
import { shortenAddress } from '@utils/shortenAddress'
import ConnectWallet from '@components/Shared/ConnectWallet'
import Loading from '@components/Shared/Loading'
import { Alchemy, Network } from "alchemy-sdk";

const MyCollection = () => {
    const [nftCollected, setNftCollected] = useState([])
    const { address, isConnected } = useAccount()

    const alchemy = new Alchemy({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMYKEY,
      network: Network.ETH_MAINNET,
    });

    async function getNFTs() {
      const nfts = await alchemy.nft.getNftsForOwner(address);
      setNftCollected(nfts["ownedNfts"]);
      console.log(nftCollected);
    }

    useEffect(() => {
        setNftCollected(null)
        if (isConnected) {
          getNFTs()
        }
    }, [address])
    
    return (
        <div className="px-2 py-2 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 px-4 sm:px-0">
            {isConnected ?
            (<>
              <div className="mt-16 mb-5 font-semibold text-center">
                <Jazzicon diameter={100} seed={jsNumberForAddress(address)}/>
                <div className="mt-3 text-2xl">{shortenAddress(address)}</div>
              </div>
                  {nftCollected ?
                    (<>
                      <div className="container mt-6 mb-12 mx-auto px-4 md:px-12">
                        <div className="flex flex-wrap">
                          {
                            nftCollected.map((item) => (
                              <NFTCard
                                nftData={item}
                                listed={false}
                              />
                            ))
                          }
                        </div>
                      </div>
                    </>) :
                    (<>
                      <div className="pt-16 text-center">
                        <Loading />
                        <div className="mt-6 text-xl mx-auto">Loading NFTs</div>
                      </div>
                    </>)
                  }
            </>) :
            (<>
              <div className="mt-16 mb-5 font-semibold text-center justify-center">
                <div className="mt-3 text-2xl">Connect your wallet to view your NFTs</div>
                <div className="mt-8 text-center justify-center w-64 mx-auto">
                  <ConnectWallet />
                </div>
              </div>
            </>)
            }
          </div>
        </div>
    )
}

export default MyCollection