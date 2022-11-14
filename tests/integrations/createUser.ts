import * as anchor from '@project-serum/anchor';
import { defaultAccounts } from './utils'

export const createUser = (
    userBump: number,
    stateSigner: anchor.web3.PublicKey,
    poolSigner: anchor.web3.PublicKey,
    userSigner: anchor.web3.PublicKey,
    authority: anchor.web3.PublicKey,
    program: any
) => {
    const tx = program.transaction.createUser(userBump, {
        accounts: {
          state: stateSigner,
          pool: poolSigner,
          user: userSigner,
          authority: authority,
          ...defaultAccounts
        }
    })
    return tx;
}