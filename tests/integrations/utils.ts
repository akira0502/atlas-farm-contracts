import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SystemProgram } from '@solana/web3.js';

export const defaultAccounts = {
    tokenProgram: TOKEN_PROGRAM_ID,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    systemProgram: SystemProgram.programId,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
}

export const getMaxTokenAccountKey = async (
    mint: anchor.web3.PublicKey,
    connection: anchor.web3.Connection,
    walletPubkey: anchor.web3.PublicKey
  ) => {
    const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      walletPubkey,
      {
        programId: TOKEN_PROGRAM_ID
      },
      'confirmed'
    )
    let result: any = null
    let maxAmount = 0;
    parsedTokenAccounts.value.forEach(async (tokenAccountInfo) => {
      const tokenAccountPubkey = tokenAccountInfo.pubkey
      const parsedInfo = tokenAccountInfo.account.data.parsed.info
      const mintAddress = parsedInfo.mint
      const amount = parsedInfo.tokenAmount.uiAmount
      if (mintAddress === mint.toBase58() && amount >= maxAmount) {
        result = tokenAccountPubkey
        maxAmount = amount
      }
    })
    return result
  }
