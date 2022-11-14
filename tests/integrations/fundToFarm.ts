import * as anchor from '@project-serum/anchor';
import { defaultAccounts } from './utils'

export const fundToFarm = (
    amount: anchor.BN,
    stateSigner: anchor.web3.PublicKey,
    poolSigner: anchor.web3.PublicKey,
    rewardVault: anchor.web3.PublicKey,
    userVault: anchor.web3.PublicKey,
    authority: anchor.web3.PublicKey,
    program: any
) => {
    const tx = program.transaction.fundRewardToken(amount, {
        accounts: {
          state: stateSigner,
          pool: poolSigner,
          rewardVault: rewardVault,
          userVault: userVault,
          authority: authority,
          ...defaultAccounts
        }
    })
    return tx;
}