import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

type NftCardProps = {
    listed?: boolean;
};

const NFTCard = ({ nftData, listed = false }: NftCardProps) => {
    return (
        <div className="p-4 w-full md:w-1/2 lg:px-4 lg:w-1/3 transition ease-in-out hover:scale-105">
            <Link href="/nft">
                <article className={clsx("container overflow-hidden rounded-3xl shadow-lg p-6 hover:cursor-pointer hover:shadow-xl",
                    listed && "bg-gray-800",
                    !listed && "bg-gray-700"
                )}>
                    <img className="w-full rounded-2xl mb-4"
                        src="doodles.png"
                    />
                    <div className="flex justify-between max-w-sm">
                        <div>
                            <div className="text-2xl font-bold">Doodles #8876</div>
                            <div className="text-gray-400 font-medium">Doodles Collection</div>
                        </div>
                        {listed ?
                            (<div className="pt-2">
                                <div className="text-gray-400 text-sm">Price</div>
                                <div className="text-xl font-bold">3.59 ETH</div>
                            </div>) :
                            (<div className="pt-2 text-xl font-bold text-spritzig">
                                Unlisted
                            </div>)
                        }
                    </div>
                    {listed &&
                        (<div>
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
                            </div>
                        </div>)
                    }
                </article>
            </Link>
        </div>
  )
}

export default NFTCard