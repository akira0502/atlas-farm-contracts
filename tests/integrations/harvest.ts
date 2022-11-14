import * as anchor from '@project-serum/anchor';
import { defaultAccounts } from './utils'

export const harvest = (
    stateSigner: anchor.web3.PublicKey,
    poolSigner: anchor.web3.PublicKey,
    userSigner: anchor.web3.PublicKey,
    rewardVault: anchor.web3.PublicKey,
    userVault: anchor.web3.PublicKey,
    authority: anchor.web3.PublicKey,
    program: any
) => {
    const tx = program.transaction.harvest({
        accounts: {
          state: stateSigner,
          pool: poolSigner,
          user: userSigner,
          authority: authority,
          rewardVault: rewardVault,
          userVault: userVault,
          ...defaultAccounts
        }
      });
    return tx;
}