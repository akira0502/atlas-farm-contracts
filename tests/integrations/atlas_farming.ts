export type AtlasFarming = {
    "version": "0.0.0",
    "name": "atlas_farming",
    "instructions": [
      {
        "name": "createState",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "createPool",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "tokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rewardVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rewardMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenBump",
            "type": "u8"
          },
          {
            "name": "rewardBump",
            "type": "u8"
          },
          {
            "name": "tokenPerSecond",
            "type": "u64"
          }
        ]
      },
      {
        "name": "addMasterWallet",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "masterKey",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "closePool",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "fundRewardToken",
        "accounts": [
          {
            "name": "state",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "rewardVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "changeTokenPerSecond",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "tokenPerSecond",
            "type": "u64"
          }
        ]
      },
      {
        "name": "createUser",
        "accounts": [
          {
            "name": "state",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "stake",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "poolVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "unstake",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "poolVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "harvest",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "rewardVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "GlobalStateAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "totalFarm",
              "type": "u64"
            },
            {
              "name": "startTime",
              "type": "i64"
            }
          ]
        }
      },
      {
        "name": "FarmPoolAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "amount",
              "type": "u64"
            },
            {
              "name": "tokenMint",
              "type": "publicKey"
            },
            {
              "name": "tokenVault",
              "type": "publicKey"
            },
            {
              "name": "rewardMint",
              "type": "publicKey"
            },
            {
              "name": "rewardVault",
              "type": "publicKey"
            },
            {
              "name": "tokenPerSecond",
              "type": "u64"
            },
            {
              "name": "lastRewardTime",
              "type": "i64"
            },
            {
              "name": "accRewardPerShare",
              "type": "u128"
            },
            {
              "name": "totalUser",
              "type": "u64"
            },
            {
              "name": "totalMaster",
              "type": "u8"
            },
            {
              "name": "masterWalletArr",
              "type": {
                "array": [
                  "publicKey",
                  10
                ]
              }
            }
          ]
        }
      },
      {
        "name": "FarmPoolUserAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "pool",
              "type": "publicKey"
            },
            {
              "name": "amount",
              "type": "u64"
            },
            {
              "name": "rewardAmount",
              "type": "u128"
            },
            {
              "name": "rewardDebt",
              "type": "u128"
            },
            {
              "name": "lastStakeTime",
              "type": "i64"
            },
            {
              "name": "reserved1",
              "type": "u128"
            },
            {
              "name": "reserved2",
              "type": "u128"
            },
            {
              "name": "reserved3",
              "type": "u128"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 300,
        "name": "UnstakeOverAmount",
        "msg": "Over staked amount"
      },
      {
        "code": 301,
        "name": "UnderLocked",
        "msg": "Under locked"
      },
      {
        "code": 302,
        "name": "WorkingPool",
        "msg": "Pool is working"
      },
      {
        "code": 303,
        "name": "InvalidLockDuration",
        "msg": "Invalid Lock Duration"
      },
      {
        "code": 304,
        "name": "InvalidSEQ",
        "msg": "Invalid SEQ"
      },
      {
        "code": 305,
        "name": "OverflowKeyArray",
        "msg": "Overflow maximum master key array"
      },
      {
        "code": 306,
        "name": "NotAllowed",
        "msg": "Not Allowed"
      }
    ],
    "metadata": {
      "address": "3vn329CSYxQc4T1DNSk4Lw5Js3x83zwQTfv2qGw8tEuQ"
    }
  }
export const IDL: AtlasFarming = {
    "version": "0.0.0",
    "name": "atlas_farming",
    "instructions": [
      {
        "name": "createState",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "createPool",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "tokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rewardVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rewardMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenBump",
            "type": "u8"
          },
          {
            "name": "rewardBump",
            "type": "u8"
          },
          {
            "name": "tokenPerSecond",
            "type": "u64"
          }
        ]
      },
      {
        "name": "addMasterWallet",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "masterKey",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "closePool",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "fundRewardToken",
        "accounts": [
          {
            "name": "state",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "rewardVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "changeTokenPerSecond",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "tokenPerSecond",
            "type": "u64"
          }
        ]
      },
      {
        "name": "createUser",
        "accounts": [
          {
            "name": "state",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "stake",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "poolVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "unstake",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "poolVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "harvest",
        "accounts": [
          {
            "name": "state",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "rewardVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "GlobalStateAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "totalFarm",
              "type": "u64"
            },
            {
              "name": "startTime",
              "type": "i64"
            }
          ]
        }
      },
      {
        "name": "FarmPoolAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "amount",
              "type": "u64"
            },
            {
              "name": "tokenMint",
              "type": "publicKey"
            },
            {
              "name": "tokenVault",
              "type": "publicKey"
            },
            {
              "name": "rewardMint",
              "type": "publicKey"
            },
            {
              "name": "rewardVault",
              "type": "publicKey"
            },
            {
              "name": "tokenPerSecond",
              "type": "u64"
            },
            {
              "name": "lastRewardTime",
              "type": "i64"
            },
            {
              "name": "accRewardPerShare",
              "type": "u128"
            },
            {
              "name": "totalUser",
              "type": "u64"
            },
            {
              "name": "totalMaster",
              "type": "u8"
            },
            {
              "name": "masterWalletArr",
              "type": {
                "array": [
                  "publicKey",
                  10
                ]
              }
            }
          ]
        }
      },
      {
        "name": "FarmPoolUserAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "pool",
              "type": "publicKey"
            },
            {
              "name": "amount",
              "type": "u64"
            },
            {
              "name": "rewardAmount",
              "type": "u128"
            },
            {
              "name": "rewardDebt",
              "type": "u128"
            },
            {
              "name": "lastStakeTime",
              "type": "i64"
            },
            {
              "name": "reserved1",
              "type": "u128"
            },
            {
              "name": "reserved2",
              "type": "u128"
            },
            {
              "name": "reserved3",
              "type": "u128"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 300,
        "name": "UnstakeOverAmount",
        "msg": "Over staked amount"
      },
      {
        "code": 301,
        "name": "UnderLocked",
        "msg": "Under locked"
      },
      {
        "code": 302,
        "name": "WorkingPool",
        "msg": "Pool is working"
      },
      {
        "code": 303,
        "name": "InvalidLockDuration",
        "msg": "Invalid Lock Duration"
      },
      {
        "code": 304,
        "name": "InvalidSEQ",
        "msg": "Invalid SEQ"
      },
      {
        "code": 305,
        "name": "OverflowKeyArray",
        "msg": "Overflow maximum master key array"
      },
      {
        "code": 306,
        "name": "NotAllowed",
        "msg": "Not Allowed"
      }
    ],
    "metadata": {
      "address": "3vn329CSYxQc4T1DNSk4Lw5Js3x83zwQTfv2qGw8tEuQ"
    }
  }