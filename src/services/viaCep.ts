import axios from 'axios';

const VIACEP_BASE_URL = 'https://viacep.com.br/ws';

// Interface para a resposta da API ViaCEP
export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
}

// Interface para a resposta bruta da API
interface ViaCepRawResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

/**
 * Busca endereço por CEP usando a API ViaCEP
 * @param {string} cep - CEP a ser consultado (com ou sem formatação)
 * @returns {Promise<ViaCepResponse>} - Dados do endereço
 */
export const buscarCEP = async (cep: string): Promise<ViaCepResponse> => {
  try {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');

    // Valida formato do CEP
    if (cleanCep.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos');
    }

    const response = await axios.get<ViaCepRawResponse>(`${VIACEP_BASE_URL}/${cleanCep}/json/`);

    // ViaCEP retorna um objeto com propriedade "erro" quando o CEP não existe
    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      cep: response.data.cep,
      logradouro: response.data.logradouro,
      complemento: response.data.complemento,
      bairro: response.data.bairro,
      cidade: response.data.localidade,
      estado: response.data.uf,
      ibge: response.data.ibge,
      gia: response.data.gia,
      ddd: response.data.ddd,
      siafi: response.data.siafi,
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    
    if (error instanceof Error && 
        (error.message === 'CEP deve conter 8 dígitos' || error.message === 'CEP não encontrado')) {
      throw error;
    }
    
    throw new Error('Não foi possível consultar o CEP. Verifique sua conexão.');
  }
};

export default buscarCEP;
