import NftMarketplace from "./NftMarketplace.json";
import TestNft from "./TestNft.json";
import { Contract, ethers } from "ethers";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useEffect, useState } from "react";

const marketplaceAbi = NftMarketplace.abi;
const marketplaceAddress = "0x59b670e9fA9D0A427751Af201D676719a970857b";
const nftAbi = TestNft.abi;
const nftAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";
const ethereum = typeof window !== "undefined" && (window as any).ethereum;

const getMarketplaceContract = (): Contract => {
    // const provider = new ethers.providers.Web3Provider(ethereum);
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    return new ethers.Contract(marketplaceAddress, marketplaceAbi, signer);
};

const getNftContract = (): Contract => {
    // const provider = new ethers.providers.Web3Provider(ethereum);
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    return new ethers.Contract(nftAddress, nftAbi, signer);
};

const useMarketplace = () => {
    const [tokenUri, setTokenUri] = useState<string>("defaultTokenUri");
    const [tokenId, setTokenId] = useState<number>(0);
    const [tokenCounter, setTokenCounter] = useState<number>(0);

    const { address, isConnected } = useAccount();

    const marketplaceContract = getMarketplaceContract();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    const { disconnect } = useDisconnect();

    const mintNft = async (to: string) => {
        try {
            const contract = getNftContract();
            await contract.mintNft(to);
        } catch (err) {
            console.log(err);
        }
    };

    const getTokenUri = async (tokenId: number) => {
        try {
            const contract = getNftContract();
            const _tokenUri = await contract.tokenURI(tokenId);
            setTokenUri(_tokenUri);
            console.log("tokenUri: ", tokenUri);
        } catch (err) {
            console.error(err);
            console.log(err?.reason);
        }
    };

    const getTokenCounter = async () => {
        try {
            const contract = getNftContract();
            const _tokenCounter = await contract.getTokenCounter();
            setTokenCounter(_tokenCounter);
            console.log("got token counter");
        } catch (e) {
            console.error(e);
            console.log(e?.reason);
        }
    };

    const getTokenOfOwnerByIndex = async (owner: string, tokenIndex: number) => {
        try {
            const contract = getNftContract();
            const _tokenId = await contract.tokenOfOwnerByIndex(owner, tokenIndex);
            setTokenId(_tokenId);
            console.log({ _tokenId });
        } catch (err) {
            console.error(err);
            console.log(err?.reason);
        }
    };

    return {
        mintNft,
        getTokenUri,
        tokenUri,
        getTokenOfOwnerByIndex,
        getTokenCounter,
        tokenCounter,
    };
};

export default useMarketplace;
