"use client";

import NumberFlow from "@number-flow/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

// lib
import { isDev } from "@/lib/is-dev";
import { cn } from "@/lib/utils";

// ui
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// vault
import { DepositForm } from "@/features/vault/components/deposit-form";
import { useVaultApy } from "@/features/vault/hooks/use-vault-apy";
import { useVaultTvl } from "@/features/vault/hooks/use-vault-tvl";
import { useVaultUserBalance } from "@/features/vault/hooks/use-vault-user-balance";

export default function Home() {
  // wagmi hooks
  const { address, isConnected } = useAccount();

  // vault hooks
  const { data: tvlData, error: errorTvl, isLoading: isLoadingTvl } = useVaultTvl();

  const { data: apyData, error: errorApy, isLoading: isLoadingApy } = useVaultApy();

  const {
    data: userBalance,
    error: errorUserBalance,
    refetch: refetchUserBalance,
    isLoading: isLoadingUserBalance,
  } = useVaultUserBalance(address);

  // helper
  function handleRefetchUserBalance() {
    refetchUserBalance();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <nav className="flex flex-row justify-between items-center flex-1 mb-3 h-[44px]">
        <h1 className="text-3xl font-bold text-neutral-50">Veda Labs - Boring Vault</h1>
        <ConnectButton label="Connect Wallet" accountStatus="address" chainStatus={isDev ? "full" : "none"} />
      </nav>

      <section className="flex flex-row gap-3 items-center h-[40px] text-neutral-50 text-2xl font-semibold mb-12">
        <article className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>TVL</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Total Value Locked</p>
            </TooltipContent>
          </Tooltip>

          {isLoadingTvl ? <Skeleton className="w-[90px] h-[30px] rounded-sm" /> : null}

          {errorTvl ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>Error</span>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Try again later</p>
              </TooltipContent>
            </Tooltip>
          ) : null}

          {!isLoadingTvl && !errorTvl ? (
            <NumberFlow
              willChange
              value={tvlData}
              format={{
                style: "currency",
                currency: "USD",
                notation: "compact",
                compactDisplay: "short",
                maximumFractionDigits: 1,
              }}
              className="w-[90px] h-full"
            />
          ) : null}
        </article>
        <span className="text-neutral-50">·</span>
        <article className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>APY</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Annual Percentage Yield</p>
            </TooltipContent>
          </Tooltip>

          {isLoadingApy ? <Skeleton className="w-[54px] h-[30px] rounded-sm" /> : null}

          {errorApy ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>Error</span>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Try again later</p>
              </TooltipContent>
            </Tooltip>
          ) : null}

          {!isLoadingApy && !errorApy ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <NumberFlow
                  willChange
                  value={apyData.totalApy}
                  format={{ style: "percent", maximumFractionDigits: 1 }}
                  className="w-[54px] h-full"
                />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="flex flex-col gap-2">
                <div>
                  <p className="font-semibold text-sm">{apyData.breakdownApyPercentages.realApy}% Variable Yield Avg</p>
                  <p className="text-neutral-600 text-xs">Earned through vault shares</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {apyData.breakdownApyPercentages.maturityApy}% Fixed Yield Avg
                  </p>
                  <p className="text-neutral-600 text-xs">
                    Earned through vault shares at time of position maturity date
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          ) : null}
        </article>
      </section>

      <section
        className={cn(
          "flex flex-row gap-3 items-center h-[40px] text-neutral-50 text-2xl font-semibold mb-4 transition-opacity duration-300",
          isConnected ? "opacity-100" : "opacity-0",
        )}
      >
        <article className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>Your Balance:</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Amount of liquidBTC you own</p>
            </TooltipContent>
          </Tooltip>

          {isLoadingUserBalance ? (
            <div className="flex flex-row gap-2">
              <Skeleton className="w-[80px] h-[30px] rounded-sm" />
            </div>
          ) : null}

          {errorUserBalance ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>Error</span>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Try again later</p>
              </TooltipContent>
            </Tooltip>
          ) : null}

          {!isLoadingUserBalance && !errorUserBalance ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <NumberFlow willChange value={userBalance.fiat} format={{ style: "currency", currency: "USD" }} />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <NumberFlow willChange value={userBalance.btc} format={{ maximumFractionDigits: 8 }} prefix="₿" />
              </TooltipContent>
            </Tooltip>
          ) : null}
        </article>
      </section>

      <DepositForm refetchUserBalance={handleRefetchUserBalance} />
    </main>
  );
}
