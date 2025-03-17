"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAccount, usePublicClient } from "wagmi";
import { z } from "zod";

// lib
import { cn } from "@/lib/utils";

// ui
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// vault
import { useVaultTokenApprove } from "@/features/vault/hooks/use-vault-token-approve";

// teller
import { useTellerAllowingCbBtc } from "@/features/teller/hooks/use-teller-allowing-cbbtc";
import { useTellerAllowingEbtc } from "@/features/teller/hooks/use-teller-allowing-ebtc";
import { useTellerAllowingLbtc } from "@/features/teller/hooks/use-teller-allowing-lbtc";
import { useTellerAllowingWbtc } from "@/features/teller/hooks/use-teller-allowing-wbtc";
import { useTellerDepositFunction } from "@/features/teller/hooks/use-teller-deposit";

// tokens
import { BTC_DERIVATED_TOKENS } from "@/features/tokens/constants/tokens";
import { useCbBtcBalance } from "@/features/tokens/hooks/cbbtc/use-cbbtc-balance";
import { useEbtcBalance } from "@/features/tokens/hooks/ebtc/use-ebtc-balance";
import { useLbtcBalance } from "@/features/tokens/hooks/lbtc/use-lbtc-balance";
import { useWbtcBalance } from "@/features/tokens/hooks/wbtc/use-wbtc-balance";

import { useWbtcPrice } from "@/features/tokens/hooks/wbtc/use-wbtc-price";
import { useLbtcPrice } from "@/features/tokens/hooks/lbtc/use-lbtc-price";
import { useCbBtcPrice } from "@/features/tokens/hooks/cbbtc/use-cbbtc-price";

// schemas
const formSchema = z.object({
  amount: z.string().min(0, {
    message: "Amount must be greater than 0.",
  }),
  token: z.string().min(1, {
    message: "Token is required.",
  }),
});

// types
type Props = {
  refetchUserBalance: () => void;
};

export function DepositForm({ refetchUserBalance }: Props) {
  // react hooks
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // wagmi hooks
  const publicClient = usePublicClient();
  const { address: walletAddress, isConnected: isWalletConnected } = useAccount();

  // rainbowkit hooks
  const { openConnectModal } = useConnectModal();

  // form hooks
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      token: Object.values(BTC_DERIVATED_TOKENS)[0].address,
    },
  });

  // token hooks
  const writeContractVaultTokenApproveFunction = useVaultTokenApprove();

  const {
    data: wbtcBalance,
    isLoading: isWbtcBalanceLoading,
    refetch: refetchWbtcBalance,
  } = useWbtcBalance(walletAddress);
  const {
    data: lbtcBalance,
    isLoading: isLbtcBalanceLoading,
    refetch: refetchLbtcBalance,
  } = useLbtcBalance(walletAddress);
  const {
    data: ebtcBalance,
    isLoading: isEbtcBalanceLoading,
    refetch: refetchEbtcBalance,
  } = useEbtcBalance(walletAddress);
  const {
    data: cbtcBalance,
    isLoading: isCbtcBalanceLoading,
    refetch: refetchCbtcBalance,
  } = useCbBtcBalance(walletAddress);

  const { data: wbtcPrice } = useWbtcPrice();
  const { data: lbtcPrice } = useLbtcPrice();
  const { data: cbtcPrice } = useCbBtcPrice();

  // teller hooks
  const writeContractTellerDepositFunction = useTellerDepositFunction();
  const { data: tellerAllowingWbtc, isLoading: isTellerAllowingWbtcLoading } = useTellerAllowingWbtc();
  const { data: tellerAllowingLbtc, isLoading: isTellerAllowingLbtcLoading } = useTellerAllowingLbtc();
  const { data: tellerAllowingCbBtc, isLoading: isTellerAllowingCbBtcLoading } = useTellerAllowingCbBtc();
  const { data: tellerAllowingEbtc, isLoading: isTellerAllowingEbtcLoading } = useTellerAllowingEbtc();

  // constants
  const tokenDerivedPrices = {
    [BTC_DERIVATED_TOKENS.WBTC.address]: wbtcPrice,
    [BTC_DERIVATED_TOKENS.LBTC.address]: lbtcPrice,
    [BTC_DERIVATED_TOKENS.CBBTC.address]: cbtcPrice,
  };

  const tokenDerivedLabels = {
    [BTC_DERIVATED_TOKENS.WBTC.address]: BTC_DERIVATED_TOKENS.WBTC.label,
    [BTC_DERIVATED_TOKENS.LBTC.address]: BTC_DERIVATED_TOKENS.LBTC.label,
    [BTC_DERIVATED_TOKENS.CBBTC.address]: BTC_DERIVATED_TOKENS.CBBTC.label,
    [BTC_DERIVATED_TOKENS.EBTC.address]: BTC_DERIVATED_TOKENS.EBTC.label,
  };

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

  const tokenDerivedDecimals = {
    [BTC_DERIVATED_TOKENS.WBTC.address]: BTC_DERIVATED_TOKENS.WBTC.decimals,
    [BTC_DERIVATED_TOKENS.LBTC.address]: BTC_DERIVATED_TOKENS.LBTC.decimals,
    [BTC_DERIVATED_TOKENS.CBBTC.address]: BTC_DERIVATED_TOKENS.CBBTC.decimals,
    [BTC_DERIVATED_TOKENS.EBTC.address]: BTC_DERIVATED_TOKENS.EBTC.decimals,
  };

  const tokenAddressValue = form.watch("token");
  const amountValue = form.watch("amount");

  const isAmountBiggerThanWalletTokenBalance =
    Number(amountValue) > Number(tokenDerivedBalances[tokenAddressValue as `0x${string}`]?.formatted);

  const tokenDerivedPrice = tokenDerivedPrices[tokenAddressValue as `0x${string}`];
  const tokenDerivedLabel = tokenDerivedLabels[tokenAddressValue as `0x${string}`];

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
  function handleToggleDialog(): void {
    setIsDialogOpen((previousIsDialogOpen) => !previousIsDialogOpen);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 0. Close dialog
      handleToggleDialog();

      // 1. Check if user wallet is connected
      if (!isWalletConnected && openConnectModal) {
        openConnectModal();
        return;
      }

      // 2. Check if public client is connected
      if (!publicClient) {
        return toast.error("Public client is not connected");
      }

      // 3. Check if the amount is valid
      const { amount, token } = values;

      const tokenDerivedBalance = tokenDerivedBalances[token as `0x${string}`];
      const tokenDerivedDecimal = tokenDerivedDecimals[token as `0x${string}`];

      if (Number(amount) <= 0) {
        return toast.error("Amount should be greater than 0");
      }

      if (Number(amount) > Number(tokenDerivedBalance?.formatted)) {
        return toast.error("Amount is bigger than the token balance");
      }

      // 4. Check if the teller is allowing the deposit of the selected token
      if (token === BTC_DERIVATED_TOKENS.WBTC.address && !tokenDerivedAllowDeposit[BTC_DERIVATED_TOKENS.WBTC.address]) {
        return toast.error("Vault is not allowing wBTC deposits");
      }

      if (token === BTC_DERIVATED_TOKENS.LBTC.address && !tokenDerivedAllowDeposit[BTC_DERIVATED_TOKENS.LBTC.address]) {
        return toast.error("Vault is not allowing lBTC deposits");
      }

      if (
        token === BTC_DERIVATED_TOKENS.CBBTC.address &&
        !tokenDerivedAllowDeposit[BTC_DERIVATED_TOKENS.CBBTC.address]
      ) {
        return toast.error("Vault is not allowing cbBTC deposits");
      }

      if (token === BTC_DERIVATED_TOKENS.EBTC.address && !tokenDerivedAllowDeposit[BTC_DERIVATED_TOKENS.EBTC.address]) {
        return toast.error("Vault is not allowing eBTC deposits");
      }

      // 5. Approve the vault to spend the token
      const approvalHash = await writeContractVaultTokenApproveFunction({
        amount: amountValue,
        decimals: tokenDerivedDecimal,
        address: tokenAddressValue as `0x${string}`,
      });

      // 6. Wait for approval hash to be confirmed
      const approvalHashPromise = publicClient.waitForTransactionReceipt({
        hash: approvalHash,
      });

      toast.promise(approvalHashPromise, {
        loading: "Approving token access...",
        success: "Token access approved successfully",
        error: "Failed to approve token access",
        descriptionClassName: "text-neutral-950",
      });

      await approvalHashPromise;

      // 7. Deposit the token
      const depositHash = await writeContractTellerDepositFunction({
        amount: amountValue,
        decimals: tokenDerivedDecimal,
        address: tokenAddressValue as `0x${string}`,
      });

      // 8. Wait for deposit hash to be confirmed
      const depositHashPromise = publicClient.waitForTransactionReceipt({
        hash: depositHash,
      });

      toast.promise(depositHashPromise, {
        loading: "Depositing tokens to vault...",
        success: "Tokens successfully deposited to vault",
        error: "Failed to deposit tokens to vault",
        descriptionClassName: "text-neutral-950",
      });

      await depositHashPromise;

      // 9. Refetch BTC derived token balances
      if (token === BTC_DERIVATED_TOKENS.WBTC.address) {
        refetchWbtcBalance();
      }

      if (token === BTC_DERIVATED_TOKENS.LBTC.address) {
        refetchLbtcBalance();
      }

      if (token === BTC_DERIVATED_TOKENS.CBBTC.address) {
        refetchCbtcBalance();
      }

      if (token === BTC_DERIVATED_TOKENS.EBTC.address) {
        refetchEbtcBalance();
      }

      // 10. Refetch user balance
      refetchUserBalance();

      // 11. Reset form
      form.reset();
    } catch (error) {
      console.log("\n ~ onSubmit ~ error:", error);

      toast.error("Error", {
        description: "An error occurred while depositing the token",
      });
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
                      placeholder="0"
                      type="string"
                      onChange={(event) => {
                        const { value } = event.target;

                        field.onChange(value);
                      }}
                      className={cn("text-neutral-50", isAmountBiggerThanWalletTokenBalance && "text-red-400")}
                    />
                  </FormControl>
                  <FormDescription>Enter the amount of tokens you want to deposit.</FormDescription>
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
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(BTC_DERIVATED_TOKENS).map((token) => (
                        <SelectItem key={token.address} value={token.address}>
                          {token.label}{" "}
                          {tokenDerivedBalances[token.address as `0x${string}`] ? (
                            <span className="text-xs text-neutral-400">
                              ({tokenDerivedBalances[token.address as `0x${string}`]?.formatted})
                            </span>
                          ) : null}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the token you want to deposit.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            variant="secondary"
            type="button"
            onClick={handleToggleDialog}
            disabled={
              isLoadingData ||
              form.formState.isSubmitting ||
              Number(amountValue) <= 0 ||
              isAmountBiggerThanWalletTokenBalance
            }
          >
            {isLoadingData ? "Loading..." : null}
            {form.formState.isSubmitting ? (
              <div className="flex flex-row items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : null}
            {!isLoadingData && !form.formState.isSubmitting ? "Submit" : null}
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={handleToggleDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deposit</DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-2">
                    <p>
                      You are depositing{" "}
                      <span className="font-medium">
                        {amountValue} {tokenDerivedLabel}{" "}
                        {tokenDerivedPrice ? `(~ $${Number(amountValue) * tokenDerivedPrice?.price_usd})` : null}
                      </span>{" "}
                      to the vault. Please confirm to continue.
                    </p>
                    <p>This action cannot be undone. This will permanently deposit the selected token to the vault.</p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="secondary" onClick={handleToggleDialog}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  type="submit"
                  onClick={() => {
                    form.handleSubmit(onSubmit)();
                  }}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
}
