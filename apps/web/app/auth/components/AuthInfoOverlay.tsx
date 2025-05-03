import { BarChart2, CircleDollarSign, Shield } from 'lucide-react';

export function AuthInfoOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-start justify-center rounded-3xl bg-black/40 p-12 text-white">
      <h2 className="mb-6 text-2xl font-bold">
        AI-Powered Tax Loss Harvesting
      </h2>
      <p className="mb-8 max-w-md">
        Maximize tax efficiency with our automated platform that identifies
        optimal tax harvesting opportunities in your investment portfolio.
      </p>

      <div className="max-w-md space-y-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary p-2">
            <BarChart2 className="size-5 text-black" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold">Smart Portfolio Analysis</h3>
            <p className="text-sm text-white/80">
              Our AI algorithm analyzes your holdings to find the optimal tax
              lots to sell.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary p-2">
            <Shield className="size-5 text-black" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold">Wash Sale Protection</h3>
            <p className="text-sm text-white/80">
              Avoid IRS restrictions with built-in wash sale detection and
              alerts.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary p-2">
            <CircleDollarSign className="size-5 text-black" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold">Tax-Optimized Suggestions</h3>
            <p className="text-sm text-white/80">
              Get replacement security suggestions to maintain portfolio
              balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
