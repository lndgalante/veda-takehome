# Veda Labs - Task Home

## Play with it now!

[Vercel Deployment Link](https://veda-vault.vercel.app)

## Get Started

1. Create a `.env` file from `.env.template`
```bash
cp .env.template .env
```

2. Complete `.env` with values (ask for those)

You will only need:
- Reown Project ID (used in Rainbow Kit)
- Alchemy API key (For RPC and Price API use)

3. Install Bun (If you haven't yet)
```bash
curl -fsSL https://bun.sh/install | bash
```

4. Install project dependencies
```bash
bun install
```

5. Run project in development-mode
```bash
bun run dev
```

## Requeriments
- [x] See the overall TVL of the vault in USD
- [x] View the current APY of the vault
- [x] Connect their (ethereum) wallet
- [x] View their current balance in the vault in USD
- [x] Deposit LBTC, wBTC, cbBTC, or eBTC

## Follow-up
- [x] Great UI/UX
- [x] Any other quality of life improvement

## Stack
- Next.js (with TypeScript)
- Shadcn/ui (with Tailwind)
- WAGMI (with Viem)

## Notes

- Based on the time I had in hands, since I started on a Saturday, I follow a balanced approach where I wanted to output as much quality of code and UI/UX, and prioritizing the primary requirements.
- I'm using RainbowKit as a third-party wallet connect, on top of wagmi, since IMO is the best UI/UX for connecting wallet, and for a challenge seems a right fit in order to be time-wise. (And also is being used in Veda Labs Tech to maintain consistency).
- I'm showing the current connected chain, but only in `development mode`, and not in production, perfect to switch to Sepolia or any other testnet network to do tests in dev mode.
- I display the input amount in red if the value is bigger than the selected token (i.e. user inserts 18 in the input amount but their WBTC balance in 17.2, then the text will be shown in red)

## Questions for Veda team
- For the TVL feature I have a final result of `$36.6M` but Ether.fi has a value of `$37.7M`, so I'm a bit worried where that `~1M` difference is coming from, since I would like that the TVL is as accurate as possible, and that's why I'm reading the `totalSupply` directly from chain. Is Ether.fi addding something extra, or I'm miscalculating the TVL?
- I haven't used yet the `Accountant` and `Lens` contracts, should those be used in this challenge?


---

# Take Home Assignment
The goal of this assignment is to implement a simple landing page for one of our vaults, Liquid BTC. An example front end can be found on EtherFi’s website at https://app.ether.fi/liquid/btc

## Goals
Everyone should be able to:
* See the overall TVL of the vault in USD
* View the current APY of the vault

A user should be able to:
* Connect their (ethereum) wallet
* View their current balance in the vault in USD
* Deposit LBTC, wBTC, cbBTC, or eBTC

Feel free to add QOL items and more features as you wish for a great UX. Your focus should be on correctly implementing the above requirements, and having a solid UI that feels good to use while maintaining best coding practices.

## Frameworks
Please use NextJs and TypeScript. Outside of that feel free to use anything you’d like.

## Details
You will need the following addresses:

Vault: 0x5f46d540b6eD704C3c8789105F30E075AA900726
* A barebones contract that offloads functionalities to other contracts

Teller: 0x9E88C603307fdC33aA5F26E38b6f6aeF3eE92d48
* Allows users to mint vault shares. This is where deposits happen. To deposit, the Vault, must be approved to spend a users deposit tokens, after which the deposit function can be called.

Accountant: 0xEa23aC6D7D11f6b181d6B98174D334478ADAe6b0
* Used by the Teller to price shares. Contains the exchange rate for 1 vault share to the underlying token

Lens: 0x5232bc0F5999f8dA604c42E1748A13a170F94A1B
* Can provide additional metadata about a vault

High level performance: https://api.sevenseas.capital/etherfi/ethereum/performance/0x5f46d540b6eD704C3c8789105F30E075AA900726

Low level performance: https://api.sevenseas.capital/etherfi/ethereum/apy/0x5f46d540b6eD704C3c8789105F30E075AA900726
