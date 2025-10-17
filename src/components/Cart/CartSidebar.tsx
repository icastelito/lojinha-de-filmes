import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../services/api';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckout: () => void;
}

export const CartSidebar = ({ open, onOpenChange, onCheckout }: CartSidebarProps) => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const total = getCartTotal();
  const itemCount = getCartCount();

  const handleCheckout = () => {
    onCheckout();
    onOpenChange(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho de Compras
          </SheetTitle>
          <SheetDescription>
            {itemCount === 0 
              ? 'Seu carrinho está vazio' 
              : `${itemCount} ${itemCount === 1 ? 'item' : 'itens'} no carrinho`
            }
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              Seu carrinho está vazio.<br />
              Adicione alguns filmes!
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={item.movie.id} className="flex gap-4 group">
                  <div className="relative w-20 h-28 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <img
                      src={getImageUrl(item.movie.poster_path, 'w200')}
                      alt={item.movie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300?text=Sem+Imagem';
                      }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold line-clamp-2 text-sm">
                        {item.movie.title}
                      </h4>
                      <p className="text-sm text-primary font-bold mt-1">
                        R$ {item.movie.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.movie.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Badge variant="secondary" className="px-3">
                          {item.quantity}
                        </Badge>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.movie.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.movie.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-green-600">Grátis</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button 
                  onClick={handleCheckout} 
                  className="w-full" 
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Finalizar Compra
                </Button>
                <Button 
                  onClick={() => onOpenChange(false)} 
                  variant="outline" 
                  className="w-full"
                >
                  Continuar Comprando
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
