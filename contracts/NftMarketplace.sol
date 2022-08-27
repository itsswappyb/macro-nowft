// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NftMarketplace is IERC721Receiver, ReentrancyGuard {
    struct ListItem {
        uint256 price;
        uint256 tokenId;
        address seller;
        uint256 depositAmount;
        uint256 loanDurationInWeeks;
        uint256 interestPercentage;
        uint256 remainingPayableAmount;
        bool hasPaidDeposit;
        uint256 depositPaidAt;
        uint256 instalmentPaidAt;
    }

    mapping(address => mapping(uint256 => ListItem)) private listings;
    mapping(address => uint256) private accumulatedProceeds;

    event ItemListed(
        address indexed nftAddress,
        uint256 price,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 depositAmount,
        uint256 loanDurationInWeeks,
        uint256 interestPercentage
    );

    event ItemCancelled(address seller, address nftAddress, uint256 tokenId);

    event ERC721TokenReceived(address operator, address from, uint256 tokenId, bytes data);

    modifier notListed(
        uint256 tokenId,
        address nftAddress,
        address owner
    ) {
        ListItem memory listing = listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert("ItemAlreadyListed");
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        ListItem memory listing = listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert("NotListed");
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        require(owner == spender, "NotOwner");
        _;
    }

    /*
     * @dev function to list an NFT for sale
     * @param tokenId - this is the id of the NFT
     * @param nftAddress - NFT contract address
     * @param price - price for which the seller lists the NFTs
     * @param loanDurationInDay - the duration of the loan. Buyer must pay all instalments by this time
     * @param interestPercentage - the percentage of interest charged on the price
     */
    function listNft(
        uint256 tokenId,
        address nftAddress,
        uint256 price,
        uint256 loanDurationInWeeks,
        uint256 interestPercentage
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        notListed(tokenId, nftAddress, msg.sender)
    {
        // reassigning function params to local variables to avoid
        // stack depth issue due to too many local variables
        uint256 _tokenId = tokenId;
        uint256 _price = price;
        address _nftAddress = nftAddress;
        uint256 _loanDurationInWeeks = loanDurationInWeeks;
        uint256 _interestPercentage = interestPercentage;
        uint256 _priceWithInterest = (_price * (100 + _interestPercentage)) / 100;

        // _remainingPayableAmount is initially the price including interest
        // since no amount has been paid against this amount by the buyer
        uint256 _remainingPayableAmount = _priceWithInterest;

        require(_price > 0, "PriceNotGreaterThanZero");

        // depositAmount is set to 30% of the priceWithInterest
        uint256 _depositAmount = (_priceWithInterest * 30) / 100;

        // check if this marketplace has been approved
        IERC721 nft = IERC721(_nftAddress);
        require(nft.getApproved(_tokenId) == address(this), "MarketplaceNotApproved");

        listings[_nftAddress][_tokenId] = ListItem(
            _price,
            _tokenId,
            msg.sender,
            _depositAmount,
            _loanDurationInWeeks,
            _interestPercentage,
            _remainingPayableAmount,
            false,
            0,
            0
        );
        emit ItemListed(
            _nftAddress,
            _price,
            _tokenId,
            msg.sender,
            _depositAmount,
            _loanDurationInWeeks,
            _interestPercentage
        );
    }

    /*
     * @notice - method to remove NFT listing
     * @param - nftAddress NFT contract address
     * @param - tokenId NFT's token id
     */
    function cancelListing(address nftAddress, uint256 tokenId)
        public
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (listings[nftAddress][tokenId]);
        emit ItemCancelled(msg.sender, nftAddress, tokenId);
    }

    /*
     * @notice - Method for update listing
     * @param nftAddress - NFT contract address
     * @param tokenId - NFT's token id
     * @param newPrice - Price in Wei of the item
     */
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice,
        uint256 loanDurationInWeeks,
        uint256 interestPercentage
    )
        external
        isListed(nftAddress, tokenId)
        nonReentrant
        isOwner(nftAddress, tokenId, msg.sender)
    {
        require(newPrice > 0, "PriceMustBeAboveZero");
        uint256 priceWithInterest = (newPrice * (100 + interestPercentage)) / 100;
        uint256 depositAmount = (priceWithInterest * 30) / 100;

        listings[nftAddress][tokenId].price = newPrice;
        listings[nftAddress][tokenId].loanDurationInWeeks = loanDurationInWeeks;
        listings[nftAddress][tokenId].interestPercentage = interestPercentage;

        emit ItemListed(
            nftAddress,
            newPrice,
            tokenId,
            msg.sender,
            depositAmount,
            loanDurationInWeeks,
            interestPercentage
        );
    }

    function buyNft(uint256 tokenId, address nftAddress)
        external
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
    {
        ListItem memory listing = listings[nftAddress][tokenId];
        ListItem storage storageListing = listings[nftAddress][tokenId];

        uint256 priceWithInterest = (listing.price * (100 + listing.interestPercentage)) / 100;
        uint256 loanDurationInWeeks = listing.loanDurationInWeeks;
        uint256 remainingPayableAmount = listing.remainingPayableAmount;
        uint256 depositAmount = (priceWithInterest * 30) / 100;
        uint256 instalmentAmount = (priceWithInterest - depositAmount) / loanDurationInWeeks;

        // buyer pays deposit
        require(listing.hasPaidDeposit == true, "CantBuyWithoutDeposit");
        // require(listing.)

        // clock starts from moment deposit is received

        // check if instalment is paid after a week
        // if paid, restart clock
        // continue this until loanDurationInWeeks is reached
        // if instalment is not paid, transfer NFT + accrued amount to seller
    }

    function payDeposit(address nftAddress, uint256 tokenId)
        public
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
        returns (bool)
    {
        ListItem memory listing = listings[nftAddress][tokenId];
        ListItem storage storageListing = listings[nftAddress][tokenId];

        require(listing.hasPaidDeposit == false, "DepositAlreadyPaid");

        address buyer = msg.sender;
        require(buyer != listing.seller, "SellerUnableToDeposit");

        uint256 priceWithInterest = (listing.price * (100 + listing.interestPercentage)) / 100;
        uint256 depositAmount = (priceWithInterest * 30) / 100;

        require(msg.value == depositAmount, "InsufficientDeposit");

        accumulatedProceeds[listing.seller] += msg.value;
        storageListing.remainingPayableAmount = listing.remainingPayableAmount - msg.value;
        listing.hasPaidDeposit = true;

        // transfer NFT to marketplace after deposit has been paid
        IERC721(nftAddress).safeTransferFrom(listing.seller, address(this), tokenId);

        storageListing.depositPaidAt = block.timestamp;

        return true;
    }

    function payInstallment(address nftAddress, uint256 tokenId)
        public
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
        returns (bool)
    {
        ListItem memory listing = listings[nftAddress][tokenId];
        ListItem storage storageListing = listings[nftAddress][tokenId];
        bool hasPaidDeposit = listing.hasPaidDeposit == true;
        require(hasPaidDeposit == true, "MustPayDepositBeforeInstalment");

        uint256 priceWithInterest = (listing.price * (100 + listing.interestPercentage)) / 100;

        uint256 depositAmount = (priceWithInterest * 30) / 100;
        uint256 instalmentAmount = (priceWithInterest - depositAmount) /
            listing.loanDurationInWeeks;

        uint256 amountSent = msg.value;

        require(amountSent == instalmentAmount, "IncorrectInstalmentAmount");

        bool oneWeekSinceDeposit = oneWeekHasPassed(listing.depositPaidAt);
        bool oneWeekSinceInstalment = oneWeekHasPassed(listing.instalmentPaidAt);

        // if time has expired, transfer proceeds + NFT back to seller
        if (oneWeekSinceDeposit || oneWeekSinceInstalment) {
            withdrawProceeds();

            // transfer the NFT back to the seller
            IERC721(nftAddress).safeTransferFrom(address(this), listing.seller, tokenId);
            // remove listing
            cancelListing(nftAddress, tokenId);
        }
    }

    /*
     * @notice Method for withdrawing proceeds from sales
     */
    function withdrawProceeds() public {
        uint256 proceeds = accumulatedProceeds[msg.sender];
        require(proceeds > 0, "NoProceeds");

        accumulatedProceeds[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "WithdrawFailed");
    }

    /*
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
     *
     * The selector can be obtained in Solidity with `IERC721Receiver.onERC721Received.selector`.
     */

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        emit ERC721TokenReceived(operator, from, tokenId, data);
        return IERC721Receiver.onERC721Received.selector;
    }

    /*
     * @notice Helper methods - oneWeekHasPassed, getListing, getProceeds
     */
    function oneWeekHasPassed(uint256 _timestamp) private view returns (bool) {
        return (_timestamp >= (block.timestamp + 1 weeks));
    }

    function getListing(address nftAddress, uint256 tokenId)
        public
        view
        returns (ListItem memory)
    {
        return listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) public view returns (uint256) {
        return accumulatedProceeds[seller];
    }

    receive() external payable {}
}
