import * as anchor from '@project-serum/anchor';
import * as serumCmn from "@project-serum/common";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { assert } from 'chai';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'

import { createState } from './integrations/createState';
import { createPool } from './integrations/createPool'
import { addMasterWallet } from './integrations/addMasterWallet';
import { changeTokenPerSecond } from './integrations/changeTokenPerSecond';
import { fundToFarm } from './integrations/fundToFarm';
import { createUser } from './integrations/createUser';
import { stake } from './integrations/stake';
import { harvest } from './integrations/harvest';
import { unstake } from './integrations/unstake';
import { closePool } from './integrations/closePool';

const utf8 = anchor.utils.bytes.utf8;
const provider = anchor.Provider.local();
anchor.setProvider(provider);
let program = anchor.workspace.AtlasFarming;
let connection = provider.connection;

let stateSigner = anchor.web3.Keypair.generate().publicKey, stateBump = 255; // Program Account - global state

let lpMint: Token = null as any; // Pool token mint
let poolSigner = anchor.web3.Keypair.generate().publicKey, poolBump = 255; // Program Account - pool
let poolVault = anchor.web3.Keypair.generate().publicKey, poolVaultBump = 255; // Program Account - pool vault

let rewardMint: Token = null as any; // Reward token mint
let rewardPoolVault = anchor.web3.Keypair.generate().publicKey, rewardPoolVaultBump= 255; // Program Account - reward pool vault

let userSigner = anchor.web3.Keypair.generate().publicKey, userBump= 255; // Program Account - user of pool


//----------------------- signer as an end user ----------------------//
const user = anchor.web3.Keypair.generate();
const user_provider = new anchor.Provider(connection, new NodeWallet(user), anchor.Provider.defaultOptions());
//-------------------------------------------------------------------//

//----------------------- signer as a farm manager(state, pool, etc modifier) ----------------------//
const superOwner = anchor.web3.Keypair.generate();
const superOwner_provider = new anchor.Provider(connection, new NodeWallet(superOwner), anchor.Provider.defaultOptions());
//-------------------------------------------------------------------------------------------------//


//----------------------- signer as a farm manager(state, pool, etc modifier) ----------------------//
const master = anchor.web3.Keypair.generate();
const master_provider = new anchor.Provider(connection, new NodeWallet(master), anchor.Provider.defaultOptions());
//-------------------------------------------------------------------------------------------------//


let userLPToken: anchor.web3.PublicKey; // Token Account - lp token account owned by user
let superOwnerRewardToken: anchor.web3.PublicKey; // Token Account - reward token account owned by superOwner -- will be used to fund
let masterRewardToken: anchor.web3.PublicKey; // Token Account - reward token account owned by master -- will be used to fund
let userRewardToken: anchor.web3.PublicKey; // Token Account - reward token account owned by user
let amount = new anchor.BN(20);

describe('atlas-farm', () => {
  it('Is initialized!', async function () {
    rewardMint = await createMint(provider, provider.wallet.publicKey);
    lpMint = await createMint(provider, provider.wallet.publicKey);


    //------------------- pda function to fetch state program account -------------------------//
    [stateSigner, stateBump] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode('state')],
      program.programId
    );
    
    //------------------- pda function to fetch pool program account -------------------------//
    [poolSigner, poolBump] = await anchor.web3.PublicKey.findProgramAddress(
      [lpMint.publicKey.toBuffer()],
      program.programId
    );

    //------------------- pda function to fetch user program account -------------------------//
    [userSigner, userBump] = await anchor.web3.PublicKey.findProgramAddress(
      [poolSigner.toBuffer(), user.publicKey.toBuffer()],
      program.programId
    );

    //------------------- pda function to fetch pool vault program account -------------------------//
    [poolVault, poolVaultBump] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode('pool-vault'), lpMint.publicKey.toBuffer(), poolSigner.toBuffer()],
      program.programId
    );

    //------------------- pda function to fetch pool reward vault program account -------------------------//
    [rewardPoolVault, rewardPoolVaultBump] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode('reward-vault'), rewardMint.publicKey.toBuffer(), poolSigner.toBuffer()],
      program.programId
    );
    await connection.confirmTransaction(
      await connection.requestAirdrop(
        superOwner.publicKey, anchor.web3.LAMPORTS_PER_SOL
      )
    )
    await connection.confirmTransaction(
      await connection.requestAirdrop(
        user.publicKey, anchor.web3.LAMPORTS_PER_SOL
      )
    )
    await connection.confirmTransaction(
      await connection.requestAirdrop(
        master.publicKey, anchor.web3.LAMPORTS_PER_SOL
      )
    )
    superOwnerRewardToken = await rewardMint.createAccount(superOwner.publicKey);
    masterRewardToken = await rewardMint.createAccount(master.publicKey);
    userRewardToken = await rewardMint.createAccount(user.publicKey);
    userLPToken = await lpMint.createAccount(user.publicKey);
    
    await rewardMint.mintTo(superOwnerRewardToken, provider.wallet.publicKey, [], 1_000_000_000);
    await rewardMint.mintTo(masterRewardToken, provider.wallet.publicKey, [], 1_000_000_000);
    await lpMint.mintTo(userLPToken, provider.wallet.publicKey, [], 100);
  });

  it('Create State', async function () {
    const tx = createState(
      stateBump, 
      stateSigner, 
      superOwner.publicKey, 
      program
    );
    await superOwner_provider.send(tx, [], {})
    const stateAccount = await program.account.globalStateAccount.fetch(stateSigner);
  })

  it('Create Pool', async function () {
    const tx = createPool(
      poolBump, 
      poolVaultBump, 
      rewardPoolVaultBump, 
      new anchor.BN('20'), 
      stateSigner, 
      poolSigner, 
      lpMint.publicKey, 
      poolVault, 
      rewardMint.publicKey, 
      rewardPoolVault, 
      superOwner.publicKey, 
      program
    );
    await superOwner_provider.send(tx, [], {})
    const poolAccount = await program.account.farmPoolAccount.fetch(poolSigner)
  })

  it('Add Master Wallet', async function() {
    const tx = addMasterWallet(
      stateSigner,
      poolSigner,
      master.publicKey,
      superOwner.publicKey,
      program
    );
    await superOwner_provider.send(tx, [], {});
  })

  it('ChangeTokenPerSecond', async function () {
    const tx = changeTokenPerSecond(new anchor.BN(40), stateSigner, poolSigner, master.publicKey, program)
    await master_provider.send(tx, [], {})
    const poolInfo = await program.account.farmPoolAccount.fetch(poolSigner)
    assert.ok(poolInfo.tokenPerSecond.eq(new anchor.BN(40)), "Invalid change token per second")
  });

  it('Fund to farm', async function () {
    // await rewardMint.mintTo(stateRewardVault, creatorKey, [provider.wallet], getNumber(10000).toString())
    const tx = fundToFarm(
      new anchor.BN(10000),
      stateSigner,
      poolSigner,
      rewardPoolVault,
      masterRewardToken,
      master.publicKey,
      program
    )
    await master_provider.send(tx, [], {})
    const rewardVaultAmount = await getTokenAmount(rewardPoolVault)
    assert.ok(rewardVaultAmount.eq(new anchor.BN(10000)))
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
    await user_provider.send(tx, [], {})
    await program.account.farmPoolUserAccount.fetch(userSigner);
  })
  it('Stake', async function () {
    const tx = stake(
      amount,
      stateSigner,
      poolSigner,
      userSigner,
      poolVault,
      userLPToken,
      user.publicKey,
      program
    )
    await user_provider.send(tx, [], {})
    const userInfo = await program.account.farmPoolUserAccount.fetch(userSigner)
    assert.ok(userInfo.amount.eq(amount), "Invalid stake amount")
  })
  it('Harvest', async function () {
    console.log("Delaying 3 secs to harvest reward");
    await sleep(3000);
    const tx = harvest(
      stateSigner,
      poolSigner,
      userSigner,
      rewardPoolVault,
      userRewardToken,
      user.publicKey,
      program
    )
    await user_provider.send(tx, [], {})
    const rewardAmount = await getTokenAmount(userRewardToken)
    console.log("Havested reward", rewardAmount.toString());
  })

  it('Unstake', async function () {
    const tx = unstake(
      amount,
      stateSigner,
      poolSigner,
      userSigner,
      poolVault,
      userLPToken,
      user.publicKey,
      program
    )
    await user_provider.send(tx, [], {})
    const userInfo = await program.account.farmPoolUserAccount.fetch(userSigner)
    assert.ok(userInfo.amount.eq(new anchor.BN(0)), "Invalid unstake amount")
  });

  it('Close Pool', async function () {
    const tx = closePool(
      stateSigner,
      poolSigner,
      superOwner.publicKey,
      program
    )
    await superOwner_provider.send(tx, [], {})
    const pools = await program.account.farmPoolAccount.all()
    assert.ok(pools.length == 0, "Pool isn't closed");
  });

})


/******************************************************** */
async function createMint (provider: any, authority: anchor.web3.PublicKey, decimals = 9) {
  if (authority === undefined) {
    authority = provider.wallet.publicKey;
  }
  const mint = await Token.createMint(
    provider.connection,
    provider.wallet.payer,
    authority,
    null,
    decimals,
    TOKEN_PROGRAM_ID
  );
  return mint;
}

async function getTokenAmount (account: anchor.web3.PublicKey) {
  const { amount } = await serumCmn.getTokenAccount(provider, account)
  return amount
}

function sleep (ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}