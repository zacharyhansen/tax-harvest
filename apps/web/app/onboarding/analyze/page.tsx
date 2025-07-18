'use client';

import { Button } from '@repo/ui/components/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AnalyzeStep } from '~/modules/account/add-account/analyze.step';

export default function AnalyzePage() {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);

  const handleAnimationsComplete = () => {
    setIsComplete(true);
    // Auto-navigate after a short delay
    setTimeout(() => {
      router.push('/onboarding/complete');
    }, 500);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <h1 className="text-2xl font-semibold">Analyzing Account</h1>
          <p className="text-muted-foreground mt-1">
            Building the most optimal strategies for your account based on its current tax lots
          </p>
        </div>
        
        <AnalyzeStep onAnimationsComplete={handleAnimationsComplete} />
        
        <div className="flex justify-end gap-2 border-t p-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/onboarding/upload')}
          >
            Back
          </Button>
          <Button 
            onClick={() => router.push('/onboarding/complete')}
            disabled={!isComplete}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}