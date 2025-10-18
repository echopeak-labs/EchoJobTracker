import { Button } from '@/components/ui/button';

interface HeaderProps {
  // Header is now just displaying the title
}

export function Header() {
  return (
    <header className="h-16 border-b-2 border-border bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between neon-glow-purple">
      <h1 className="text-2xl font-black text-foreground neon-text-cyan tracking-wider uppercase">
        Job Tracker
      </h1>
    </header>
  );
}
