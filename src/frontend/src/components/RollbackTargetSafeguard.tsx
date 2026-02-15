import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateRollbackTarget, storeConfirmedRollbackTarget, APP_VERSION } from '../lib/appVersion';

interface RollbackTargetSafeguardProps {
  /**
   * Whether the safeguard dialog should be shown.
   * Set to true when a rollback target is ambiguous.
   */
  isActive: boolean;
  /**
   * Callback invoked when the user successfully confirms a valid rollback target.
   */
  onConfirmed: (target: string) => void;
  /**
   * Callback invoked when the user cancels the rollback operation.
   */
  onCancel: () => void;
}

/**
 * Fail-closed rollback safeguard component.
 * Blocks rollback operations until the user provides and confirms an explicit target identifier.
 */
export function RollbackTargetSafeguard({ isActive, onConfirmed, onCancel }: RollbackTargetSafeguardProps) {
  const [targetInput, setTargetInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleValidate = () => {
    const trimmedInput = targetInput.trim();
    
    if (!trimmedInput) {
      setValidationError('Please enter a target version identifier.');
      setIsValidated(false);
      return;
    }

    if (!validateRollbackTarget(trimmedInput)) {
      setValidationError(
        'Invalid target version. Please enter "v37", "37", or "version 37" to confirm rollback to version 37.'
      );
      setIsValidated(false);
      return;
    }

    setValidationError(null);
    setIsValidated(true);
  };

  const handleConfirm = () => {
    if (!isValidated) {
      setValidationError('Please validate the target version first.');
      return;
    }

    storeConfirmedRollbackTarget(targetInput.trim());
    onConfirmed(targetInput.trim());
  };

  const handleCancel = () => {
    setTargetInput('');
    setValidationError(null);
    setIsValidated(false);
    onCancel();
  };

  return (
    <AlertDialog open={isActive} onOpenChange={(open) => !open && handleCancel()}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Rollback Target Confirmation Required
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-4">
            <p>
              The rollback target is ambiguous. To proceed safely, you must explicitly confirm the target version identifier.
            </p>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Current Version</AlertTitle>
              <AlertDescription>
                You are currently on <strong>{APP_VERSION.label}</strong> ({APP_VERSION.description})
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="rollback-target">
                Enter Target Version Identifier
              </Label>
              <div className="flex gap-2">
                <Input
                  id="rollback-target"
                  type="text"
                  placeholder='e.g., "v37" or "37"'
                  value={targetInput}
                  onChange={(e) => {
                    setTargetInput(e.target.value);
                    setIsValidated(false);
                    setValidationError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleValidate();
                    }
                  }}
                  className={validationError ? 'border-destructive' : isValidated ? 'border-success' : ''}
                />
                <button
                  onClick={handleValidate}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Validate
                </button>
              </div>
              {validationError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationError}
                </p>
              )}
              {isValidated && (
                <p className="text-sm text-success flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Target version validated successfully. You may proceed with the rollback.
                </p>
              )}
            </div>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Rolling back will restore the application to the specified version. Any changes made after that version may be lost.
                This operation cannot be undone automatically.
              </AlertDescription>
            </Alert>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Cancel Rollback
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isValidated}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Confirm Rollback
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
