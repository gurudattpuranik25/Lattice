import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 24, className = '' }) {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <Loader2 size={size} className="animate-spin text-zinc-400" />
    </div>
  );
}
