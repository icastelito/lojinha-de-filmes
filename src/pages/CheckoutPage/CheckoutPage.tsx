import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SuccessModal } from '@/components/SuccessModal/SuccessModal';
import Header from '@/components/Header/Header';
import { buscarCEP } from '@/services/viaCep';
import { getImageUrl } from '@/services/api';
import { maskCPF, maskCEP, maskPhone, maskEmail } from '@/utils/masks';
import { validateEmail, validateCPF, validateCEP, validatePhone, validateFullName } from '@/utils/validators';

interface FormData {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface FormErrors {
  [key: string]: string;
}

interface CheckoutPageProps {
  onCartClick: () => void;
  onFavoritesClick: () => void;
}

export function CheckoutPage({ onCartClick, onFavoritesClick }: CheckoutPageProps) {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    cpf: '',
    phone: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Cálculo do total
  const total = items.reduce((sum, item) => sum + item.movie.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Manipulador de mudança de input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;

    // Aplicar máscaras
    switch (name) {
      case 'cpf':
        maskedValue = maskCPF(value);
        break;
      case 'cep':
        maskedValue = maskCEP(value);
        break;
      case 'phone':
        maskedValue = maskPhone(value);
        break;
      case 'email':
        maskedValue = maskEmail(value);
        break;
    }

    setFormData(prev => ({ ...prev, [name]: maskedValue }));

    // Limpar erro ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manipulador de blur (quando o campo perde o foco)
  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof FormData]);
  };

  // Validar campo individual
  const validateField = (name: string, value: string): boolean => {
    let error = '';

    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Nome completo é obrigatório';
        else if (!validateFullName(value)) error = 'Digite nome e sobrenome';
        break;
      case 'email':
        if (!value.trim()) error = 'Email é obrigatório';
        else if (!validateEmail(value)) error = 'Email inválido';
        break;
      case 'cpf':
        if (!value.trim()) error = 'CPF é obrigatório';
        else if (!validateCPF(value)) error = 'CPF inválido';
        break;
      case 'phone':
        if (!value.trim()) error = 'Celular é obrigatório';
        else if (!validatePhone(value)) error = 'Celular inválido';
        break;
      case 'cep':
        if (!value.trim()) error = 'CEP é obrigatório';
        else if (!validateCEP(value)) error = 'CEP inválido';
        break;
      case 'address':
        if (!value.trim()) error = 'Endereço é obrigatório';
        break;
      case 'number':
        if (!value.trim()) error = 'Número é obrigatório';
        break;
      case 'neighborhood':
        if (!value.trim()) error = 'Bairro é obrigatório';
        break;
      case 'city':
        if (!value.trim()) error = 'Cidade é obrigatória';
        break;
      case 'state':
        if (!value.trim()) error = 'Estado é obrigatório';
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
      return false;
    }

    return true;
  };

  // Buscar endereço por CEP
  const handleCEPBlur = async () => {
    handleBlur('cep');

    if (validateCEP(formData.cep)) {
      setLoadingCEP(true);
      try {
        const data = await buscarCEP(formData.cep);
        setFormData(prev => ({
          ...prev,
          address: data.logradouro || prev.address,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.cidade || prev.city,
          state: data.estado || prev.state,
        }));
      } catch (error) {
        setErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }));
      } finally {
        setLoadingCEP(false);
      }
    }
  };

  // Validar todo o formulário
  const validateForm = (): boolean => {
    const fields = Object.keys(formData).filter(key => key !== 'complement');
    let isValid = true;

    fields.forEach(field => {
      const fieldValid = validateField(field, formData[field as keyof FormData]);
      if (!fieldValid) isValid = false;
    });

    // Marcar todos os campos como touched
    const allTouched = fields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(allTouched);

    return isValid;
  };

  // Submeter formulário
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Gerar número do pedido (fictício)
    const generatedOrderNumber = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
    setOrderNumber(generatedOrderNumber);

    // Mostrar modal de sucesso
    setShowSuccessModal(true);
  };

  // Fechar modal e voltar à loja
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    clearCart();
    navigate('/');
  };

  // Redirecionar se carrinho vazio
  if (items.length === 0 && !showSuccessModal) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onCartClick={onCartClick}
        onFavoritesClick={onFavoritesClick}
        onSearch={() => {}}
        onClearSearch={() => {}}
      />

      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Finalizar Compra</h1>
          <p className="text-muted-foreground mt-2">Preencha seus dados para concluir o pedido</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>Preencha todos os campos obrigatórios (*)</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome Completo */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">
                      Nome Completo *
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={() => handleBlur('fullName')}
                      placeholder="João Silva"
                      className={errors.fullName && touched.fullName ? 'border-red-500' : ''}
                    />
                    {errors.fullName && touched.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email e CPF */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        placeholder="joao@exemplo.com"
                        className={errors.email && touched.email ? 'border-red-500' : ''}
                      />
                      {errors.email && touched.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="cpf" className="text-sm font-medium">
                        CPF *
                      </label>
                      <Input
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        onBlur={() => handleBlur('cpf')}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className={errors.cpf && touched.cpf ? 'border-red-500' : ''}
                      />
                      {errors.cpf && touched.cpf && (
                        <p className="text-sm text-red-500">{errors.cpf}</p>
                      )}
                    </div>
                  </div>

                  {/* Telefone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Celular *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                      className={errors.phone && touched.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <Separator />

                  <h3 className="text-lg font-semibold">Endereço de Entrega</h3>

                  {/* CEP */}
                  <div className="space-y-2">
                    <label htmlFor="cep" className="text-sm font-medium">
                      CEP *
                    </label>
                    <div className="relative">
                      <Input
                        id="cep"
                        name="cep"
                        value={formData.cep}
                        onChange={handleChange}
                        onBlur={handleCEPBlur}
                        placeholder="00000-000"
                        maxLength={9}
                        className={errors.cep && touched.cep ? 'border-red-500' : ''}
                      />
                      {loadingCEP && (
                        <Loader2 className="w-4 h-4 absolute right-3 top-3 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    {errors.cep && touched.cep && (
                      <p className="text-sm text-red-500">{errors.cep}</p>
                    )}
                  </div>

                  {/* Endereço e Número */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <label htmlFor="address" className="text-sm font-medium">
                        Endereço *
                      </label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onBlur={() => handleBlur('address')}
                        placeholder="Rua, Avenida, etc."
                        className={errors.address && touched.address ? 'border-red-500' : ''}
                      />
                      {errors.address && touched.address && (
                        <p className="text-sm text-red-500">{errors.address}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="number" className="text-sm font-medium">
                        Número *
                      </label>
                      <Input
                        id="number"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        onBlur={() => handleBlur('number')}
                        placeholder="123"
                        className={errors.number && touched.number ? 'border-red-500' : ''}
                      />
                      {errors.number && touched.number && (
                        <p className="text-sm text-red-500">{errors.number}</p>
                      )}
                    </div>
                  </div>

                  {/* Complemento e Bairro */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="complement" className="text-sm font-medium">
                        Complemento
                      </label>
                      <Input
                        id="complement"
                        name="complement"
                        value={formData.complement}
                        onChange={handleChange}
                        placeholder="Apto, Bloco, etc. (opcional)"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="neighborhood" className="text-sm font-medium">
                        Bairro *
                      </label>
                      <Input
                        id="neighborhood"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleChange}
                        onBlur={() => handleBlur('neighborhood')}
                        placeholder="Centro"
                        className={errors.neighborhood && touched.neighborhood ? 'border-red-500' : ''}
                      />
                      {errors.neighborhood && touched.neighborhood && (
                        <p className="text-sm text-red-500">{errors.neighborhood}</p>
                      )}
                    </div>
                  </div>

                  {/* Cidade e Estado */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <label htmlFor="city" className="text-sm font-medium">
                        Cidade *
                      </label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        onBlur={() => handleBlur('city')}
                        placeholder="São Paulo"
                        className={errors.city && touched.city ? 'border-red-500' : ''}
                      />
                      {errors.city && touched.city && (
                        <p className="text-sm text-red-500">{errors.city}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="state" className="text-sm font-medium">
                        Estado *
                      </label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        onBlur={() => handleBlur('state')}
                        placeholder="SP"
                        maxLength={2}
                        className={`uppercase ${errors.state && touched.state ? 'border-red-500' : ''}`}
                      />
                      {errors.state && touched.state && (
                        <p className="text-sm text-red-500">{errors.state}</p>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Itens */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.movie.id} className="flex gap-3">
                      <img
                        src={getImageUrl(item.movie.poster_path, 'w200')}
                        alt={item.movie.title}
                        className="w-16 h-24 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300?text=Sem+Imagem';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{item.movie.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x R$ {item.movie.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Itens ({totalItems})</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-green-500">GRÁTIS</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botão de Finalizar */}
                <Button 
                  type="submit" 
                  form="checkout-form"
                  className="w-full" 
                  size="lg"
                >
                  Finalizar Pedido
                </Button>

                {/* Botão Continuar Comprando */}
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Continuar Escolhendo Filmes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      <SuccessModal
        open={showSuccessModal}
        onOpenChange={handleCloseSuccessModal}
        orderNumber={orderNumber}
        totalItems={totalItems}
        totalValue={total}
      />
    </div>
  );
}
