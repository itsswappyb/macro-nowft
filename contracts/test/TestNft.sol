// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNft is ERC721 {
    string public constant TOKEN_URI = "testTokenUri";
    uint256 private _tokenCounter;

    event DogMinted(uint256 indexed tokenId);

    constructor() ERC721("Test", "TEST") {
        _tokenCounter = 0;
    }

    function mintNft() public {
        _safeMint(msg.sender, _tokenCounter);
        emit DogMinted(_tokenCounter);
        _tokenCounter = _tokenCounter + 1;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "TestNft::tokenURI: tokenURI does not exist");
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return _tokenCounter;
    }
}
