use anchor_lang::prelude::*;

declare_id!("GnrHaj1hB4BqKbiWiCWKA6BwkUaF2zmywsaLcGAtTtbj");

#[program]
pub mod d_fiverr {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, client: Pubkey, freelancer: Pubkey, amount: u64) -> Result<()> {
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
            ctx.accounts.system_program.to_account_info(),
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
        let escrow = &mut ctx.accounts.escrow;
    
        // Ensure only the contract owner can resolve disputes
        require!(ctx.accounts.owner.key() == escrow.owner, ErrorCode::Unauthorized);
    
        // Ensure the recipient is either the client or the freelancer
        require!(
            recipient == escrow.client || recipient == escrow.freelancer,
            ErrorCode::InvalidRecipient
        );
    
        // Transfer funds to the specified recipient
        let amount = escrow.amount;
    
        **escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.recipient.to_account_info().try_borrow_mut_lamports()? += amount;
    
        // Mark the escrow as completed
        escrow.is_completed = true;
    
        Ok(())
    }
    

    pub fn release_funds(ctx: Context<ReleaseFunds>) -> Result<()> {
        require!(ctx.accounts.escrow.is_completed, ErrorCode::EscrowNotCompleted);
    
        let amount = ctx.accounts.escrow.amount;
    
        **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.freelancer.to_account_info().try_borrow_mut_lamports()? += amount;
    
        Ok(())
    }
    
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = client, space = 8 + 32 + 32 + 8 + 1 + 1 + 1 + 32 + 64)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub client: Signer<'info>,
    /// CHECK: This is the owner of the program
    pub owner: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MarkCompleted<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(mut, has_one = owner)]
    pub escrow: Account<'info, Escrow>,
    pub owner: Signer<'info>,
    /// CHECK: This account is not read or written in this instruction, it's just used as the recipient for funds transfer
    #[account(mut)]
    pub recipient: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleaseFunds<'info> {
    #[account(mut, has_one = freelancer)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub freelancer: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
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
