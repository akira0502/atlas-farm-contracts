import * as anchor from '@project-serum/anchor';
import { defaultAccounts } from './utils'

export const unstake = (
    amount: anchor.BN,
    stateSigner: anchor.web3.PublicKey,
    poolSigner: anchor.web3.PublicKey,
    userSigner: anchor.web3.PublicKey,
    poolVault: anchor.web3.PublicKey,
    userVault: anchor.web3.PublicKey,
    authority: anchor.web3.PublicKey,
    program: any
) => {
    const tx = program.transaction.unstake(amount, {
        accounts: {
          state: stateSigner,
          pool: poolSigner,
          user: userSigner,
          authority: authority,
          poolVault: poolVault,
          userVault: userVault,
          ...defaultAccounts
        }
    });
    return tx;
}