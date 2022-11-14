import * as anchor from '@project-serum/anchor';
import { defaultAccounts } from './utils'

export const createState = (
    stateBump: number,
    stateSigner: anchor.web3.PublicKey,
    authority: anchor.web3.PublicKey,
    program: any
) => {
    const tx = program.transaction.createState(stateBump, {
        accounts: {
          state: stateSigner,
          authority: authority,
          ...defaultAccounts
        }
    });
    return tx;
}