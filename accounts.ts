import { bool, i64, publicKey, struct, u128, u32, u64, u8, vec,  } from '@project-serum/borsh'
export const STATE_ACCOUNT_LAYOUT = struct([
    publicKey("authority"),
    publicKey("rewardMint"),
    publicKey("rewardVault"),
  
    u8("bump"),
    
    u64('totalPoint'),
    i64('startTime'),
    u64('tokenPerSecond'),
  ]);
  
  export const DURATION_EXTRA_REWARD_LAYOUT = struct([
    i64("duration"),
    u64("extraPercentage"),
  ]);
  
  export const EXTRA_REWARD_ACCOUNT_LAYOUT = struct([
    u8("bump"),
    publicKey("authority"),
    vec(DURATION_EXTRA_REWARD_LAYOUT, "configs"),
  ]);
  
  export const FARM_POOL_ACCOUNT_LAYOUT = struct([
    u8("bump"),
    publicKey("authority"),
    u64("amount"),
    publicKey("mint"),
    publicKey("vault"),
    u64("point"),
    i64("lastRewardTime"),
    u128("accRewardPerShare"),
    u64("amountMultipler"),
    u64("totalUser"),
  ]);
  
  export const FARM_POOL_USER_ACCOUNT_LAYOUT = struct([
    u8("bump"),
    publicKey("pool"),
    publicKey("authority"),
    u64("amount"),
    u128("rewardAmount"),
    u128("extraReward"),
    u128("rewardDebt"),
    i64("lastStakeTime"),
    i64("lockDuration"),
    u128("reserved1"),
    u128("reserved1"),
    u128("reserved3"),
  ]);
  