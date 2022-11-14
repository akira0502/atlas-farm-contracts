import * as anchor from '@project-serum/anchor';
import { defaultAccounts } from './utils'

export const createPool = (
    poolBump: number,
    poolVaultBump: number,
    rewardPoolVaultBump: number,
    amount: anchor.BN,
    stateSigner: anchor.web3.PublicKey,
    poolSigner: anchor.web3.PublicKey,
    lpMint: anchor.web3.PublicKey,
    poolVault: anchor.web3.PublicKey,
    rewardMint: anchor.web3.PublicKey,
    rewardVault: anchor.web3.PublicKey,
    authority: anchor.web3.PublicKey,
    program: any
) => {
    const tx = program.transaction.createPool(poolBump,  poolVaultBump, rewardPoolVaultBump, amount, {
        accounts: {
          state: stateSigner,
          pool: poolSigner,
          authority: authority,
  
          tokenMint: lpMint,
          tokenVault: poolVault,
  
          rewardMint: rewardMint,
          rewardVault: rewardVault,
          ...defaultAccounts
        },
      })
    return tx;
}