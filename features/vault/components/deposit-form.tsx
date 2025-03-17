"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAccount } from "wagmi";

// lib
import { cn } from "@/lib/utils";

// ui
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// tokens
import { BTC_DERIVATED_TOKENS } from "@/features/tokens/constants/tokens";
import { useCbBtcBalance } from "@/features/tokens/hooks/cbbtc/use-cbbtc-balance";
import { useLbtcBalance } from "@/features/tokens/hooks/lbtc/use-lbtc-balance";
import { useWbtcBalance } from "@/features/tokens/hooks/wbtc/use-wbtc-balance";
import { useEbtcBalance } from "@/features/tokens/hooks/ebtc/use-ebtc-balance";

// teller
import { useTellerAllowingWbtc } from "@/features/teller/hooks/use-teller-allowing-wbtc";
import { useTellerAllowingLbtc } from "@/features/teller/hooks/use-teller-allowing-lbtc";
import { useTellerAllowingCbBtc } from "@/features/teller/hooks/use-teller-allowing-cbbtc";
import { useTellerAllowingEbtc } from "@/features/teller/hooks/use-teller-allowing-ebtc";

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

// schemas
const formSchema = z.object({
	amount: z.string().min(0, {
		message: "Amount must be greater than 0.",
	}),
	token: z.string().min(1, {
		message: "Token is required.",
	}),
});

// constants
const WBTC_DEMO_ADDRESS_FOR_TESTING =
	"0x2078f336Fdd260f708BEc4a20c82b063274E1b23";

export function DepositForm() {
	// wallet hooks
	const { address } = useAccount();

	// form hooks
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			amount: "",
			token: Object.values(BTC_DERIVATED_TOKENS)[0].address,
		},
	});

	// token hooks - TODO: Remember to replace the DEMO_ADDRESS_FOR_TESTING with the user's address
	const { data: wbtcBalance, isLoading: isWbtcBalanceLoading } = useWbtcBalance(
		WBTC_DEMO_ADDRESS_FOR_TESTING,
	);
	const { data: lbtcBalance, isLoading: isLbtcBalanceLoading } =
		useLbtcBalance(address);
	const { data: ebtcBalance, isLoading: isEbtcBalanceLoading } =
		useEbtcBalance(address);
	const { data: cbtcBalance, isLoading: isCbtcBalanceLoading } =
		useCbBtcBalance(address);

	// teller hooks
	const { data: tellerAllowingWbtc, isLoading: isTellerAllowingWbtcLoading } =
		useTellerAllowingWbtc();
	const { data: tellerAllowingLbtc, isLoading: isTellerAllowingLbtcLoading } =
		useTellerAllowingLbtc();
	const { data: tellerAllowingCbBtc, isLoading: isTellerAllowingCbBtcLoading } =
		useTellerAllowingCbBtc();
	const { data: tellerAllowingEbtc, isLoading: isTellerAllowingEbtcLoading } =
		useTellerAllowingEbtc();

	// constants
	const tokenDerivedBalances = {
		[BTC_DERIVATED_TOKENS.WBTC.address]: wbtcBalance,
		[BTC_DERIVATED_TOKENS.LBTC.address]: lbtcBalance,
		[BTC_DERIVATED_TOKENS.CBBTC.address]: cbtcBalance,
		[BTC_DERIVATED_TOKENS.EBTC.address]: ebtcBalance,
	};

	const tokenDerivedAllowDeposit = {
		[BTC_DERIVATED_TOKENS.WBTC.address]: tellerAllowingWbtc?.[0] === true,
		[BTC_DERIVATED_TOKENS.LBTC.address]: tellerAllowingLbtc?.[0] === true,
		[BTC_DERIVATED_TOKENS.CBBTC.address]: tellerAllowingCbBtc?.[0] === true,
		[BTC_DERIVATED_TOKENS.EBTC.address]: tellerAllowingEbtc?.[0] === true,
	};

	const tokenValue = form.watch("token");
	const amountValue = form.watch("amount");

	const isAmountBiggerThanWalletTokenBalance =
		Number(amountValue) >
		Number(tokenDerivedBalances[tokenValue as `0x${string}`]?.formatted);

	const isLoadingData =
		isWbtcBalanceLoading ||
		isLbtcBalanceLoading ||
		isEbtcBalanceLoading ||
		isCbtcBalanceLoading ||
		isTellerAllowingWbtcLoading ||
		isTellerAllowingLbtcLoading ||
		isTellerAllowingCbBtcLoading ||
		isTellerAllowingEbtcLoading;

	// handlers
	function onSubmit(values: z.infer<typeof formSchema>) {
		// 1. Check if the amount is valid
		const { amount, token } = values;
		const tokenDerivedBalance = tokenDerivedBalances[token as `0x${string}`];

		if (Number(amount) <= 0) {
			return toast.error("Amount should be greater than 0");
		}

		if (Number(amount) > Number(tokenDerivedBalance?.formatted)) {
			return toast.error("Amount is bigger than the token balance");
		}

		// 2. Check if the teller is allowing the deposit of the selected token
		if (
			token === BTC_DERIVATED_TOKENS.WBTC.address &&
			!tokenDerivedAllowDeposit[BTC_DERIVATED_TOKENS.WBTC.address]
		) {
			return toast.error("Vault is not allowing wBTC deposits");
		}

		if (
			token === BTC_DERIVATED_TOKENS.LBTC.address &&
			!tokenDerivedAllowDeposit[BTC_DERIVATED_TOKENS.LBTC.address]
		) {
			return toast.error("Vault is not allowing lBTC deposits");
		}

		if (
			token === BTC_DERIVATED_TOKENS.CBBTC.address &&
			!tokenDerivedAllowDeposit[BTC_DERIVATED_TOKENS.CBBTC.address]
		) {
			return toast.error("Vault is not allowing cbBTC deposits");
		}

		if (
			token === BTC_DERIVATED_TOKENS.EBTC.address &&
			!tokenDerivedAllowDeposit[BTC_DERIVATED_TOKENS.EBTC.address]
		) {
			return toast.error("Vault is not allowing eBTC deposits");
		}
	}

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div className="flex flex-row gap-3">
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-neutral-50">Amount</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={field.value === "0" ? "" : field.value}
											placeholder="0"
											type="string"
											onChange={(event) => {
												const { value } = event.target;

												if (Number.isNaN(Number(value))) {
													return;
												}

												field.onChange(value);
											}}
											className={cn(
												"text-neutral-50",
												isAmountBiggerThanWalletTokenBalance && "text-red-400",
											)}
										/>
									</FormControl>
									<FormDescription>
										Enter the amount of tokens you want to deposit.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="token"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-neutral-50">Token</FormLabel>
									<Select
										defaultValue={field.value}
										onValueChange={field.onChange}
									>
										<FormControl>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select a token" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.values(BTC_DERIVATED_TOKENS).map((token) => (
												<SelectItem key={token.address} value={token.address}>
													{token.label}{" "}
													{tokenDerivedBalances[
														token.address as `0x${string}`
													] ? (
														<span className="text-xs text-neutral-400">
															(
															{
																tokenDerivedBalances[
																	token.address as `0x${string}`
																]?.formatted
															}
															)
														</span>
													) : null}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										Select the token you want to deposit.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button type="submit" variant="secondary" disabled={isLoadingData}>
						{isLoadingData ? "Loading..." : "Submit"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
