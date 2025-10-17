import { CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  totalItems: number;
  totalValue: number;
}

export function SuccessModal({ 
  open, 
  onOpenChange, 
  orderNumber, 
  totalItems,
  totalValue 
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Pedido Realizado com Sucesso!
          </DialogTitle>
          <DialogDescription className="text-center">
            Seu pedido foi confirmado e está sendo processado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Número do Pedido:</span>
              <span className="font-semibold">#{orderNumber}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total de Itens:</span>
              <span className="font-semibold">{totalItems}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valor Total:</span>
              <span className="font-semibold text-lg text-primary">
                R$ {totalValue.toFixed(2)}
              </span>
            </div>
          </div>

          <Separator />

          <p className="text-sm text-center text-muted-foreground">
            Você receberá um email com os detalhes do seu pedido em breve.
          </p>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Voltar à Loja
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
