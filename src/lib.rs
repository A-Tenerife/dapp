use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey,
};

entrypoint!(process_instruction);
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Match the first byte of the instruction_data to determine the action
    match instruction_data.get(0) {
        Some(0) => submit_note(program_id, accounts, &instruction_data[1..]),
        _ => Err(solana_program::program_error::ProgramError::InvalidInstructionData),
    }
}

fn submit_note(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    // Accounts: [0] - Caller's account
    //          [1] - Storage account (where data will be stored)

    // Ensure correct number of accounts
    if accounts.len() != 2 {
        return Err(solana_program::program_error::ProgramError::InvalidArgument);
    }

    // Get the storage account
    let storage_account = &accounts[1];

    // Write data to storage account
    storage_account.data.borrow_mut().copy_from_slice(data);

    Ok(())
}
