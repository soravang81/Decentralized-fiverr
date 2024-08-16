use anchor_lang::prelude::*;

declare_id!("6t7FU5ZA1A38w4tgAPVqR3bYx9CwoctqgPtQ7oFMJtn");

#[program]
pub mod d_fiverr {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, client : Pubkey , freelancer : Pubkey , amount : u64 )-> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.client = client;
        escrow.freelancer = freelancer;
        escrow.amount = amount;
        escrow.is_completed = false;
        escrow.client_agreed = false;
        escrow.freelancer_agreed = false;
        escrow.owner = *ctx.accounts.owner.key; 

        // Transfer funds from client to escrow account
        let cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.client.to_account_info(),
                to: ctx.accounts.escrow.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, amount)?;

        Ok(())
    }

    pub fn mark_completed(ctx: Context<MarkCompleted>, party: String) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
    
        match party.as_str() {
            "client" => {
                require!(ctx.accounts.signer.key() == escrow.client, ErrorCode::Unauthorized);
                escrow.client_agreed = true;
            },
            "freelancer" => {
                require!(ctx.accounts.signer.key() == escrow.freelancer, ErrorCode::Unauthorized);
                escrow.freelancer_agreed = true;
            },
            _ => return Err(ErrorCode::InvalidParty.into()),
        }
    
        if escrow.client_agreed && escrow.freelancer_agreed {
            escrow.is_completed = true;
        }
    
        Ok(())
    }

    pub fn resolve_dispute(ctx: Context<ResolveDispute>, recipient: Pubkey) -> Result<()> {
        let escrow = &ctx.accounts.escrow;
    
        // Ensure only the contract owner (you) can resolve disputes
        require!(ctx.accounts.owner.key() == escrow.owner, ErrorCode::Unauthorized);
    
        // Ensure the recipient is either the client or the freelancer
        require!(
            recipient == escrow.client || recipient == escrow.freelancer,
            ErrorCode::InvalidRecipient
        );
    
        // Transfer funds to the specified recipient
        let cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.escrow.to_account_info(),
                to: ctx.accounts.recipient.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, escrow.amount)?;
    
        // Mark the escrow as completed
        let escrow = &mut ctx.accounts.escrow;
        escrow.is_completed = true;
    
        Ok(())
    }

    pub fn release_funds(ctx: Context<ReleaseFunds>) -> Result<()> {
        // Check if the escrow is completed
        require!(ctx.accounts.escrow.is_completed, ErrorCode::EscrowNotCompleted);
    
        // Get the amount to transfer
        let amount   = ctx.accounts.escrow.amount;
    
        // Transfer funds to the freelancer
        let cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.escrow.to_account_info(),
                to: ctx.accounts.freelancer.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, amount)?;
    
        // Optionally, we can mark the escrow as paid or close the account here , leaving for now
        // ctx.accounts.escrow.is_paid = true;
    
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = client, space = 8 + 32 + 32 + 8 + 1 + 1 + 1 + 32)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub client: Signer<'info>,
    /// CHECK: This is the owner of the program
    pub owner: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, anchor_lang::system_program::System>,
}

#[derive(Accounts)]
pub struct MarkCompleted<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    pub owner: Signer<'info>,
    /// CHECK: This account is not read or written in this instruction, it's just used as the recipient for funds transfer
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
    pub token_program: Program<'info, anchor_lang::system_program::System>,
}
#[derive(Accounts)]
pub struct ReleaseFunds<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    /// CHECK: This account is not read in this instruction, it's just used as the recipient for funds transfer
    #[account(mut)]
    pub freelancer: AccountInfo<'info>,
    pub token_program: Program<'info, anchor_lang::system_program::System>,
}

#[account]
pub struct Escrow {
    pub client: Pubkey,
    pub freelancer: Pubkey,
    pub amount: u64,
    pub is_completed: bool,
    pub client_agreed: bool,
    pub freelancer_agreed: bool,
    pub owner: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid party specified")]
    InvalidParty,
    #[msg("Unauthorized action")]
    Unauthorized,
    #[msg("Invalid recipient")]
    InvalidRecipient,
    #[msg("Escrow not completed")]
    EscrowNotCompleted,
}
