import * as anchor from '@project-serum/anchor';
import { defaultAccounts } from './utils'

export const addMasterWallet = (
    stateSigner: anchor.web3.PublicKey,
    poolSigner: anchor.web3.PublicKey,
    masterKey: anchor.web3.PublicKey,
    authority: anchor.web3.PublicKey,
    program: any
) => {
    const tx = program.transaction.addMasterWallet({
        accounts: {
          state: stateSigner,
          pool: poolSigner,
          masterKey: masterKey,
          authority: authority,
          ...defaultAccounts
        }
      })
    return tx;
}