import { useState } from 'react';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function ShareAppLinkDialog() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  // Generate the shareable URL from current location
  const shareUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 transition-smooth-fast hover:bg-primary/10 hover:text-primary"
          aria-label="Share app link"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this app</DialogTitle>
          <DialogDescription>
            Anyone with this link can access the app
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-url">App URL</Label>
            <div className="flex items-center gap-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleCopy}
                className="shrink-0 transition-smooth-fast"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {copied ? 'Copied' : 'Copy link'}
                </span>
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-success animate-fade-in">
                Link copied to clipboard!
              </p>
            )}
          </div>
          <div className="pt-2">
            <a
              href={shareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline transition-smooth-fast"
            >
              <ExternalLink className="h-4 w-4" />
              Open in new tab
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
