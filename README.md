
# Get Started

1. Install Bun (If you haven't yet)
```bash
curl -fsSL https://bun.sh/install | bash
```

2. Install project dependencies
```bash
bun install
```

3. Run project in development-mode
```bash
bun run dev
```

# Requeriments
- [x] See the overall TVL of the vault in USD
- [ ] View the current APY of the vault
- [ ] Connect their (ethereum) wallet
- [ ] View their current balance in the vault in USD
- [ ] Deposit LBTC, wBTC, cbBTC, or eBTC

# Follow-up
- [ ] Great UI/UX
- [ ] Any other quality of life improvement

# Stack
- Next.js (with TypeScript)
- Shadcn/ui (with Tailwind)
- WAGMI (with Viem)

# Notes

- For the TVL feature I have a final result of $37.3M but Ether.fi has a value of $38.4M, so I'm a bit worried where that difference is coming from, since I would like that the TVL is as accurate as possible that's why I'm reading the `totalSupply` directly from chain.

---

# Take Home Assignment
The goal of this assignment is to implement a simple landing page for one of our vaults, Liquid BTC. An example front end can be found on EtherFi’s website at https://app.ether.fi/liquid/btc

# Goals
Everyone should be able to:
* See the overall TVL of the vault in USD
* View the current APY of the vault

A user should be able to:
* Connect their (ethereum) wallet
* View their current balance in the vault in USD
* Deposit LBTC, wBTC, cbBTC, or eBTC

Feel free to add QOL items and more features as you wish for a great UX. Your focus should be on correctly implementing the above requirements, and having a solid UI that feels good to use while maintaining best coding practices.

# Frameworks
Please use NextJs and TypeScript. Outside of that feel free to use anything you’d like.

# Details
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
