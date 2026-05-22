# TouchInput Component

Um input otimizado para toque com suporte a múltiplos tipos, autocomplete automático, botão de limpeza e acessibilidade completa.

## Características

- ✅ Mínimo 48px de altura (mobile best practice)
- ✅ Font size 16px (previne auto-zoom no iOS)
- ✅ Suporte a tipos apropriados: text, email, tel, number, date, password
- ✅ Autocomplete attributes automáticos para campos comuns
- ✅ Botão de limpeza (X) quando há texto
- ✅ Espaçamento mínimo 12px entre elementos
- ✅ Validação com mensagens de erro
- ✅ Helper text para dicas
- ✅ Suporte a ícones
- ✅ Focus states com border/shadow visual
- ✅ Acessibilidade completa (labels, ARIA)

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `label` | string | - | Texto do label (acima do input) |
| `type` | string | 'text' | Tipo de input: text, email, tel, number, date, password |
| `value` | string | '' | Valor atual |
| `onChange` | function | - | Handler de mudança |
| `autoComplete` | string | - | Atributo autocomplete (inferido de `type` se omitido) |
| `placeholder` | string | - | Placeholder text |
| `required` | boolean | false | Marcar campo como obrigatório |
| `disabled` | boolean | false | Estado desabilitado |
| `showClear` | boolean | true | Mostrar botão de limpeza quando há valor |
| `error` | string | - | Mensagem de erro (exibe em vermelho) |
| `helperText` | string | - | Texto de ajuda (exibe em cinza) |
| `icon` | ReactNode | - | Ícone a exibir no input |
| `className` | string | '' | Classes CSS adicionais |
| `style` | object | {} | Estilos inline |
| `...props` | - | - | Props HTML adicionais |

## Exemplos

### Input Básico

```jsx
import TouchInput from '@/components/TouchInput';

function MyForm() {
  const [name, setName] = useState('');

  return (
    <TouchInput
      label="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Enter your name"
    />
  );
}
```

### Email com Autocomplete

```jsx
const [email, setEmail] = useState('');

return (
  <TouchInput
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    autoComplete="email"
    required
  />
);
```

### Telefone com Ícone

```jsx
import { FiPhone } from 'react-icons/fi';

const [phone, setPhone] = useState('');

return (
  <TouchInput
    label="Phone"
    type="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    autoComplete="tel"
    icon={<FiPhone />}
  />
);
```

### Com Validação e Erro

```jsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const handleChange = (e) => {
  setEmail(e.target.value);
  // Validar
  if (e.target.value && !e.target.value.includes('@')) {
    setError('Email inválido');
  } else {
    setError('');
  }
};

return (
  <TouchInput
    label="Email"
    type="email"
    value={email}
    onChange={handleChange}
    error={error}
    required
  />
);
```

### Com Helper Text

```jsx
<TouchInput
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  helperText="Must be at least 8 characters"
  required
/>
```

### Desabilitado

```jsx
<TouchInput
  label="Disabled Field"
  value="Read only"
  disabled
/>
```

### Sem Botão de Limpeza

```jsx
<TouchInput
  label="Amount"
  type="number"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  showClear={false}
/>
```

### Data com Label Obrigatório

```jsx
const [date, setDate] = useState('');

return (
  <TouchInput
    label="Birth Date"
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    required
  />
);
```

## Tipos Suportados

| Type | Autocomplete | Uso |
|------|--------------|-----|
| `text` | - | Texto genérico |
| `email` | email | Endereço de email |
| `tel` | tel | Número de telefone |
| `number` | - | Números (sem spinners) |
| `date` | - | Datas |
| `password` | current-password | Senhas |

## Autocomplete Automático

O componente infere automaticamente o atributo autocomplete baseado no tipo:

```jsx
// Autocomplete será 'email'
<TouchInput type="email" />

// Autocomplete será 'tel'
<TouchInput type="tel" />

// Autocomplete será 'current-password'
<TouchInput type="password" />

// Pode sobrescrever
<TouchInput type="password" autoComplete="new-password" />
```

## Clear Button

O botão de limpeza aparece automaticamente quando há texto:

```jsx
<TouchInput
  value="Clear me"
  onChange={handleChange}
  showClear={true}  // padrão
/>
```

Clicando em X:
1. Limpa o valor
2. Mantém foco no input
3. Chama onChange

## Validação

### Com Error Message

```jsx
const [value, setValue] = useState('');
const [error, setError] = useState('');

const validate = (v) => {
  if (!v) setError('Campo obrigatório');
  else if (v.length < 3) setError('Mínimo 3 caracteres');
  else setError('');
};

return (
  <TouchInput
    value={value}
    onChange={(e) => {
      setValue(e.target.value);
      validate(e.target.value);
    }}
    error={error}
  />
);
```

### Com Required Flag

```jsx
<TouchInput
  label="Name"
  required
  // Mostrará asterisco no label
/>
```

## Mobile Features

### 16px Font Size
Previne auto-zoom no iOS ao focar:
```jsx
// Font size é sempre 16px (mobile best practice)
<TouchInput type="email" />
```

### Touch-Optimized Height
Mínimo 48px de altura para fácil toque:
```jsx
// minHeight: 48px automaticamente
<TouchInput />
```

### Clear Button Touch Target
Botão X com mínimo 40px de altura:
```jsx
<TouchInput
  value="text"
  onChange={handleChange}
  showClear={true}  // 40px touch target
/>
```

### Remove Webkit Styling
Remove aparência padrão dos inputs do iOS:
- Sem sombra de foco padrão
- Sem border radius exagerado
- Estilo customizado consistente

## Focus States

```jsx
// Quando focado:
// - Border fica #10b981 (emerald)
// - Box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1)
// - Transição suave 150ms

<TouchInput />
```

## Acessibilidade

- ✅ Label associado ao input
- ✅ Asterisco (*) para campos obrigatórios
- ✅ `aria-label` no botão clear
- ✅ Semântica HTML correta
- ✅ Navegação por teclado completa
- ✅ Indicadores de erro e ajuda

```jsx
<TouchInput
  label="Email"
  required  // Mostra "Email *"
  type="email"
/>
```

## Performance

- Controlled component com onChange
- Sem debounce automático (aplicar no pai se necessário)
- CSS transitions otimizadas
- Sem re-renders de componentes irmãos

## Testing

```bash
npm test TouchInput.test.jsx
```

Testes cobrem:
- ✅ Renderização correta
- ✅ Touch target size (48px)
- ✅ Font size (16px)
- ✅ Input types suportados
- ✅ Autocomplete attributes
- ✅ Clear button behavior
- ✅ Error and helper text
- ✅ Focus handling
- ✅ Spacing (12px mínimo)
- ✅ Acessibilidade

## Casos de Uso

### Formulário Completo

```jsx
function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <form>
      <TouchInput
        label="Name"
        value={formData.name}
        onChange={handleChange('name')}
        error={errors.name}
        required
      />

      <TouchInput
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
        autoComplete="email"
        required
      />

      <TouchInput
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange('phone')}
        autoComplete="tel"
      />

      <TouchInput
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
        error={errors.password}
        helperText="At least 8 characters"
        required
      />
    </form>
  );
}
```

### Com Debounce (Validação Server)

```jsx
import { useMemo } from 'react';

function EmailCheckInput() {
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');

  // Debounce email check
  const debouncedCheck = useMemo(() => {
    const timeout = setTimeout(async () => {
      setIsChecking(true);
      try {
        const result = await checkEmailExists(email);
        setError(result ? 'Email already exists' : '');
      } finally {
        setIsChecking(false);
      }
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [email]);

  return (
    <TouchInput
      label="Email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      error={error}
      helperText={isChecking ? 'Checking...' : ''}
    />
  );
}
```

## Requisitos Atendidos

- ✅ **5.2**: Mínimo 48px de altura
- ✅ **5.4**: 16px font size (iOS auto-zoom prevention)
- ✅ **5.5**: Input types apropriados
- ✅ **5.6**: Autocomplete attributes
- ✅ **13.1**: Clear button (X)
- ✅ **13.2**: 48px touch target
- ✅ **13.3**: 12px minimum spacing
- ✅ **16.2**: Input types e autocomplete
- ✅ **16.3**: Touch-optimized height
