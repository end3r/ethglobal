// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CoinFlipGame
 * @dev A simple coin flip game where players can bet and win or lose
 */
contract CoinFlipGame {
    address public owner;
    uint256 public minimumBet;
    uint256 public houseEdge; // in basis points (e.g., 200 = 2%)
    
    event GamePlayed(
        address indexed player,
        uint256 betAmount,
        bool playerWon,
        bool playerChoice,
        bool result,
        uint256 payout
    );
    
    event FundsDeposited(address indexed depositor, uint256 amount);
    event FundsWithdrawn(address indexed recipient, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    constructor(uint256 _minimumBet, uint256 _houseEdge) {
        owner = msg.sender;
        minimumBet = _minimumBet;
        houseEdge = _houseEdge;
    }
    
    /**
     * @dev Play the coin flip game
     * @param choice Player's choice (true for heads, false for tails)
     */
    function play(bool choice) external payable {
        require(msg.value >= minimumBet, "Bet amount too low");
        require(address(this).balance >= msg.value * 2, "Insufficient contract balance");
        
        // Simple pseudo-random number generation
        // Note: In production, use Chainlink VRF or similar for true randomness
        bool result = (uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender
        ))) % 2) == 0;
        
        bool playerWon = (choice == result);
        uint256 payout = 0;
        
        if (playerWon) {
            // Calculate payout with house edge
            uint256 winnings = msg.value * 2;
            uint256 fee = (winnings * houseEdge) / 10000;
            payout = winnings - fee;
            
            (bool success, ) = payable(msg.sender).call{value: payout}("");
            require(success, "Transfer failed");
        }
        
        emit GamePlayed(msg.sender, msg.value, playerWon, choice, result, payout);
    }
    
    /**
     * @dev Deposit funds to the contract
     */
    function deposit() external payable {
        require(msg.value > 0, "Must deposit something");
        emit FundsDeposited(msg.sender, msg.value);
    }
    
    /**
     * @dev Withdraw funds from the contract (owner only)
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed");
        emit FundsWithdrawn(owner, amount);
    }
    
    /**
     * @dev Update minimum bet (owner only)
     */
    function setMinimumBet(uint256 _minimumBet) external onlyOwner {
        minimumBet = _minimumBet;
    }
    
    /**
     * @dev Update house edge (owner only)
     */
    function setHouseEdge(uint256 _houseEdge) external onlyOwner {
        require(_houseEdge <= 1000, "House edge too high"); // Max 10%
        houseEdge = _houseEdge;
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
}
