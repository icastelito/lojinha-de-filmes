import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

/**
 * Hook customizado para implementar Infinite Scroll usando scroll event
 * @param options - Opções de configuração do infinite scroll
 * @returns ref - Referência para o elemento sentinela (último elemento da lista)
 */
export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  threshold = 300, // pixels do fim da página
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false); // Referência para prevenir múltiplas chamadas

  const handleScroll = useCallback(() => {
    // Verifica se está carregando ou se não tem mais items
    if (loading || !hasMore || isLoadingRef.current) {
      return;
    }

    // Pega as dimensões da página
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    // Calcula a distância até o fim
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

    // Se está próximo do fim, carrega mais
    if (distanceToBottom < threshold) {
      isLoadingRef.current = true; // Marca como carregando
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore, threshold]);

  // Reseta a flag quando o loading mudar
  useEffect(() => {
    if (!loading) {
      isLoadingRef.current = false;
    }
  }, [loading]);

  useEffect(() => {
    // Debounce do scroll para evitar muitas chamadas
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100); // 100ms de debounce
    };
    
    // Adiciona o listener de scroll
    window.addEventListener('scroll', debouncedScroll, { passive: true });

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', debouncedScroll);
    };
  }, [handleScroll]);

  return sentinelRef;
}
