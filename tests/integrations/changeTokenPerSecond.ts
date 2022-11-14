import * as anchor from '@project-serum/anchor';
import { defaultAccounts } from './utils'

export const changeTokenPerSecond = (
    amount: anchor.BN,
    stateSigner: anchor.web3.PublicKey,
    poolSigner: anchor.web3.PublicKey,
    authority: anchor.web3.PublicKey,
    program: any
) => {
    const tx = program.transaction.changeTokenPerSecond(amount, {
        accounts: {
          state: stateSigner,
          pool: poolSigner,
          authority: authority,
          ...defaultAccounts
        }
      })
    return tx;
}