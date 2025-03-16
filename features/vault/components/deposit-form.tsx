"use client";

/*
Last requirement:

* Deposit LBTC, wBTC, cbBTC, or eBTC


What do we need for this:
1. An input that user can select the amount of LBTC, wBTC, cbBTC, or eBTC they want to deposit
2. A select that allows them to select the token they want to deposit (with each token showing the balance they have in their wallet)
3. A button to confirm the deposit

4. Trigger a write call (transaction) to the vault contract to the approve fn
5. Send the spender (wallet address) and the about of tokens (Are those in satoshis?)

6. Trigger a write call (transaction) to the teller contract to the deposit fn
7. Send the payableAmount (amount in ether that is going to be deposited), depositAsset (the address of the token that is going to be deposited), depositAmount (amount in satoshis that is going to be deposited)

*/
export function DepositForm() {
	return <div>DepositForm</div>;
}
