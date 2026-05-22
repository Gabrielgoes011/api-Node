# ResponsiveModal Component

O `ResponsiveModal` é um componente adaptativo que automaticamente escolhe a melhor representação baseado no tamanho da tela e número de campos do formulário.

## Comportamento

### Desktop / Tablet
- **Tipo**: Diálogo centralizado
- **Largura Máxima**: 500px
- **Backdrop**: Blur com rgba(0,0,0,0.6)
- **Posição**: Centralizado na tela (50%, 50%)

### Mobile com <5 campos
- **Tipo**: BottomSheet (slide up animation)
- **Altura**: "half" (60vh) para ≤3 campos, "full" (90vh) para 4 campos
- **Backdop**: Blur com rgba(0,0,0,0.6)
- **Animação**: Slide up com cubic-bezier(0.4, 0, 0.2, 1) easing

### Mobile com ≥5 campos
- **Tipo**: Modal fullscreen
- **Altura**: 100% da viewport
- **Backdrop**: Blur com rgba(0,0,0,0.6)
- **Animação**: FadeInUp com 300ms

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `isOpen` | boolean | - | Controla a visibilidade do modal |
| `onClose` | function | - | Callback quando o modal deve fechar |
| `title` | string | - | Título exibido no header |
| `children` | ReactNode | - | Conteúdo do modal (normalmente um formulário) |
| `fields` | array | [] | Array de campos (usado para decidir tipo do modal em mobile) |
| `footer` | ReactNode | undefined | Conteúdo do footer com botões de ação |
| `showBackdrop` | boolean | true | Mostra backdrop (desktop apenas) |

## Exemplos de Uso

### Exemplo Básico - Desktop Dialog

```jsx
import { useState } from 'react';
import ResponsiveModal from '@/components/ResponsiveModal';

function EditUserModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Editar Usuário
      </button>

      <ResponsiveModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Editar Usuário"
        fields={[{}, {}, {}]}
      >
        <form>
          <label>Nome</label>
          <input type="text" />

          <label>Email</label>
          <input type="email" />

          <label>Telefone</label>
          <input type="tel" />
        </form>
      </ResponsiveModal>
    </>
  );
}
```

### Exemplo com Footer (Action Buttons)

```jsx
import { useState } from 'react';
import ResponsiveModal from '@/components/ResponsiveModal';

function EditUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // API call...
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Editar Usuário
      </button>

      <ResponsiveModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Editar Usuário"
        fields={[{}, {}, {}]}
        footer={
          <>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: '8px 16px',
                background: '#64748b',
                color: '#f8fafc',
                border: 'none',
                borderRadius: '6px',
                minHeight: '48px',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: '#f8fafc',
                border: 'none',
                borderRadius: '6px',
                minHeight: '48px',
                cursor: 'pointer',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </>
        }
      >
        <form>
          <label>Nome</label>
          <input type="text" />

          <label>Email</label>
          <input type="email" />

          <label>Telefone</label>
          <input type="tel" />
        </form>
      </ResponsiveModal>
    </>
  );
}
```

### Exemplo com Muitos Campos (≥5 campos em mobile)

```jsx
import { useState } from 'react';
import ResponsiveModal from '@/components/ResponsiveModal';

function EditProfileModal() {
  const [isOpen, setIsOpen] = useState(false);

  // 5+ campos → fullscreen modal em mobile
  const fields = [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'email' },
    { name: 'phone' },
    { name: 'address' },
    { name: 'city' },
  ];

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Editar Perfil
      </button>

      <ResponsiveModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Editar Perfil"
        fields={fields}
      >
        <form>
          <input placeholder="Primeiro Nome" />
          <input placeholder="Sobrenome" />
          <input type="email" placeholder="Email" />
          <input type="tel" placeholder="Telefone" />
          <input placeholder="Endereço" />
          <input placeholder="Cidade" />
        </form>
      </ResponsiveModal>
    </>
  );
}
```

## Features Implementadas

### ✅ Requisitos 6.1 - 6.10

- **6.1**: Use useBreakpoint para detectar device type
- **6.2**: Render BottomSheet para mobile forms com <5 campos
- **6.3**: Render fullscreen modal para mobile forms com ≥5 campos
- **6.4**: Render centered dialog para desktop (max-width 500px)
- **6.5**: Include fixed header com title e close button (48px touch target)
- **6.6**: Include fixed footer com action buttons (48px height, full width em mobile)
- **6.7**: Make content area scrollable quando exceder viewport height
- **6.8**: Prevent body scroll quando modal está aberto
- **6.9**: Restore body scroll quando modal fecha
- **6.10**: (Covered by all above)

## Acessibilidade

- ✅ `role="dialog"` em todos os modais
- ✅ `aria-modal="true"`
- ✅ `aria-labelledby` apontando para o título
- ✅ `aria-label` no botão de fechar
- ✅ Focus trap (desktop)
- ✅ ESC key para fechar
- ✅ Backdrop click para fechar (quando `showBackdrop=true`)
- ✅ Keyboard navigation com Tab

## Interações

### Fechar o Modal

O modal pode ser fechado de 3 maneiras:

1. **Clicando no botão X** (header)
2. **Pressionando ESC**
3. **Clicando no backdrop** (quando `showBackdrop=true`)

### Touch Targets

- Botão de fechar: 48px mínimo (Req 5.1)
- Botões no footer: 48px de altura mínima (Req 5.1)

## Performance

- CSS transforms para animações (GPU accelerated)
- Overflow scrolling otimizado (`WebkitOverflowScrolling: 'touch'`)
- Body scroll lock/restore eficiente
- Cleanup automático de event listeners

## Testes

Execute os testes com:

```bash
npm test ResponsiveModal.test.jsx
```

Os testes cobrem:

- ✅ Rendering correto em desktop/mobile
- ✅ Toggle de visibilidade
- ✅ Handlers de close (button, ESC, backdrop)
- ✅ Body scroll prevention/restoration
- ✅ Acessibilidade (ARIA attributes)
- ✅ Conteúdo scrollável
- ✅ Footer rendering
- ✅ Seleção de tipo de modal baseado em field count

## Integração com Formulários

O ResponsiveModal é ideal para:

- Editar registros (usuários, fundos, etc)
- Criar novos registros
- Confirmar ações
- Formulários inline em páginas

Exemplo completo em [src/pages/exemplo-modal.jsx](../pages/exemplo-modal.jsx)
