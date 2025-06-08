import { PlaidConnectButton } from '~/modules/plaid'

export function OngoingStep() {
  return (
    <div className="">
      <PlaidConnectButton className="h-24 w-full border border-primary bg-background text-foreground" />

      {/* Brokerage Selection Grid */}
      {/* <div className="mb-8 grid grid-cols-3 gap-6">
        <div className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-colors hover:bg-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="flex size-8 items-center justify-center rounded bg-blue-600">
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <span className="font-medium">Etrade</span>
          </div>
        </div>
        <div className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-colors hover:bg-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="flex size-8 items-center justify-center rounded bg-green-500">
              <span className="text-sm font-bold text-white">R</span>
            </div>
            <span className="font-medium">Robinhood</span>
          </div>
        </div>
        <div className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-colors hover:bg-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="flex size-8 items-center justify-center rounded bg-blue-500">
              <span className="text-sm font-bold text-white">CS</span>
            </div>
            <span className="font-medium">Charles Schwab</span>
          </div>
        </div>
        <div className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-colors hover:bg-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="flex size-8 items-center justify-center rounded bg-yellow-600">
              <span className="text-sm font-bold text-white">W</span>
            </div>
            <span className="font-medium">WeBull</span>
          </div>
        </div>
        <div className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-colors hover:bg-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="flex size-8 items-center justify-center rounded bg-red-600">
              <span className="text-sm font-bold text-white">IB</span>
            </div>
            <span className="font-medium">Interactive Brokers</span>
          </div>
        </div>
        <div className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-colors hover:bg-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="flex size-8 items-center justify-center rounded bg-green-600">
              <span className="text-sm font-bold text-white">F</span>
            </div>
            <span className="font-medium">Fidelity</span>
          </div>
        </div>
      </div> */}
    </div>
  )
}
