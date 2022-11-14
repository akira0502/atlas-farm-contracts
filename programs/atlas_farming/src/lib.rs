use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use std::convert::TryFrom;
use std::convert::TryInto;
use std::mem::size_of;

declare_id!("3vn329CSYxQc4T1DNSk4Lw5Js3x83zwQTfv2qGw8tEuQ");

const ACC_PRECISION: u128 = 100_000_000_000;

#[program]
pub mod atlas_farming {
    use super::*;

    pub fn create_state(
        _ctx: Context<CreateGlobalState>,
        bump: u8,
    ) -> ProgramResult {
        let state = &mut _ctx.accounts.state.load_init()?;
        state.authority = _ctx.accounts.authority.key();
        state.bump = bump;
        state.start_time = _ctx.accounts.clock.unix_timestamp;
        Ok(())
    }

    pub fn create_pool(
        _ctx: Context<CreateFarmPool>,
        bump: u8,
        token_bump: u8,
        reward_bump: u8,
        token_per_second: u64,
    ) -> ProgramResult {

        for pool_acc in _ctx.remaining_accounts.iter() {
            let loader = Loader::<FarmPoolAccount>::try_from(&_ctx.program_id, &pool_acc)?;
            loader.load_mut()?.update(&_ctx.accounts.clock)?;
        }

        let mut state = _ctx.accounts.state.load_mut()?;
        let pool = &mut _ctx.accounts.pool.load_init()?;
        pool.bump = bump;
        pool.token_mint = _ctx.accounts.token_mint.key();
        pool.token_vault = _ctx.accounts.token_vault.key();
        pool.authority = _ctx.accounts.authority.key();
        
        pool.token_per_second = token_per_second;
        pool.reward_mint = _ctx.accounts.reward_mint.key();
        pool.reward_vault = _ctx.accounts.reward_vault.key();
        pool.total_master = 1;
        pool.master_wallet_arr[0] = _ctx.accounts.authority.key();
        state.total_farm = state.total_farm.checked_add(1).unwrap();
        
        Ok(())
    }

    pub fn add_master_wallet(_ctx: Context<AddMasterWallet>) -> ProgramResult {
        let mut state = _ctx.accounts.state.load_mut()?;
        let mut pool = _ctx.accounts.pool.load_mut()?;
        let master_key = _ctx.accounts.master_key.key();
        let total_master = pool.total_master;
        require!(total_master < 10, ErrorCode::OverflowKeyArray);
        pool.master_wallet_arr[total_master as usize] = master_key;
        pool.total_master = total_master + 1;
        Ok(())
    }

    pub fn close_pool(_ctx: Context<CloseFarmPool>) -> ProgramResult {
        let mut state = _ctx.accounts.state.load_mut()?;
        for pool_acc in _ctx.remaining_accounts.iter() {
            let loader = Loader::<FarmPoolAccount>::try_from(&_ctx.program_id, &pool_acc)?;
            loader.load_mut()?.update(&_ctx.accounts.clock)?;
        }
        let pool = _ctx.accounts.pool.load()?;
        let authority = _ctx.accounts.authority.key();
        let is_master = pool.master_wallet_arr.iter().position(|&s| s == authority);
        require!(is_master != None, ErrorCode::NotAllowed);
        require!(pool.amount == 0, ErrorCode::WorkingPool);
        state.total_farm = state.total_farm.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn fund_reward_token(_ctx: Context<FundToFarm>, amount: u64) -> ProgramResult {
        let pool = _ctx.accounts.pool.load()?;
        let authority = _ctx.accounts.authority.key();
        let is_master = pool.master_wallet_arr.iter().position(|&s| s == authority);
        require!(is_master != None, ErrorCode::NotAllowed);
        let cpi_accounts = Transfer {
            from: _ctx.accounts.user_vault.to_account_info(),
            to: _ctx.accounts.reward_vault.to_account_info(),
            authority: _ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = _ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn change_token_per_second(
        _ctx: Context<ChangeEmissionRate>,
        token_per_second: u64,
    ) -> ProgramResult {
        msg!("first");
        let mut pool = _ctx.accounts.pool.load_mut()?;
        let authority = _ctx.accounts.authority.key();
        let is_master = pool.master_wallet_arr.iter().position(|&s| s == authority);
        require!(is_master != None, ErrorCode::NotAllowed);

        for pool_acc in _ctx.remaining_accounts.iter() {
            let loader = Loader::<FarmPoolAccount>::try_from(&_ctx.program_id, &pool_acc)?;
            loader.load_mut()?.update(&_ctx.accounts.clock)?;
        }
        pool.token_per_second = token_per_second;
        Ok(())
    }


    pub fn create_user(_ctx: Context<CreateFarmUser>, bump: u8) -> ProgramResult {
        let user = &mut _ctx.accounts.user.load_init()?;
        user.authority = _ctx.accounts.authority.key();
        user.bump = bump;
        user.pool = _ctx.accounts.pool.key();
        let mut pool = _ctx.accounts.pool.load_mut()?;
        pool.total_user += 1;
        
        Ok(())
    }

    pub fn stake(_ctx: Context<StakeAndUnstake>, amount: u64) -> ProgramResult {
        // let state = _ctx.accounts.state.load()?;
        let mut user = _ctx.accounts.user.load_mut()?;
        let mut pool = _ctx.accounts.pool.load_mut()?;

        pool.update(&_ctx.accounts.clock)?;
        user.calculate_reward_amount(&pool)?;

        user.amount = user.amount.checked_add(amount).unwrap();
        pool.amount = pool.amount.checked_add(amount).unwrap();

        user.calculate_reward_debt(&pool)?;
        user.last_stake_time = _ctx.accounts.clock.unix_timestamp;

        let cpi_accounts = Transfer {
            from: _ctx.accounts.user_vault.to_account_info(),
            to: _ctx.accounts.pool_vault.to_account_info(),
            authority: _ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = _ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;
        
        Ok(())
    }

    pub fn unstake(_ctx: Context<StakeAndUnstake>, amount: u64) -> ProgramResult {
        // let state = _ctx.accounts.state.load()?;
        let mut user = _ctx.accounts.user.load_mut()?;
        let mut pool = _ctx.accounts.pool.load_mut()?;

        require!(user.amount >= amount, ErrorCode::UnstakeOverAmount);

        pool.update(&_ctx.accounts.clock)?;
        user.calculate_reward_amount(&pool)?;

        user.last_stake_time = _ctx.accounts.clock.unix_timestamp;
        user.amount = user.amount.checked_sub(amount).unwrap();
        pool.amount = pool.amount.checked_sub(amount).unwrap();

        user.calculate_reward_debt(&pool)?;
        drop(pool);

        let new_pool = _ctx.accounts.pool.load()?;
        let cpi_accounts = Transfer {
            from: _ctx.accounts.pool_vault.to_account_info(),
            to: _ctx.accounts.user_vault.to_account_info(),
            authority: _ctx.accounts.pool.to_account_info(),
        };

        let seeds = &[new_pool.token_mint.as_ref(), &[new_pool.bump]];
        let signer = &[&seeds[..]];
        let cpi_program = _ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;
        
        Ok(())
    }

    pub fn harvest(_ctx: Context<Harvest>) -> ProgramResult {
        let state = _ctx.accounts.state.load()?;
        let mut pool = _ctx.accounts.pool.load_mut()?;
        let mut user = _ctx.accounts.user.load_mut()?;

        pool.update(&_ctx.accounts.clock)?;
        user.calculate_reward_amount(&pool)?;

        let total_reward = user.reward_amount.try_into().unwrap();

        user.reward_amount = 0;
        user.calculate_reward_debt(&pool)?;

        drop(pool);

        let new_pool = _ctx.accounts.pool.load()?;

        let cpi_accounts = Transfer {
            from: _ctx.accounts.reward_vault.to_account_info(),
            to: _ctx.accounts.user_vault.to_account_info(),
            authority: _ctx.accounts.pool.to_account_info(),
        };

        let seeds = &[new_pool.token_mint.as_ref(), &[new_pool.bump]];
        let signer = &[&seeds[..]];
        let cpi_program = _ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

        token::transfer(cpi_ctx, total_reward)?;
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct CreateGlobalState<'info> {
    #[account(
        init,
        seeds = [b"state".as_ref()],
        bump = bump,
        payer = authority,
        space = 8 + size_of::<GlobalStateAccount>()
    )]
    pub state: Loader<'info, GlobalStateAccount>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
#[instruction(bump: u8, token_bump: u8, reward_bump: u8)]
pub struct CreateFarmPool<'info> {
    #[account(mut, 
        seeds = [b"state".as_ref()], 
        bump = state.load()?.bump, 
        has_one = authority)]
    pub state: Loader<'info, GlobalStateAccount>,

    #[account(
        init,
        seeds = [token_mint.key().as_ref()],
        bump = bump,
        payer = authority,
        space = 8 + size_of::<FarmPoolAccount>()
    )]
    pub pool: Loader<'info, FarmPoolAccount>,

    pub authority: Signer<'info>,
    
    #[account(
        init,
        token::mint = token_mint,
        token::authority = pool,
        seeds = [
            b"pool-vault".as_ref(),
            token_mint.key().as_ref(), 
            pool.key().as_ref(),
        ],
        bump = token_bump,
        payer = authority)]
    pub token_vault: Box<Account<'info, TokenAccount>>,
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        token::mint = reward_mint,
        token::authority = pool,
        seeds = [
            b"reward-vault".as_ref(),
            reward_mint.key().as_ref(), 
            pool.key().as_ref(),
        ],
        bump = reward_bump,
        payer = authority)]
    pub reward_vault: Box<Account<'info, TokenAccount>>,
    pub reward_mint: Box<Account<'info, Mint>>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,

    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
    pub clock: Sysvar<'info, Clock>,



}

#[derive(Accounts)]
pub struct CloseFarmPool<'info> {
    #[account(mut, 
        seeds = [b"state".as_ref()], 
        bump = state.load()?.bump)]
    pub state: Loader<'info, GlobalStateAccount>,
    
    #[account(mut, 
        seeds = [pool.load()?.token_mint.key().as_ref()], 
        bump = pool.load()?.bump, 
        close = authority)]
    pub pool: Loader<'info, FarmPoolAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct FundToFarm<'info> {
    #[account(
        seeds = [b"state".as_ref()], 
        bump = state.load()?.bump)]
    pub state: Loader<'info, GlobalStateAccount>,

    #[account(mut, 
        seeds = [pool.load()?.token_mint.key().as_ref()], 
        bump = pool.load()?.bump, 
        )]
    pub pool: Loader<'info, FarmPoolAccount>,

    pub authority: Signer<'info>,

    #[account(mut, constraint = reward_vault.key() == pool.load()?.reward_vault)]
    pub reward_vault: Box<Account<'info, TokenAccount>>,
    
    #[account(mut, constraint = user_vault.owner == authority.key())]
    pub user_vault: Box<Account<'info, TokenAccount>>,
    
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AddMasterWallet<'info> {
    #[account(mut, 
        seeds = [b"state".as_ref()], 
        bump = state.load()?.bump, 
        has_one = authority)]
    pub state: Loader<'info, GlobalStateAccount>,

    #[account(mut, 
        seeds = [pool.load()?.token_mint.key().as_ref()], 
        bump = pool.load()?.bump, 
        has_one = authority, 
        )]
    pub pool: Loader<'info, FarmPoolAccount>,

    /// CHECK
    pub master_key: AccountInfo<'info>,

    pub authority: Signer<'info>,
    pub clock: Sysvar<'info, Clock>,

}

#[derive(Accounts)]
pub struct ChangeEmissionRate<'info> {
    #[account(mut, 
        seeds = [b"state".as_ref()], 
        bump = state.load()?.bump)]
    pub state: Loader<'info, GlobalStateAccount>,

    #[account(mut, 
        seeds = [pool.load()?.token_mint.key().as_ref()], 
        bump = pool.load()?.bump
        )]
    pub pool: Loader<'info, FarmPoolAccount>,

    pub authority: Signer<'info>,

    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct CreateFarmUser<'info> {
    #[account(seeds = [b"state".as_ref()], bump = state.load()?.bump)]
    pub state: Loader<'info, GlobalStateAccount>,

    #[account(mut, 
        seeds = [pool.load()?.token_mint.key().as_ref()], 
        bump = pool.load()?.bump)]
    pub pool: Loader<'info, FarmPoolAccount>,

    #[account(
        init,
        seeds = [pool.key().as_ref(), authority.key().as_ref()],
        bump = bump,
        payer = authority,
        space = 8 + size_of::<FarmPoolUserAccount>()
    )]
    pub user: Loader<'info, FarmPoolUserAccount>,

    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct StakeAndUnstake<'info> {
    #[account(mut, 
        seeds = [b"state".as_ref()], 
        bump = state.load()?.bump)]
    pub state: Loader<'info, GlobalStateAccount>,

    #[account(mut, 
        seeds = [pool.load()?.token_mint.key().as_ref()], 
        bump = pool.load()?.bump)]
    pub pool: Loader<'info, FarmPoolAccount>,

    #[account(mut, 
        seeds = [
            pool.key().as_ref(), 
            authority.key().as_ref()], 
        bump = user.load()?.bump, 
        has_one = pool, 
        has_one = authority)]
    pub user: Loader<'info, FarmPoolUserAccount>,

    pub authority: Signer<'info>,

    #[account(mut, constraint = pool_vault.key() == pool.load()?.token_vault)]
    pub pool_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, constraint = user_vault.owner == authority.key())]
    pub user_vault: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct Harvest<'info> {

    #[account(mut, 
        seeds = [b"state".as_ref()], 
        bump = state.load()?.bump)]
    pub state: Loader<'info, GlobalStateAccount>,

    #[account(mut, 
        seeds = [pool.load()?.token_mint.key().as_ref()], 
        bump = pool.load()?.bump)]
    pub pool: Loader<'info, FarmPoolAccount>,

    #[account(mut, 
        seeds = [
            pool.key().as_ref(), 
            authority.key().as_ref()], 
        bump = user.load()?.bump, 
        has_one = pool, 
        has_one = authority)]
    pub user: Loader<'info, FarmPoolUserAccount>,

    pub authority: Signer<'info>,

    #[account(mut, constraint = reward_vault.key() == pool.load()?.reward_vault)]
    pub reward_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut, 
        constraint = user_vault.owner == authority.key(),
        constraint = user_vault.mint == pool.load()?.reward_mint,
    )]
    pub user_vault: Box<Account<'info, TokenAccount>>,
    
    pub system_program: Program<'info, System>,
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: Program<'info, Token>,
    pub clock: Sysvar<'info, Clock>,
}

#[account(zero_copy)]
pub struct GlobalStateAccount {
    pub authority: Pubkey,
    pub bump: u8,
    pub total_farm: u64,
    pub start_time: i64,
}

#[account(zero_copy)]
pub struct FarmPoolAccount {
    pub bump: u8,
    pub authority: Pubkey,
    pub amount: u64,

    pub token_mint: Pubkey,
    pub token_vault: Pubkey,

    pub reward_mint: Pubkey,
    pub reward_vault: Pubkey,
    pub token_per_second: u64,

    pub last_reward_time: i64,
    pub acc_reward_per_share: u128,
    pub total_user: u64,
    pub total_master: u8,
    pub master_wallet_arr: [Pubkey; 10],
}

impl FarmPoolAccount {
    fn update<'info>(&mut self, clock: &Sysvar<'info, Clock>) -> Result<()> {
        let seconds = u128::try_from(
            clock
                .unix_timestamp
                .checked_sub(self.last_reward_time)
                .unwrap(),
        )
        .unwrap();
        let mut reward_per_share: u128 = 0;
        if self.amount > 0 && seconds > 0 {
            reward_per_share = u128::from(self.token_per_second)
                .checked_mul(seconds)
                .unwrap()
                .checked_mul(ACC_PRECISION)
                .unwrap()
                .checked_div(u128::from(self.amount))
                .unwrap();
        }
        self.acc_reward_per_share = self
            .acc_reward_per_share
            .checked_add(reward_per_share)
            .unwrap();
        self.last_reward_time = clock.unix_timestamp;

        Ok(())
    }
}

#[account(zero_copy)]
pub struct FarmPoolUserAccount {
    pub bump: u8,
    pub authority: Pubkey,

    pub pool: Pubkey,

    pub amount: u64,

    pub reward_amount: u128,
    pub reward_debt: u128,

    pub last_stake_time: i64,

    pub reserved_1: u128,
    pub reserved_2: u128,
    pub reserved_3: u128,
}

impl FarmPoolUserAccount {
    fn calculate_reward_amount<'info>(
        &mut self,
        pool: &FarmPoolAccount,
    ) -> Result<()> {
        let pending_amount: u128 = u128::from(self.amount)
            .checked_mul(pool.acc_reward_per_share)
            .unwrap()
            .checked_div(ACC_PRECISION)
            .unwrap()
            .checked_sub(u128::from(self.reward_debt))
            .unwrap();
        self.reward_amount = self.reward_amount.checked_add(pending_amount).unwrap();
        Ok(())
    }
    fn calculate_reward_debt<'info>(&mut self, pool: &FarmPoolAccount) -> Result<()> {

        self.reward_debt = u128::from(self.amount)
            .checked_mul(pool.acc_reward_per_share)
            .unwrap()
            .checked_div(ACC_PRECISION)
            .unwrap();
        Ok(())
    }
}

#[error]
pub enum ErrorCode {
    #[msg("Over staked amount")]
    UnstakeOverAmount,
    #[msg("Under locked")]
    UnderLocked,
    #[msg("Pool is working")]
    WorkingPool,
    #[msg("Invalid Lock Duration")]
    InvalidLockDuration,
    #[msg("Invalid SEQ")]
    InvalidSEQ,
    #[msg("Overflow maximum master key array")]
    OverflowKeyArray,
    #[msg("Not Allowed")]
    NotAllowed,
}
