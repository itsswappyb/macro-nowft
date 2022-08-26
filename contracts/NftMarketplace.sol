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
        uint256 loanDuration,
        uint256 interestPercentage
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
        uint256 _tokenId,
        address _nftAddress,
        uint256 _price,
        uint256 _loanDuration,
        uint256 _interestPercentage
    ) external notListed(_tokenId, _nftAddress, msg.sender) {
        if (_price <= 0) {
            revert PriceNotGreaterThanZero();
        }

        // depositAmount is set to 20% of the price
        uint256 _depositAmount = (_price * 20) / 100;

        // check if this marketplace has been approved
        IERC721 nft = IERC721(_nftAddress);
        if (nft.getApproved(_tokenId) != address(this)) {
            revert MarketplaceNotApproved();
        }

        listings[_nftAddress][_tokenId] = ListItem(
            _price,
            _tokenId,
            msg.sender,
            _depositAmount,
            _loanDuration,
            _interestPercentage
        );
        emit ItemListed(
            _nftAddress,
            _price,
            _tokenId,
            msg.sender,
            _depositAmount,
            _loanDuration,
            _interestPercentage
        );
    }

    // listNft
    // buyNft
    // cancelListing
    // updateListing
}
