import React, { useEffect, useState } from "react";
import { ParentGrid, GridSix } from "@components/Grid";
import EditPost from "./EditPost";
import CheckOut from "./CheckOut";
// import useMarketplace from "@hooks/useMarketplace";
import useMarketplace from "../../hooks/useMarketplace";
import { useAccount } from "wagmi";

const Nft = () => {
    const listed = false;
    const isOwner = true;

    let [isOpen, setIsOpen] = useState<boolean>(false);
    let [tokenUri, setTokenUri] = useState<string>("defaultUri");

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const { mintNft, getTokenUri } = useMarketplace();
    const { address } = useAccount();

    useEffect(() => {
        console.log("address: ", address);
        console.log(tokenUri);
    }, []);
    return (
        <div className="max-w-7xl mx-auto px-8 md:px-24 lg:px-32 py-5">
            <ParentGrid className="mt-12">
                <GridSix>
                    <img className="w-full rounded-2xl mb-4" src="doodles.png" />
                    <div className="mt-12 text-gray-200">
                        <div className="mb-4 text-2xl font-bold text-white">Description</div>
                        <div>
                            A community-driven collectibles project featuring art by Burnt Toast.
                            Doodles come in a joyful range of colors, traits and sizes with a
                            collection size of 10,000. Each Doodle allows its owner to vote for
                            experiences and activations paid for by the Doodles Community Treasury.
                            Burnt Toast is the working alias for Scott Martin, a Canadian–based
                            illustrator, designer, animator and muralist.
                        </div>
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
                    {listed ? (
                        <>
                            <div className="mb-6">
                                <div className="text-gray-400 mb-1">Sale ends</div>
                                <div className="text-2xl font-bold">
                                    August 24, 2022 at 11:17pm GMT+7
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="text-gray-400 mb-1">Base Price</div>
                                <div className="text-2xl font-bold">3.59 ETH</div>
                            </div>
                            <div>
                                <div className="text-gray-300 font-bold mt-4 mb-1">BNPL Terms</div>
                                <div className="flex max-w-sm justify-between">
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">
                                            Minimum Deposit
                                        </div>
                                        <div className="font-bold">3 ETH</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">
                                            Loan Duration (weeks)
                                        </div>
                                        <div className="font-bold">30 Days</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">
                                            Interest (on Price)
                                        </div>
                                        <div className="font-bold">5.00%</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs mb-1">
                                            Total BNPL Price
                                        </div>
                                        <div className="font-bold">4.80 ETH</div>
                                    </div>
                                </div>
                            </div>
                            {isOwner ? (
                                <>
                                    <button
                                        className="mt-5 font-semibold py-3 px-8 border border-spritzig hover:bg-spritzig rounded-2xl"
                                        onClick={openModal}
                                    >
                                        Edit Listing
                                    </button>
                                    <EditPost isOpen={isOpen} closeModal={closeModal} />
                                </>
                            ) : (
                                <>
                                    <button
                                        className="mt-5 bg-corsair font-semibold py-3 px-8 border border-corsair rounded-2xl mr-8"
                                        onClick={openModal}
                                    >
                                        BNPL Now
                                    </button>
                                    <CheckOut isOpen={isOpen} closeModal={closeModal} />
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="text-spritzig text-xl font-bold mb-12">Unlisted</div>
                            <div className="bg-gray-900 rounded-2xl px-6 py-6">
                                <div className="text-gray-400 mb-4">List</div>
                                <form className="w-full">
                                    <div className="md:flex md:items-center mb-4">
                                        <div className="md:w-1/4">
                                            <label className="text-sm block font-medium mb-1 md:mb-0 pr-4">
                                                Price:
                                            </label>
                                        </div>
                                        <div className="md:w-3/4">
                                            <input
                                                className="bg-gray-700 text-gray-400 rounded w-full py-2 px-4 leading-tight"
                                                type="text"
                                                value="Price"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:flex md:items-center mb-4">
                                        <div className="md:w-1/4">
                                            <label className="text-sm block font-medium mb-1 md:mb-0 pr-4">
                                                BNPL Terms:
                                            </label>
                                        </div>
                                        <div className="md:w-3/4 flex">
                                            <input
                                                className="bg-gray-700 text-gray-400 rounded w-full py-2 px-4 leading-tight mr-1"
                                                type="text"
                                                value="DP"
                                            />
                                            <input
                                                className="bg-gray-700 text-gray-400 rounded w-full py-2 px-4 leading-tight mr-1"
                                                type="text"
                                                value="Duration"
                                            />
                                            <input
                                                className="bg-gray-700 text-gray-400 rounded w-full py-2 px-4 leading-tight"
                                                type="text"
                                                value="Interest"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:flex md:items-center mb-4">
                                        <div className="md:w-1/4">
                                            <label className="text-sm block font-medium mb-1 md:mb-0 pr-4">
                                                Offer Duration:
                                            </label>
                                        </div>
                                        <div className="md:w-3/4">
                                            <input
                                                className="bg-gray-700 text-gray-400 rounded w-full py-2 px-4 leading-tight"
                                                type="text"
                                                value="Duration (Days)"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            className="bg-spritzig hover:bg-corsair font-semibold py-3 px-16 rounded-2xl"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                // await mintNft(address);

                                                const _tokenUri = await getTokenUri(0);
                                                setTokenUri(_tokenUri);
                                            }}
                                        >
                                            List
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </GridSix>
            </ParentGrid>
        </div>
    );
};

export default Nft;
