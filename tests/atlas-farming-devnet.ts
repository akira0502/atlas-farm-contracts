import * as anchor from '@project-serum/anchor';
import * as serumCmn from "@project-serum/common";
import { assert } from 'chai';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { getMaxTokenAccountKey } from './integrations/utils';

import { createState } from './integrations/createState';
import { createPool } from './integrations/createPool'
import { fundToFarm } from './integrations/fundToFarm';
import 'dotenv/config'
import { createUser } from './integrations/createUser';

const utf8 = anchor.utils.bytes.utf8;
const provider = anchor.Provider.local("https://api.devnet.solana.com");
anchor.setProvider(provider);
let program = anchor.workspace.AtlasFarming;
let connection = provider.connection;

let stateSigner = anchor.web3.Keypair.generate().publicKey, stateBump = 255; // Program Account - global state

let lpMint: anchor.web3.PublicKey = new anchor.web3.PublicKey(process.env.POOL_ADDRESS as string)
let poolSigner = anchor.web3.Keypair.generate().publicKey, poolBump = 255; // Program Account - pool
let poolVault = anchor.web3.Keypair.generate().publicKey, poolVaultBump = 255; // Program Account - pool vault

let rewardMint: anchor.web3.PublicKey = new anchor.web3.PublicKey(process.env.REWARD_TOKEN_ADDRESS as string)
let rewardPoolVault = anchor.web3.Keypair.generate().publicKey, rewardPoolVaultBump= 255; // Program Account - reward pool vault
let userSigner = anchor.web3.Keypair.generate().publicKey, userBump= 255; // Program Account - user of pool


//----------------------- signer as a farm manager(state, pool, etc modifier) ----------------------//
const superOwner = anchor.web3.Keypair.fromSecretKey(bs58.decode(process.env.WALLET_PRIVATE_KEY as string));
const superOwner_provider = new anchor.Provider(connection, new NodeWallet(superOwner), anchor.Provider.defaultOptions());


const user = anchor.web3.Keypair.fromSecretKey(bs58.decode(process.env.WALLET_PRIVATE_KEY as string));
//-------------------------------------------------------------------------------------------------//


let superOwnerRewardToken: anchor.web3.PublicKey; // Token Account - reward token account owned by superOwner -- will be used to fund
let amount = new anchor.BN(20);

describe('atlas-farm', () => {
  it('Is initialized!', async function () {

    //------------------- pda function to fetch state program account -------------------------//
    [stateSigner, stateBump] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode('state')],
      program.programId
    );
    
    //------------------- pda function to fetch pool program account -------------------------//
    [poolSigner, poolBump] = await anchor.web3.PublicKey.findProgramAddress(
      [lpMint.toBuffer()],
      program.programId
    );
    console.log(poolSigner.toString());

    //------------------- pda function to fetch pool vault program account -------------------------//
    [poolVault, poolVaultBump] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode('pool-vault'), lpMint.toBuffer(), poolSigner.toBuffer()],
      program.programId
    );

    //------------------- pda function to fetch pool reward vault program account -------------------------//
    [rewardPoolVault, rewardPoolVaultBump] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode('reward-vault'), rewardMint.toBuffer(), poolSigner.toBuffer()],
      program.programId
    );

    [userSigner, userBump] = await anchor.web3.PublicKey.findProgramAddress(
      [poolSigner.toBuffer(), user.publicKey.toBuffer()],
      program.programId
    );

    superOwnerRewardToken = await getMaxTokenAccountKey(rewardMint, connection, superOwner.publicKey);
  });

//   it('Create State', async function () {
//     const tx = createState(
//       stateBump, 
//       stateSigner,
//       superOwner.publicKey, 
//       program
//     );
//     await superOwner_provider.send(tx, [], {})
//     const stateAccount = await program.account.globalStateAccount.fetch(stateSigner);
//   })

  it('Create Pool', async function () {
    const tx = createPool(
      poolBump, 
      poolVaultBump, 
      rewardPoolVaultBump, 
      new anchor.BN('20'), 
      stateSigner, 
      poolSigner, 
      lpMint, 
      poolVault, 
      rewardMint, 
      rewardPoolVault, 
      superOwner.publicKey, 
      program
    );
    await superOwner_provider.send(tx, [], {})
    const poolAccount = await program.account.farmPoolAccount.fetch(poolSigner)
  })

  it('Fund to farm', async function () {
    const tx = fundToFarm(
      new anchor.BN(1_000_000_000_000),
      stateSigner,
      poolSigner,
      rewardPoolVault,
      superOwnerRewardToken,
      superOwner.publicKey,
      program
    )
    await superOwner_provider.send(tx, [], {})
    const rewardVaultAmount = await getTokenAmount(rewardPoolVault)
    assert.ok(rewardVaultAmount.eq(new anchor.BN(1_000_000_000_000)))
  });

    it('Create User', async function () {
      const tx = createUser(
        userBump,
        stateSigner,
        poolSigner,
        userSigner,
        user.publicKey,
        program
      )
      await superOwner_provider.send(tx, [], {})
      const userSignerAccount = await program.account.farmPoolUserAccount.fetch(userSigner);
      // console.log(userSignerAccount)
      console.log("userSigner", userSigner.toString())
    })
})

async function getTokenAmount (account: anchor.web3.PublicKey) {
  const { amount } = await serumCmn.getTokenAccount(provider, account)
  return amount
}