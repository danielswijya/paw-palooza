import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const Stepper = ({ steps, currentStep, className }: StepperProps) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'border-primary text-primary',
                    !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-xs sm:text-sm font-medium transition-colors duration-300',
                      (isCurrent || isCompleted) && 'text-foreground',
                      !isCompleted && !isCurrent && 'text-muted-foreground'
                    )}
                  >
                    {step}
                  </p>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 sm:mx-4">
                  <div
                    className={cn(
                      'h-full transition-all duration-300',
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
