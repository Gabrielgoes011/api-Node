import bcrypt from 'bcrypt';

const senha = 'Padrão123';
const hash = await bcrypt.hash(senha, 10);

console.log('Hash gerado:', hash);

const resultado = await bcrypt.compare('Padrão123', hash);
console.log('Senha correta?', resultado); // true

const errado = await bcrypt.compare('SenhaErrada', hash);
console.log('Senha errada?', errado); // false
console.log('Fim do programa');