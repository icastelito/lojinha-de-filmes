import { maskCPF, maskCEP, maskPhone, maskEmail } from './masks';

describe('maskCPF', () => {
  it('deve formatar CPF corretamente (000.000.000-00)', () => {
    expect(maskCPF('12345678909')).toBe('123.456.789-09');
  });

  it('deve formatar CPF parcialmente durante digitação', () => {
    expect(maskCPF('123')).toBe('123');
    expect(maskCPF('12345')).toBe('123.45');
    expect(maskCPF('12345678')).toBe('123.456.78');
    expect(maskCPF('123456789')).toBe('123.456.789');
  });

  it('deve limitar a 14 caracteres (incluindo formatação)', () => {
    const formatted = maskCPF('12345678909');
    expect(formatted).toBe('123.456.789-09');
    expect(formatted.length).toBe(14);
  });

  it('deve retornar vazio para entrada vazia', () => {
    expect(maskCPF('')).toBe('');
  });

  it('deve remover caracteres não numéricos antes de formatar', () => {
    expect(maskCPF('123abc456def789gh09')).toBe('123.456.789-09');
  });

  it('deve lidar com entrada já formatada', () => {
    expect(maskCPF('123.456.789-09')).toBe('123.456.789-09');
  });
});

describe('maskCEP', () => {
  it('deve formatar CEP corretamente (00000-000)', () => {
    expect(maskCEP('12345678')).toBe('12345-678');
  });

  it('deve formatar CEP parcialmente durante digitação', () => {
    expect(maskCEP('123')).toBe('123');
    expect(maskCEP('12345')).toBe('12345');
    expect(maskCEP('123456')).toBe('12345-6');
  });

  it('deve limitar a 9 caracteres (incluindo formatação)', () => {
    const formatted = maskCEP('12345678');
    expect(formatted).toBe('12345-678');
    expect(formatted.length).toBe(9);
  });

  it('deve retornar vazio para entrada vazia', () => {
    expect(maskCEP('')).toBe('');
  });

  it('deve remover caracteres não numéricos antes de formatar', () => {
    expect(maskCEP('12abc345def678')).toBe('12345-678');
  });

  it('deve lidar com entrada já formatada', () => {
    expect(maskCEP('12345-678')).toBe('12345-678');
  });
});

describe('maskPhone', () => {
  it('deve formatar telefone corretamente ((00) 00000-0000)', () => {
    expect(maskPhone('11987654321')).toBe('(11) 98765-4321');
  });

  it('deve formatar telefone parcialmente durante digitação', () => {
    expect(maskPhone('11')).toBe('11');
    expect(maskPhone('119')).toBe('(11) 9');
    expect(maskPhone('1198765')).toBe('(11) 98765');
    expect(maskPhone('11987654')).toBe('(11) 98765-4');
  });

  it('deve limitar a 15 caracteres (incluindo formatação)', () => {
    const formatted = maskPhone('11987654321');
    expect(formatted).toBe('(11) 98765-4321');
    expect(formatted.length).toBe(15);
  });

  it('deve retornar vazio para entrada vazia', () => {
    expect(maskPhone('')).toBe('');
  });

  it('deve remover caracteres não numéricos antes de formatar', () => {
    expect(maskPhone('11abc98765def4321')).toBe('(11) 98765-4321');
  });

  it('deve lidar com entrada já formatada', () => {
    expect(maskPhone('(11) 98765-4321')).toBe('(11) 98765-4321');
  });
});

describe('maskEmail', () => {
  it('deve converter para lowercase', () => {
    expect(maskEmail('TEST@EXAMPLE.COM')).toBe('test@example.com');
    expect(maskEmail('User.Name@Domain.COM')).toBe('user.name@domain.com');
  });

  it('deve manter email já em lowercase', () => {
    expect(maskEmail('test@example.com')).toBe('test@example.com');
  });

  it('deve manter caracteres válidos', () => {
    expect(maskEmail('Test123@Example.Com')).toBe('test123@example.com');
    expect(maskEmail('User-Name@Test-Domain.COM')).toBe('user-name@test-domain.com');
  });

  it('deve retornar vazio para entrada vazia', () => {
    expect(maskEmail('')).toBe('');
  });
});
