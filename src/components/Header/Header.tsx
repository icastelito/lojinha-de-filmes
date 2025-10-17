import { ShoppingCart, Film, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onCartClick: () => void;
  onFavoritesClick: () => void;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
}

function Header({ onCartClick, onFavoritesClick, onSearch, onClearSearch }: HeaderProps) {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { favorites } = useFavorites();
  const cartCount = getCartCount();
  const favoritesCount = favorites.length;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        onSearch(searchQuery);
      } else {
        onClearSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch, onClearSearch]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 md:py-4">
        {/* Mobile Layout: Logo + Buttons (top row) | Search (bottom row) */}
        {/* Desktop Layout: Logo (left) | Search (center) | Buttons (right) */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          {/* Top Row Mobile: Logo + Buttons | Desktop: Just Logo */}
          <div className="flex items-center justify-between gap-2 md:justify-start">
            {/* Logo */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Film className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
                Lojinha de Filmes
              </h1>
            </button>

            {/* Action Buttons - Visible on mobile, hidden on desktop */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Favorites Button */}
              <Button
                onClick={onFavoritesClick}
                variant="outline"
                size="icon"
                className="relative h-9 w-9"
              >
                <Heart className="h-4 w-4" />
                {favoritesCount > 0 && (
                  <Badge 
                    variant="default" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary"
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Button>

              {/* Cart Button */}
              <Button
                onClick={onCartClick}
                variant="outline"
                size="icon"
                className="relative h-9 w-9"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar - Full width on mobile, centered on desktop */}
          <div className="w-full md:flex-1 md:max-w-md md:mx-auto">
            <Input
              type="search"
              placeholder="Buscar filmes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Action Buttons - Hidden on mobile, visible on desktop (right side) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Favorites Button */}
            <Button
              onClick={onFavoritesClick}
              variant="outline"
              size="icon"
              className="relative h-10 w-10"
            >
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary"
                >
                  {favoritesCount}
                </Badge>
              )}
            </Button>

            {/* Cart Button */}
            <Button
              onClick={onCartClick}
              variant="outline"
              size="icon"
              className="relative h-10 w-10"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
