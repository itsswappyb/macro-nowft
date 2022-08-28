import NftMarketplace from "./NftMarketplace.json";
import { ethers } from "ethers";

const marketplaceAbi = NftMarketplace.abi;
const marketplaceAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
const ethereum = typeof window !== "undefined" && (window as any).ethereum;

const getMarketplaceContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(marketplaceAddress, marketplaceAbi, signer);
};

const useMarketplace = () => {};

export default useMarketplace;
