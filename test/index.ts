import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { NftMarketplace__factory, TestNft__factory } from "../typechain-types/factories/contracts";
import { NftMarketplace, TestNft } from "../typechain-types/contracts";
import { BigNumber } from "ethers";

const SECONDS_IN_DAY: number = 60 * 60 * 24;
const SECONDS_IN_WEEK: number = 60 * 60 * 24 * 7;

const ONE_ETHER: BigNumber = ethers.utils.parseEther("1");
const FIVE_ETHER: BigNumber = ethers.utils.parseEther("5");

describe("NftMarketplace", () => {
    let deployer: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let charlie: SignerWithAddress;

    let TestNftFactory: TestNft__factory;
    let TestNft: TestNft;

    let NftMarketplaceFactory: NftMarketplace__factory;
    let NftMarketplace: NftMarketplace;

    const TOKEN_ID = 0;

    beforeEach(async () => {
        [deployer, alice, bob, charlie] = await ethers.getSigners();

        TestNftFactory = await ethers.getContractFactory("TestNft");
        TestNft = await TestNftFactory.deploy();

        NftMarketplaceFactory = await ethers.getContractFactory("NftMarketplace");
        NftMarketplace = await NftMarketplaceFactory.deploy();
        await NftMarketplace.deployed();
        await TestNft.deployed();

        await TestNft.mintNft(deployer.address);
        await TestNft.approve(alice.address, TOKEN_ID);
        await TestNft.approve(NftMarketplace.address, TOKEN_ID);
    });

    it("should deploy", async () => {
        expect(NftMarketplace.address).to.be.ok;
        expect(TestNft.address).to.be.ok;
    });

    it("deployer should have 1 NFT as balance", async () => {
        expect(await TestNft.balanceOf(deployer.address)).to.eq(1);
    });

    describe("listNft", () => {
        it("should revert if non-owner tries to list NFT", async () => {
            await expect(
                NftMarketplace.connect(alice).listNft(
                    TOKEN_ID,
                    TestNft.address,
                    ONE_ETHER.mul(30),
                    SECONDS_IN_WEEK * 4,
                    20
                )
            ).to.be.revertedWith("NotOwner");
        });
        it("should list NFT successfully", async () => {
            expect(
                await NftMarketplace.listNft(
                    TOKEN_ID,
                    TestNft.address,
                    ONE_ETHER.mul(30),
                    SECONDS_IN_WEEK * 4,
                    20
                )
            ).to.emit(NftMarketplace, "ItemListed");
        });
        it("should revert if NFT is already listed", async () => {
            await NftMarketplace.listNft(
                TOKEN_ID,
                TestNft.address,
                ONE_ETHER.mul(30),
                SECONDS_IN_WEEK * 4,
                20
            );
            await expect(
                NftMarketplace.connect(bob).listNft(
                    TOKEN_ID,
                    TestNft.address,
                    ONE_ETHER.mul(30),
                    SECONDS_IN_WEEK * 4,
                    20
                )
            ).to.be.revertedWith("NotOwner");
        });
    });

    describe("cancelListing", () => {
        it("it revert if non-owner tries to remove listing", async () => {
            await NftMarketplace.listNft(
                TOKEN_ID,
                TestNft.address,
                ONE_ETHER.mul(30),
                SECONDS_IN_WEEK * 4,
                20
            );
            await expect(
                NftMarketplace.connect(alice).cancelListing(TestNft.address, TOKEN_ID)
            ).to.be.revertedWith("NotOwner");
        });
        it("it revert if trying to remove unlisted item", async () => {
            await expect(
                NftMarketplace.cancelListing(TestNft.address, TOKEN_ID)
            ).to.be.revertedWith("NotListed");
        });
        it("it successfully deletes listing", async () => {
            await NftMarketplace.listNft(
                TOKEN_ID,
                TestNft.address,
                ONE_ETHER.mul(30),
                SECONDS_IN_WEEK * 4,
                20
            );
            await expect(NftMarketplace.cancelListing(TestNft.address, TOKEN_ID))
                .to.emit(NftMarketplace, "ItemCancelled")
                .withArgs(deployer.address, TestNft.address, TOKEN_ID);
        });
    });
    describe("updateListing", () => {
        it("it successfully updates listing", async () => {
            await NftMarketplace.listNft(
                TOKEN_ID,
                TestNft.address,
                ONE_ETHER.mul(30),
                SECONDS_IN_WEEK * 4,
                20
            );
            const originalListing = await NftMarketplace.getListing(TestNft.address, TOKEN_ID);
            await NftMarketplace.updateListing(
                TestNft.address,
                TOKEN_ID,
                ONE_ETHER.mul(20),
                SECONDS_IN_WEEK * 4,
                20
            );

            const updatedListing = await NftMarketplace.getListing(TestNft.address, TOKEN_ID);
            expect(updatedListing).to.not.eq(originalListing);
            expect(updatedListing.price).to.eq(ONE_ETHER.mul(20));
            expect(updatedListing.loanDurationInWeeks).to.eq(SECONDS_IN_WEEK * 4);
            expect(updatedListing.interestPercentage).to.eq(20);
        });
        it("it reverts if trying to update unlisted item", async () => {
            await expect(
                NftMarketplace.updateListing(
                    TestNft.address,
                    TOKEN_ID,
                    ONE_ETHER.mul(20),
                    SECONDS_IN_WEEK * 4,
                    20
                )
            ).to.be.revertedWith("NotListed");
        });
        it("it reverts if non-owner trying to update listed item", async () => {
            await expect(
                NftMarketplace.connect(alice).updateListing(
                    TestNft.address,
                    TOKEN_ID,
                    ONE_ETHER.mul(20),
                    SECONDS_IN_WEEK * 4,
                    20
                )
            ).to.be.revertedWith("NotListed");
        });
        it("it successfully deletes listing", async () => {
            await NftMarketplace.listNft(
                TOKEN_ID,
                TestNft.address,
                ONE_ETHER.mul(30),
                SECONDS_IN_WEEK * 4,
                20
            );
            await expect(NftMarketplace.cancelListing(TestNft.address, TOKEN_ID))
                .to.emit(NftMarketplace, "ItemCancelled")
                .withArgs(deployer.address, TestNft.address, TOKEN_ID);
        });
    });

    describe("payDeposit", () => {
        it("it reverts if not listed", async () => {
            await expect(NftMarketplace.payDeposit(TestNft.address, TOKEN_ID)).to.be.revertedWith(
                "NotListed"
            );
        });
        it("it reverts if seller tries to pay deposit", async () => {
            await NftMarketplace.listNft(
                TOKEN_ID,
                TestNft.address,
                ONE_ETHER.mul(30),
                SECONDS_IN_WEEK * 4,
                20
            );
            await expect(NftMarketplace.payDeposit(TestNft.address, TOKEN_ID)).to.be.revertedWith(
                "SellerUnableToDeposit"
            );
        });
        it("it reverts if deposit amount is incorrect", async () => {
            const price = 30;
            await NftMarketplace.listNft(
                TOKEN_ID,
                TestNft.address,
                ONE_ETHER.mul(price),
                SECONDS_IN_WEEK * 4,
                20
            );
            const priceWithInterest = (price * 120) / 100;
            const depositAmount = (priceWithInterest * 30) / 100;
            const wrongDepositAmount = depositAmount - 10;

            const formattedPriceWithInterest = ethers.utils.parseEther(`${priceWithInterest}`);
            const formattedDepositAmount = ethers.utils.parseEther(`${depositAmount}`);
            const formattedWrongDepositAmount = ethers.utils.parseEther(`${wrongDepositAmount}`);

            await expect(
                NftMarketplace.connect(alice).payDeposit(TestNft.address, TOKEN_ID, {
                    value: formattedWrongDepositAmount
                })
            ).to.be.revertedWith("IncorrectDeposit");
        });
        it("it reverts if trying to update unlisted item", async () => {
            await expect(
                NftMarketplace.updateListing(
                    TestNft.address,
                    TOKEN_ID,
                    ONE_ETHER.mul(20),
                    SECONDS_IN_WEEK * 4,
                    20
                )
            ).to.be.revertedWith("NotListed");
        });
        it("it reverts if non-owner trying to update listed item", async () => {
            await expect(
                NftMarketplace.connect(alice).updateListing(
                    TestNft.address,
                    TOKEN_ID,
                    ONE_ETHER.mul(20),
                    SECONDS_IN_WEEK * 4,
                    20
                )
            ).to.be.revertedWith("NotListed");
        });
        it("it updates accumulatedProceeds correctly", async () => {
            const price = 30;
            await NftMarketplace.listNft(
                TOKEN_ID,
                TestNft.address,
                ONE_ETHER.mul(price),
                SECONDS_IN_WEEK * 4,
                20
            );
            const priceWithInterest = (price * 120) / 100;
            const depositAmount = (priceWithInterest * 30) / 100;

            const formattedDepositAmount = ethers.utils.parseEther(`${depositAmount}`);

            const ownerTokenBalance = await TestNft.balanceOf(deployer.address);
            const marketplaceBalance = await TestNft.balanceOf(NftMarketplace.address);

            expect(ownerTokenBalance).to.eq(1);
            expect(marketplaceBalance).to.eq(0);

            await expect(
                NftMarketplace.connect(alice).payDeposit(TestNft.address, TOKEN_ID, {
                    value: formattedDepositAmount
                })
            )
                .to.emit(NftMarketplace, "PaidDeposit")
                .withArgs(alice.address, TestNft.address, TOKEN_ID);

            const ownerTokenBalanceAfter = await TestNft.balanceOf(deployer.address);
            const marketplaceBalanceAfter = await TestNft.balanceOf(NftMarketplace.address);

            expect(ownerTokenBalanceAfter).to.eq(0);
            expect(marketplaceBalanceAfter).to.eq(1);
        });
    });
});
