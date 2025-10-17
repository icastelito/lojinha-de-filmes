import {
  validateEmail,
  validateCPF,
  validateCEP,
  validatePhone,
  validateFullName,
} from './validators';

describe('validateEmail', () => {
  it('deve aceitar emails válidos', () => {
    expect(validateEmail('teste@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co')).toBe(true);
    expect(validateEmail('test123@test-domain.com.br')).toBe(true);
  });

  it('deve rejeitar emails sem @', () => {
    expect(validateEmail('testeexample.com')).toBe(false);
  });

  it('deve rejeitar emails sem domínio', () => {
    expect(validateEmail('teste@')).toBe(false);
    expect(validateEmail('teste@domain')).toBe(false);
  });

  it('deve rejeitar emails vazios', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('deve rejeitar emails com espaços', () => {
    expect(validateEmail('teste @example.com')).toBe(false);
    expect(validateEmail('teste@example .com')).toBe(false);
  });
});

describe('validateCPF', () => {
  it('deve aceitar CPF válido com formatação', () => {
    expect(validateCPF('123.456.789-09')).toBe(true);
  });

  it('deve aceitar CPF válido sem formatação', () => {
    expect(validateCPF('12345678909')).toBe(true);
  });

  it('deve rejeitar CPF com dígitos verificadores inválidos', () => {
    expect(validateCPF('123.456.789-00')).toBe(false);
    expect(validateCPF('12345678900')).toBe(false);
  });

  it('deve rejeitar CPF com todos dígitos iguais', () => {
    expect(validateCPF('111.111.111-11')).toBe(false);
    expect(validateCPF('00000000000')).toBe(false);
    expect(validateCPF('99999999999')).toBe(false);
  });

  it('deve rejeitar CPF com menos de 11 dígitos', () => {
    expect(validateCPF('123.456.789')).toBe(false);
    expect(validateCPF('123456789')).toBe(false);
  });

  it('deve rejeitar CPF vazio', () => {
    expect(validateCPF('')).toBe(false);
  });

  it('deve rejeitar CPF com mais de 11 dígitos', () => {
    expect(validateCPF('123.456.789-099')).toBe(false);
  });
});

describe('validateCEP', () => {
  it('deve aceitar CEP válido com formatação (00000-000)', () => {
    expect(validateCEP('12345-678')).toBe(true);
  });

  it('deve aceitar CEP válido sem formatação', () => {
    expect(validateCEP('12345678')).toBe(true);
  });

  it('deve rejeitar CEP com formato inválido', () => {
    expect(validateCEP('1234-567')).toBe(false);
    expect(validateCEP('123456')).toBe(false);
  });

  it('deve rejeitar CEP vazio', () => {
    expect(validateCEP('')).toBe(false);
  });

  it('deve rejeitar CEP com mais de 8 dígitos', () => {
    expect(validateCEP('123456789')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('deve aceitar telefone válido com 11 dígitos', () => {
    expect(validatePhone('(11) 98765-4321')).toBe(true);
    expect(validatePhone('11987654321')).toBe(true);
  });

  it('deve rejeitar telefone com menos de 11 dígitos', () => {
    expect(validatePhone('(11) 8765-4321')).toBe(false);
    expect(validatePhone('1187654321')).toBe(false);
  });

  it('deve rejeitar telefone com mais de 11 dígitos', () => {
    expect(validatePhone('(11) 98765-43210')).toBe(false);
  });

  it('deve rejeitar telefone vazio', () => {
    expect(validatePhone('')).toBe(false);
  });

  it('deve aceitar apenas dígitos numéricos (após limpeza)', () => {
    expect(validatePhone('(11) 98765-4321')).toBe(true);
    expect(validatePhone('11 98765 4321')).toBe(true);
  });
});

describe('validateFullName', () => {
  it('deve aceitar nome completo válido (2+ palavras)', () => {
    expect(validateFullName('João Silva')).toBe(true);
    expect(validateFullName('Maria da Silva Santos')).toBe(true);
  });

  it('deve rejeitar nome com apenas uma palavra', () => {
    expect(validateFullName('João')).toBe(false);
  });

  it('deve rejeitar string vazia', () => {
    expect(validateFullName('')).toBe(false);
  });

  it('deve rejeitar string com apenas espaços', () => {
    expect(validateFullName('   ')).toBe(false);
  });

  it('deve ignorar espaços extras', () => {
    expect(validateFullName('  João   Silva  ')).toBe(true);
  });

  it('deve rejeitar nome com uma palavra e espaços', () => {
    expect(validateFullName('  João  ')).toBe(false);
  });
});
