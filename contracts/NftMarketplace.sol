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
        address buyer;
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

    uint256 private constant SECONDS_IN_A_WEEK = 60 * 60 * 24 * 7;

    event ItemListed(
        address indexed nftAddress,
        uint256 price,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 depositAmount,
        uint256 loanDurationInWeeks,
        uint256 interestPercentage
    );
    event ItemBought(address buyer, address nftAddress, uint256 tokenId, uint256 price);
    event ItemCancelled(address seller, address nftAddress, uint256 tokenId);
    event PaidDeposit(address buyer, address nftAddress, uint256 tokenId);
    event PaidInstalment(address buyer, address nftAddress, uint256 tokenId);
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

    modifier loanDurationExpired(address nftAddress, uint256 tokenId) {
        ListItem memory listing = listings[nftAddress][tokenId];
        require(
            (block.timestamp <=
                listing.depositPaidAt + (SECONDS_IN_A_WEEK * listing.loanDurationInWeeks)) &&
                listing.hasPaidDeposit,
            "LoanDurationExpired"
        );
        _;
    }

    modifier hasPaidDeposit(address nftAddress, uint256 tokenId) {
        ListItem memory listing = listings[nftAddress][tokenId];
        require(listing.hasPaidDeposit == true, "MustPayDeposit");
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
        address _nftAddress = nftAddress;
        uint256 _tokenId = tokenId;
        uint256 _newPrice = newPrice;
        uint256 _loanDurationInWeeks = loanDurationInWeeks;
        uint256 _interestPercentage = interestPercentage;

        require(_newPrice > 0, "PriceMustBeAboveZero");
        require(
            accumulatedProceeds[listings[_nftAddress][_tokenId].seller] <= 0,
            "UnableToUpdateWithProceeds"
        );

        uint256 priceWithInterest = (_newPrice * (100 + _interestPercentage)) / 100;
        uint256 depositAmount = (priceWithInterest * 30) / 100;

        listings[_nftAddress][_tokenId].price = _newPrice;
        listings[_nftAddress][_tokenId].loanDurationInWeeks = _loanDurationInWeeks;
        listings[_nftAddress][_tokenId].interestPercentage = _interestPercentage;
        listings[_nftAddress][_tokenId].remainingPayableAmount = priceWithInterest;

        ListItem memory listing = listings[_nftAddress][_tokenId];

        emit ItemListed(
            _nftAddress,
            _newPrice,
            _tokenId,
            msg.sender,
            listing.buyer,
            depositAmount,
            _loanDurationInWeeks,
            _interestPercentage
        );
    }

    /*
     * @notice - Method for buying NFT
     * @param nftAddress - NFT contract address
     * @param tokenId - NFT's token id
     */
    function buyNft(address nftAddress, uint256 tokenId)
        external
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
    {
        ListItem memory listing = listings[nftAddress][tokenId];
        uint256 priceWithInterest = (listing.price * (100 + listing.interestPercentage)) / 100;

        bool hasPaidLoanSuccessfully = listing.hasPaidDeposit &&
            listing.remainingPayableAmount == 0 &&
            accumulatedProceeds[listing.seller] == priceWithInterest;
        if (hasPaidLoanSuccessfully == false) {
            revert("HasNotPaidLoan");
        }

        delete (listings[nftAddress][tokenId]);
        IERC721(nftAddress).safeTransferFrom(address(this), msg.sender, tokenId);
        emit ItemBought(msg.sender, nftAddress, tokenId, listing.price);
    }

    /*
     * @notice - Method to pay the deposit
     * @notice - Deposit amount is set at 30% of the price including interest
     * @notice - After the deposit is paid, the NFT is transfered to the markeplace
     * which acts as an escrow
     * @param nftAddress - NFT contract address
     * @param tokenId - NFT's token id
     */
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

        require(msg.value == depositAmount, "IncorrectDeposit");

        accumulatedProceeds[listing.seller] += msg.value;
        storageListing.remainingPayableAmount = priceWithInterest - msg.value;
        storageListing.hasPaidDeposit = true;
        storageListing.buyer = buyer;

        // transfer NFT to marketplace after deposit has been paid
        IERC721(nftAddress).safeTransferFrom(listing.seller, address(this), tokenId);

        storageListing.depositPaidAt = block.timestamp;

        emit PaidDeposit(msg.sender, nftAddress, tokenId);
        return true;
    }

    /*
     * @notice - Method to pay an installment
     * @notice - Installments are spread out across the loan duration period
     * @notice - After the deposit is paid, the NFT is transfered to the markeplace
     * which acts as an escrow
     * @param nftAddress - NFT contract address
     * @param tokenId - NFT's token id
     */
    function payInstallment(address nftAddress, uint256 tokenId)
        public
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
        hasPaidDeposit(nftAddress, tokenId)
        loanDurationExpired(nftAddress, tokenId)
    {
        address _nftAddress = nftAddress;
        uint256 _tokenId = tokenId;
        ListItem memory listing = listings[_nftAddress][_tokenId];
        ListItem storage storageListing = listings[_nftAddress][_tokenId];

        address buyer = listing.buyer;

        require(buyer != listing.seller, "SellerUnableToPayInstallment");
        require(listing.remainingPayableAmount > 0, "IntalmentsAlreadyPaid");

        uint256 priceWithInterest = (listing.price * (100 + listing.interestPercentage)) / 100;

        uint256 depositAmount = (priceWithInterest * 30) / 100;

        uint256 instalmentAmount = (priceWithInterest - depositAmount) /
            (listing.loanDurationInWeeks);

        uint256 amountSent = msg.value;

        require(amountSent == instalmentAmount, "IncorrectInstalmentAmount");

        bool oneWeekSinceDeposit = oneWeekHasPassed(listing.depositPaidAt);
        bool oneWeekSinceLastInstalment = (listing.instalmentPaidAt > 0) &&
            oneWeekHasPassed(listing.instalmentPaidAt);

        bool paymentDefaulted = (oneWeekSinceDeposit || oneWeekSinceLastInstalment) &&
            accumulatedProceeds[listing.seller] <= listing.remainingPayableAmount;

        // If payment has defaulted, transfer proceeds + NFT back to seller
        if (paymentDefaulted) {
            (bool sent, ) = listing.seller.call{value: accumulatedProceeds[listing.seller]}("");
            require(sent, "UnableToTransferProceedsToSeller");

            // transfer the NFT back to the seller
            IERC721(_nftAddress).safeTransferFrom(address(this), listing.seller, 0);
        }

        accumulatedProceeds[listing.seller] += msg.value;

        storageListing.remainingPayableAmount = listing.remainingPayableAmount - msg.value;
        storageListing.instalmentPaidAt = block.timestamp;

        emit PaidInstalment(buyer, _nftAddress, _tokenId);
    }

    /*
     * @notice Method for withdrawing accumulated proceeds
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
        return (block.timestamp >= (_timestamp + 1 weeks));
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
