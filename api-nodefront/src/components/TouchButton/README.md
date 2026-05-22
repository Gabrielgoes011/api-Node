# TouchButton Component

Um botão otimizado para toque com feedback visual instantâneo, acessibilidade completa e suporte a haptic feedback.

## Características

- ✅ Mínimo 48px de dimensões (mobile best practice)
- ✅ Feedback visual instantâneo (<50ms) no toque
- ✅ Prevenção de double-tap zoom acidental no iOS
- ✅ Suporte a haptic feedback em dispositivos compatíveis
- ✅ Estilo consistente com tema (emerald, red, slate)
- ✅ Indicadores de foco para navegação por teclado
- ✅ Animações suaves com CSS transforms
- ✅ Estados: normal, hover, active, disabled, loading
- ✅ Acessibilidade completa (ARIA attributes)

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `onClick` | function | - | Handler de clique |
| `variant` | string | 'primary' | Estilo: 'primary', 'danger', 'secondary', 'outline' |
| `size` | string | 'md' | Tamanho: 'sm' (36px), 'md' (48px), 'lg' (56px) |
| `disabled` | boolean | false | Estado desabilitado |
| `loading` | boolean | false | Estado de carregamento com spinner |
| `haptic` | boolean | true | Ativar feedback tátil |
| `children` | ReactNode | - | Conteúdo do botão |
| `className` | string | '' | Classes CSS adicionais |
| `style` | object | {} | Estilos inline |
| `...props` | - | - | Props HTML adicionais |

## Exemplos

### Botão Padrão (Primary)

```jsx
import TouchButton from '@/components/TouchButton';

function MyComponent() {
  const handleSave = () => {
    // Save logic
  };

  return (
    <TouchButton onClick={handleSave}>
      Save Changes
    </TouchButton>
  );
}
```

### Botão de Perigo (Danger)

```jsx
<TouchButton variant="danger" onClick={handleDelete}>
  Delete
</TouchButton>
```

### Botão com Estado de Carregamento

```jsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await submitForm();
  } finally {
    setIsLoading(false);
  }
};

return (
  <TouchButton loading={isLoading} onClick={handleSubmit}>
    Submit
  </TouchButton>
);
```

### Botão Desabilitado

```jsx
<TouchButton disabled onClick={handleClick}>
  Disabled Button
</TouchButton>
```

### Diferentes Tamanhos

```jsx
<TouchButton size="sm">Small</TouchButton>
<TouchButton size="md">Medium</TouchButton>
<TouchButton size="lg">Large</TouchButton>
```

### Estilo Outline

```jsx
<TouchButton variant="outline" onClick={handleCancel}>
  Cancel
</TouchButton>
```

### Sem Haptic Feedback

```jsx
<TouchButton haptic={false} onClick={handleClick}>
  Click
</TouchButton>
```

## Cores Disponíveis

| Variant | Cor | Uso |
|---------|-----|-----|
| `primary` | Emerald (#10b981) | Ações primárias, confirmação |
| `danger` | Red (#ef4444) | Ações destrutivas, delete |
| `secondary` | Slate (#64748b) | Ações secundárias, cancel |
| `outline` | Transparent | Ações opcionais |

## Acessibilidade

- ✅ `aria-busy="true"` quando loading
- ✅ `aria-disabled="true"` quando disabled
- ✅ Indicador de foco visível (2px outline) para navegação por teclado
- ✅ Suporta navegação apenas por teclado
- ✅ Semântica HTML correta (`<button>`)

## Mobile Features

### Touch Feedback
O botão fornece feedback visual dentro de 50ms:
1. **Scale**: Reduz para 95% ao tocar
2. **Cor**: Muda de cor ao hover
3. **Haptic**: Vibração tátil (20ms) em dispositivos suportados

### Double-Tap Zoom Prevention
Usa `touch-action: manipulation` para impedir zoom acidental no iOS.

### Haptic Feedback
Compatível com:
- Android Chrome (Vibration API)
- iOS PWA (webkit variant)
- Desktop (ignorado com segurança)

```jsx
// Ativar/desativar haptic feedback
<TouchButton haptic={true}>Click</TouchButton>
<TouchButton haptic={false}>Quiet Click</TouchButton>
```

## Performance

- CSS transforms para animações (GPU accelerated)
- Sem re-renders desnecessários
- Event delegation otimizado
- Limpeza automática de timeouts

## Testing

```bash
npm test TouchButton.test.jsx
```

Testes cobrem:
- ✅ Renderização correta
- ✅ Touch target size (48px mínimo)
- ✅ Visual feedback (<50ms)
- ✅ Click handling
- ✅ Estados (disabled, loading)
- ✅ Variantes (primary, danger, secondary, outline)
- ✅ Acessibilidade
- ✅ Haptic feedback
- ✅ Prevenção de double-tap zoom

## Casos de Uso

### Formulários
```jsx
<form onSubmit={handleSubmit}>
  <input type="text" />
  <TouchButton type="submit">Submit</TouchButton>
</form>
```

### Confirmação com Loading
```jsx
const [isLoading, setIsLoading] = useState(false);

const handleDelete = async () => {
  setIsLoading(true);
  await deleteItem();
  setIsLoading(false);
};

return (
  <TouchButton
    variant="danger"
    loading={isLoading}
    onClick={handleDelete}
  >
    Delete
  </TouchButton>
);
```

### Grupo de Botões
```jsx
<div style={{ display: 'flex', gap: '12px' }}>
  <TouchButton variant="secondary" onClick={handleCancel}>
    Cancel
  </TouchButton>
  <TouchButton variant="primary" onClick={handleSave}>
    Save
  </TouchButton>
</div>
```

## Requisitos Atendidos

- ✅ **5.1**: Mínimo 48px de dimensões
- ✅ **5.2**: Feedback visual dentro de 50ms
- ✅ **5.3**: Prevenção de double-tap zoom
- ✅ **5.7**: Suporte a haptic feedback
- ✅ **11.7**: Estilo consistente com tema
