// script.js

import * as web3 from "@solana/web3.js";

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
const programId = new web3.PublicKey("9FASRUQYKJeGKMDxKDjPj81Xu6dw3q1LG7XFEtKSiVMq");

const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", async () => {
    const accountKey = document.getElementById("account-key").value;
    const accountName = document.getElementById("account-name").value;
    const note = document.getElementById("note").value;

    const programKeypair = web3.Keypair.generate(); // Keypair for the program
    const userAccount = web3.Keypair.generate(); // User's account keypair

    // Prepare and send transaction
    const transaction = new web3.Transaction().add(
        web3.SystemProgram.createAccount({
            fromPubkey: programKeypair.publicKey,
            newAccountPubkey: userAccount.publicKey,
            lamports: await connection.getMinimumBalanceForRentExemption(0),
            space: 0,
            programId,
        }),
        new web3.TransactionInstruction({
            keys: [
                { pubkey: userAccount.publicKey, isSigner: true, isWritable: true },
            ],
            programId,
            data: Buffer.from([0, ...Buffer.from(note), ...Buffer.from(accountKey), ...Buffer.from(accountName)]),
        })
    );

    const txSignature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [programKeypair, userAccount],
        { commitment: "confirmed" }
    );

    console.log("Transaction successful:", txSignature);
});
