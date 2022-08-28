// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TestNft is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string public constant TOKEN_URI = "testTokenUri";

    event NftMinted(uint256 indexed tokenId);

    constructor() ERC721("Test", "TEST") {}

    function mintNft(address to) public {
        uint256 _tokenCounter = _tokenIds.current();
        _safeMint(to, _tokenCounter);
        emit NftMinted(_tokenCounter);
        _tokenIds.increment();
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "TestNft::tokenURI: tokenURI does not exist");
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return _tokenIds.current();
    }
}
