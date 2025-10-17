/**
 * Máscaras de formatação para inputs
 */

/**
 * Aplica máscara de CPF: 000.000.000-00
 */
export const maskCPF = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const match = cleanValue.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
  
  if (!match) return value;
  
  return !match[2] 
    ? match[1] 
    : `${match[1]}.${match[2]}${match[3] ? `.${match[3]}` : ''}${match[4] ? `-${match[4]}` : ''}`;
};

/**
 * Aplica máscara de CEP: 00000-000
 */
export const maskCEP = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const match = cleanValue.match(/^(\d{0,5})(\d{0,3})$/);
  
  if (!match) return value;
  
  return !match[2] ? match[1] : `${match[1]}-${match[2]}`;
};

/**
 * Aplica máscara de telefone: (00) 00000-0000
 */
export const maskPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const match = cleanValue.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
  
  if (!match) return value;
  
  return !match[2] 
    ? match[1] 
    : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
};

/**
 * Converte email para lowercase automaticamente
 */
export const maskEmail = (value: string): string => {
  return value.toLowerCase();
};

/**
 * Remove máscara e retorna apenas números
 */
export const unmask = (value: string): string => {
  return value.replace(/\D/g, '');
};
