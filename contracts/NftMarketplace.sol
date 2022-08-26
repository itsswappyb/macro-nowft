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

        // _remainingPayableAmount is initially the price including interest
        // since no amount has been paid against this amount by the buyer
        uint256 _remainingPayableAmount = (_price * (100 + _interestPercentage)) / 100;

        require(_price > 0, "PriceNotGreaterThanZero");

        // depositAmount is set to 30% of the price
        uint256 _depositAmount = (_price * 30) / 100;

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
            _remainingPayableAmount
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

    function buyNft(uint256 tokenId, address nftAddress)
        external
        payable
        nonReentrant
        isListed(nftAddress, tokenId)
    {
        ListItem memory listing = listings[nftAddress][tokenId];
        ListItem storage storageListing = listings[nftAddress][tokenId];

        uint256 price = listing.price;
        uint256 loanDurationInWeeks = listing.loanDurationInWeeks;
        uint256 remainingPayableAmount = listing.remainingPayableAmount;
        uint256 depositAmount = (price * 30) / 100;
        uint256 instalmentAmount = (price - depositAmount) / loanDurationInWeeks;

        // buyer pays deposit
        if (listing.hasPaidDeposit == false) {
            payDeposit(listing);
        }
        storageListing.remainingPayableAmount = remainingPayableAmount - msg.value;

        // clock starts from moment deposit is received

        // check if instalment is paid after a week
        // if paid, restart clock
        // continue this until loanDurationInWeeks is reached
        // if instalment is not paid, transfer NFT + accrued amount to seller
    }

    // buyNft
    // cancelListing
    // updateListing

    function payDeposit(ListItem memory listing) public payable returns (bool) {
        address buyer = msg.sender;
        require(buyer != listing.seller, "SellerUnableToDeposit");

        uint256 depositAmount = (listing.price * 30) / 100;
        require(msg.value >= depositAmount, "InsufficientDeposit");

        accumulatedProceeds[listing.seller] += msg.value;
        listing.hasPaidDeposit = true;

        return true;
    }

    function payInstallments() external payable returns (bool) {}

    /*
     * @notice Helper method
     */
    function oneWeekHasPassed(uint256 _timestamp) private view returns (bool) {
        return (_timestamp == (block.timestamp + 1 weeks));
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
}
