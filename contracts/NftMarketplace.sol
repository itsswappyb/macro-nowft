// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NftMarketplace is IERC721Receiver {
    struct ListItem {
        uint256 price;
        uint256 tokenId;
        address seller;
        uint256 depositAmount;
        uint256 loanDuration;
        uint256 interestPercentage;
    }

    mapping(address => mapping(uint256 => ListItem)) private listings;

    event ItemListed(
        address indexed nftAddress,
        uint256 price,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 depositAmount,
        uint256 loanDurationInDays,
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

    function listNft(
        uint256 tokenId,
        address nftAddress,
        uint256 price,
        uint256 loanDurationInDays,
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
        uint256 _loanDurationInDays = loanDurationInDays;
        uint256 _interestPercentage = interestPercentage;

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
            _loanDurationInDays,
            _interestPercentage
        );
        emit ItemListed(
            _nftAddress,
            _price,
            _tokenId,
            msg.sender,
            _depositAmount,
            _loanDurationInDays,
            _interestPercentage
        );
    }

    // buyNft
    // cancelListing
    // updateListing

    /**
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
