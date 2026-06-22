// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title RoundLog
/// @notice Append-only, on-chain record of Mind the Mind round outcomes.
///         The game's backend signer (the owner) settles each finished round
///         here, producing a verifiable transaction + event on a Cosmos EVM
///         chain. Players never sign anything.
contract RoundLog {
    address public owner;
    uint256 public totalRounds;

    struct Round {
        uint64 seedBlock; // Cosmos Hub block that seeded the round
        bytes32 agent; // agent codename (bytes32-encoded)
        int256 playerPnl; // player P&L, scaled x100
        int256 agentPnl; // agent P&L, scaled x100
        bool mindRead; // did the player correctly read the objective?
        bool won; // overall win (read + profit)
        uint64 timestamp; // chain time of settlement
    }

    mapping(uint256 => Round) public rounds;

    event RoundSettled(
        uint256 indexed id,
        bytes32 indexed agent,
        uint64 seedBlock,
        int256 playerPnl,
        int256 agentPnl,
        bool mindRead,
        bool won
    );

    event OwnerTransferred(address indexed from, address indexed to);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "RoundLog: not owner");
        _;
    }

    function transferOwner(address next) external onlyOwner {
        require(next != address(0), "RoundLog: zero owner");
        emit OwnerTransferred(owner, next);
        owner = next;
    }

    function recordRound(
        uint64 seedBlock,
        bytes32 agent,
        int256 playerPnl,
        int256 agentPnl,
        bool mindRead,
        bool won
    ) external onlyOwner returns (uint256 id) {
        id = ++totalRounds;
        rounds[id] = Round(
            seedBlock,
            agent,
            playerPnl,
            agentPnl,
            mindRead,
            won,
            uint64(block.timestamp)
        );
        emit RoundSettled(id, agent, seedBlock, playerPnl, agentPnl, mindRead, won);
    }
}
