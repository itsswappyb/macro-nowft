// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error PriceNotGreaterThanZero();
error MarketplaceNotApproved();
error ItemAlreadyListed();

contract NftMarketplace {
    struct ListItem {
        uint256 price;
        uint256 tokenId;
        address seller;
    }

    mapping(address => mapping(uint256 => ListItem)) private listings;

    event ItemListed(
        uint256 price,
        uint256 indexed tokenId,
        address indexed seller,
        address indexed nftAddress
    );

    modifier notListed(
        uint256 tokenId,
        address nftAddress,
        address owner
    ) {
        ListItem memory listing = listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert ItemAlreadyListed();
        }
        _;
    }

    function listNft(
        uint256 tokenId,
        address nftAddress,
        uint256 price
    ) external notListed(tokenId, nftAddress, msg.sender) {
        if (price <= 0) {
            revert PriceNotGreaterThanZero();
        }

        // check if this marketplace has been approved
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert MarketplaceNotApproved();
        }

        listings[nftAddress][tokenId] = ListItem(price, tokenId, msg.sender);
        emit ItemListed(price, tokenId, msg.sender, nftAddress);
    }

    // listNft
    // buyNft
    // cancelListing
    // updateListing
}
