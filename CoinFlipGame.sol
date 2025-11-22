// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CoinFlipGame
 * @dev A simple coin flip game where players can bet and win or lose
 * 
 * SECURITY NOTICE: This is a demonstration contract for ETH Global Buenos Aires.
 * The randomness implementation using block data is NOT suitable for production
 * use with real funds. For production deployment, integrate Chainlink VRF or
 * implement a commit-reveal scheme for provably fair randomness.
 * 
 * For hackathon/demo purposes only!
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
     * 
     * WARNING: This contract uses pseudo-random number generation based on block data.
     * This is NOT secure for production use as miners/validators can potentially
     * manipulate the outcome. For production, implement Chainlink VRF or a 
     * commit-reveal scheme for provably fair randomness.
     */
    function play(bool choice) external payable {
        require(msg.value >= minimumBet, "Bet amount too low");
        
        // Calculate potential payout considering house edge
        uint256 potentialWinnings = msg.value * 2;
        uint256 fee = (potentialWinnings * houseEdge) / 10000;
        uint256 potentialPayout = potentialWinnings - fee;
        
        require(address(this).balance >= potentialPayout, "Insufficient contract balance");
        
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
            payout = potentialPayout;
            
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
