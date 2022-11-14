import * as anchor from '@project-serum/anchor';
import { defaultAccounts } from './utils'

export const closePool = (
    stateSigner: anchor.web3.PublicKey,
    poolSigner: anchor.web3.PublicKey,
    authority: anchor.web3.PublicKey,
    program: any
) => {
    const tx = program.transaction.closePool({
        accounts: {
          state: stateSigner,
          pool: poolSigner,
  
          authority: authority,
          ...defaultAccounts
        }
    });
    return tx;
}