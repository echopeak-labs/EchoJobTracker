import { Button } from '@/components/ui/button';

interface HeaderProps {
  // Header is now just displaying the title
}

export function Header() {
  return (
    <header className="h-16 border-b border-border glass px-6 flex items-center justify-between shadow-soft">
      <h1 className="text-xl font-semibold text-foreground">
        Job Tracker
      </h1>
    </header>
  );
}
