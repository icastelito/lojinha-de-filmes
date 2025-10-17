import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
}

function Loading({ text = 'Carregando filmes...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg text-muted-foreground">{text}</p>
    </div>
  );
}

export default Loading;
