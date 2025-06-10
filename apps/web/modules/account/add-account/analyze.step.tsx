import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  CheckCircle,
  Loader2,
  Search,
  Upload,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const ANIMATION_STEPS = [
  { id: 'upload', label: 'Processing CSV File', icon: Upload, duration: 500 },
  { id: 'parse', label: 'Analyzing Holdings', icon: Search, duration: 700 },
  {
    id: 'calculate',
    label: 'Calculating Tax Opportunities',
    icon: BarChart3,
    duration: 1500,
  },
  {
    id: 'complete',
    label: 'Preparing Account Savings',
    icon: Zap,
    duration: 500,
  },
];

export function AnalyzeStep() {
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(Date.now());

  // Calculate the cumulative duration at each step
  const stepTimings = useMemo(() => {
    let totalDuration = 0;
    return ANIMATION_STEPS.map(step => {
      totalDuration += step.duration;
      return totalDuration;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;

      // Find the current step based on cumulative durations
      const currentStepIndex = stepTimings.findIndex(
        timing => elapsedTime < timing
      );
      setCurrentStep(
        currentStepIndex === -1 ? ANIMATION_STEPS.length - 1 : currentStepIndex
      );
    }, 100); // Update frequently for smooth transitions

    return () => clearInterval(interval);
  }, [startTime, stepTimings]);

  return (
    <div className="p-8">
      {/* Animation Steps */}
      <div className="space-y-4">
        {ANIMATION_STEPS.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;
          const isPending = index > currentStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isActive ? 1.05 : 1,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className={`flex items-center gap-4 rounded-lg border p-4 ${
                isActive
                  ? 'border-blue-600'
                  : isCompleted
                    ? 'border-green-600'
                    : isPending
                      ? 'border-muted'
                      : 'border-muted'
              } `}
            >
              {/* Icon with Animation */}
              <motion.div
                className={`relative rounded-full p-3 ${
                  isActive
                    ? 'bg-blue-600/20'
                    : isCompleted
                      ? 'bg-green-600/20'
                      : 'bg-muted'
                } `}
                animate={
                  isActive
                    ? {
                        scale: [1, 1.1, 1],
                      }
                    : {
                        scale: 1,
                      }
                }
                transition={{
                  repeat: isActive ? Infinity : 0,
                  duration: 2,
                }}
              >
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div
                      key="loading"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: 'linear',
                      }}
                    >
                      <Loader2 className="size-6 text-blue-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icon"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <step.icon
                        className={`size-6 ${
                          isCompleted
                            ? 'text-green-500'
                            : isPending
                              ? 'text-gray-500'
                              : 'text-blue-500'
                        } `}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Step Content */}
              <div className="flex-1">
                <motion.h3
                  animate={{
                    color: isActive
                      ? '#60A5FA' // text-blue-400
                      : isCompleted
                        ? '#4ADE80' // text-green-400
                        : '#D1D5DB', // text-gray-300
                  }}
                  className="font-semibold"
                >
                  {step.label}
                </motion.h3>
              </div>

              {/* Loading Indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <div className="flex space-x-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="size-2 rounded-full bg-blue-500"
                          animate={{
                            y: ['0%', '-50%', '0%'],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Completion Check */}
              <AnimatePresence>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-green-500"
                  >
                    <CheckCircle className="size-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
