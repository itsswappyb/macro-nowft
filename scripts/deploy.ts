import { ethers } from "hardhat";

async function main() {
    const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
    const nftMarketplace = await NftMarketplace.deploy();
    const TestNft = await ethers.getContractFactory("TestNft");
    const testNft = await TestNft.deploy();

    await nftMarketplace.deployed();
    await testNft.deployed();

    console.log(`Nftmarketplace deployed to ${nftMarketplace.address}`);
    console.log(`TestNft deployed to ${testNft.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
