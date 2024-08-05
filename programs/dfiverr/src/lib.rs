use anchor_lang::prelude::*;

declare_id!("9Mp2QPxUAhrUJWFU2oseLe9xgq8bLPdZnjmgtQycySwt");

#[program]
pub mod d_fiverr {
    use super::*;

    pub fn initialize_escrow(ctx: Context<InitializeEscrow>, amount: u64) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let client = &ctx.accounts.client;

        escrow.client = client.key();
        escrow.freelancer = Pubkey::default();
        escrow.amount = amount;
        escrow.is_completed = false;

        // Transfer funds from client to escrow account
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: client.to_account_info(),
                to: escrow.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, amount)?;

        Ok(())
    }

    pub fn set_freelancer(ctx: Context<SetFreelancer>, freelancer: Pubkey) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(escrow.freelancer == Pubkey::default(), ErrorCode::FreelancerAlreadySet);
        escrow.freelancer = freelancer;
        Ok(())
    }

    pub fn release_to_freelancer(ctx: Context<ReleaseToFreelancer>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let freelancer = &ctx.accounts.freelancer;

        require!(!escrow.is_completed, ErrorCode::EscrowAlreadyCompleted);
        require!(escrow.freelancer == freelancer.key(), ErrorCode::InvalidFreelancer);

        let amount = escrow.amount;

        // Transfer funds from escrow to freelancer
        **escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
        **freelancer.to_account_info().try_borrow_mut_lamports()? += amount;

        escrow.is_completed = true;

        Ok(())
    }

    pub fn revert_to_client(ctx: Context<RevertToClient>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let client = &ctx.accounts.client;

        require!(!escrow.is_completed, ErrorCode::EscrowAlreadyCompleted);
        require!(escrow.client == client.key(), ErrorCode::InvalidClient);

        let amount = escrow.amount;

        // Transfer funds from escrow back to client
        **escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
        **client.to_account_info().try_borrow_mut_lamports()? += amount;

        escrow.is_completed = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeEscrow<'info> {
    #[account(init, payer = client, space = 8 + 32 + 32 + 8 + 1)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub client: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetFreelancer<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    pub client: Signer<'info>,
}

#[derive(Accounts)]
pub struct ReleaseToFreelancer<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    /// CHECK: This is safe because we're transferring to this account
    pub freelancer: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct RevertToClient<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub client: Signer<'info>,
}

#[account]
pub struct Escrow {
    pub client: Pubkey,
    pub freelancer: Pubkey,
    pub amount: u64,
    pub is_completed: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Freelancer has already been set")]
    FreelancerAlreadySet,
    #[msg("Escrow has already been completed")]
    EscrowAlreadyCompleted,
    #[msg("Invalid freelancer")]
    InvalidFreelancer,
    #[msg("Invalid client")]
    InvalidClient,
}
