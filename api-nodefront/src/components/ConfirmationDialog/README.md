# ConfirmationDialog Component

Um diálogo de confirmação adaptativo para ações destrutivas (delete, remove, etc.) que detecta automaticamente o tipo de dispositivo e ajusta a apresentação.

## Características

- ✅ **Adaptive Design**: BottomSheet em mobile, Dialog centrado em desktop
- ✅ **Clear Warnings**: Mensagem de aviso com identificador do registro
- ✅ **Explicit Action**: Requer ação explícita (sem auto-dismiss)
- ✅ **Touch Targets**: Botões com mínimo 48px de altura
- ✅ **Color Coding**: Cancel (slate), Delete (red)
- ✅ **Accessibility**: ARIA attributes, keyboard support
- ✅ **Loading States**: Suporte a operações async
- ✅ **No Accidental Deletions**: Design previne cliques acidentais

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `isOpen` | boolean | - | Controla visibilidade do diálogo |
| `onClose` | function | - | Callback quando usuário clica Cancel ou ESC |
| `onConfirm` | function | - | Callback quando usuário clica Delete |
| `title` | string | - | Título do diálogo (ex: "Delete User") |
| `recordIdentifier` | string | - | Identificador do registro (nome, email, etc) |
| `message` | string | "Esta ação não pode ser desfeita..." | Mensagem de aviso |
| `confirmLabel` | string | 'Excluir' | Rótulo do botão de confirmação |
| `cancelLabel` | string | 'Cancelar' | Rótulo do botão de cancelamento |
| `loading` | boolean | false | Mostrar estado de carregamento |
| `showBackdrop` | boolean | true | Mostrar backdrop (desktop apenas) |

## Exemplos

### Exemplo Básico

```jsx
import { useState } from 'react';
import ConfirmationDialog from '@/components/ConfirmationDialog';

function UserList() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    // Delete user API call
    deleteUser(selectedUser.id);
    setShowConfirm(false);
    setSelectedUser(null);
  };

  return (
    <>
      <UserTable onDelete={handleDeleteClick} />

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        recordIdentifier={selectedUser?.name}
        message="This user and all associated data will be permanently deleted."
      />
    </>
  );
}
```

### Com Loading State

```jsx
const [isDeleting, setIsDeleting] = useState(false);

const handleConfirmDelete = async () => {
  setIsDeleting(true);
  try {
    await deleteUser(selectedUser.id);
    showToast('User deleted successfully', 'success');
    setShowConfirm(false);
  } catch (error) {
    showToast('Failed to delete user', 'error');
  } finally {
    setIsDeleting(false);
  }
};

return (
  <ConfirmationDialog
    isOpen={showConfirm}
    onClose={() => setShowConfirm(false)}
    onConfirm={handleConfirmDelete}
    title="Delete User"
    recordIdentifier={selectedUser?.email}
    loading={isDeleting}
  />
);
```

### Integração com ActionMenu

```jsx
// Em ActionMenu
const handleDeleteClick = () => {
  onAction('delete');
  setIsOpen(false); // Fecha o BottomSheet/menu
};

// Em página pai
const [deleteTarget, setDeleteTarget] = useState(null);
const [showConfirm, setShowConfirm] = useState(false);

const handleAction = (action, record) => {
  if (action === 'delete') {
    setDeleteTarget(record);
    setShowConfirm(true);
  } else if (action === 'edit') {
    // Open edit modal
  }
};

return (
  <>
    <CardView
      data={items}
      onAction={(action, record) => handleAction(action, record)}
    />

    <ConfirmationDialog
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      onConfirm={() => {
        deleteRecord(deleteTarget.id);
        setShowConfirm(false);
      }}
      title="Delete Record"
      recordIdentifier={deleteTarget?.name}
    />
  </>
);
```

### Diferentes Tipos de Deletions

```jsx
// Delete Fund
<ConfirmationDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Fund"
  recordIdentifier={fund.name}
  message="All positions and history for this fund will be deleted."
/>

// Delete Transaction
<ConfirmationDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Transaction"
  recordIdentifier={`${transaction.date} - ${transaction.type}`}
  message="This transaction will be removed from your history."
/>

// Delete User
<ConfirmationDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete User"
  recordIdentifier={user.email}
  message="All data associated with this user will be permanently deleted."
  confirmLabel="Delete User"
/>
```

## Comportamento por Dispositivo

### Mobile (< 768px)
```
┌─────────────────────┐
│   Delete User       │
├─────────────────────┤
│ ⚠️ Ação Irreversível │
│ Esta ação não pode  │
│ ser desfeita        │
├─────────────────────┤
│ Será deletado:      │
│ João Silva          │
│ (joao@email.com)    │
├─────────────────────┤
│ Esta ação não pode  │
│ ser desfeita. Todos │
│ os dados associados │
│ serão deletados.    │
├─────────────────────┤
│ Cancelar | Excluir  │
└─────────────────────┘
```

### Desktop (> 1024px)
```
  ┌──────────────────────────────┐
  │ ⚠️  Delete User               │
  ├──────────────────────────────┤
  │ Será deletado:               │
  │ João Silva (joao@email.com)  │
  │                              │
  │ Esta ação não pode ser       │
  │ desfeita. Todos os dados     │
  │ associados serão deletados.  │
  │                              │
  │                              │
  │            Cancelar Excluir  │
  └──────────────────────────────┘
```

## Acessibilidade

- ✅ `role="alertdialog"` para importância
- ✅ `aria-modal="true"` para modal
- ✅ `aria-labelledby` aponta para título
- ✅ `aria-describedby` aponta para mensagem
- ✅ Suporte ESC para fechar
- ✅ Suporte backdrop click
- ✅ Focus automático
- ✅ Semantic HTML

```jsx
<ConfirmationDialog
  // role="alertdialog" (automático)
  // aria-modal="true" (automático)
  // aria-labelledby={titleId} (automático)
  // aria-describedby="confirmation-message" (automático)
/>
```

## Styling

### Cores
- **Cancel Button**: #64748b (Slate) - Neutral
- **Delete Button**: #ef4444 (Red) - Danger
- **Warning Box**: rgba(239, 68, 68, 0.1) - Subtle red
- **Icon**: #ef4444 (Red) - Alert

### Sizing
- **Touch Targets**: 48px mínimo (altura dos botões)
- **Dialog Width**: Max 400px (desktop)
- **Mobile Width**: 90% (with max-width)

## Interações

### Keyboard
- **ESC**: Fecha o diálogo (calls `onClose`)
- **Tab**: Navega entre botões
- **Enter**: Ativa o botão focado

### Touch
- **Backdrop Click**: Fecha (mobile e desktop)
- **Swipe Down**: Fecha BottomSheet (mobile apenas)
- **Button Press**: Haptic feedback + escala

### States
- **Normal**: Botões habilitados
- **Loading**: Spinner no botão Delete, botões desabilitados
- **Disabled**: Ambos botões desabilitados

## Performance

- Renders sob demanda (controlled by `isOpen`)
- Cleanup automático de event listeners
- Sem re-renders desnecessários
- CSS transforms para animações (GPU accelerated)

## Testing

```bash
npm test ConfirmationDialog.test.jsx
```

Testes cobrem:
- ✅ Renderização em desktop e mobile
- ✅ Display de identificador e mensagem
- ✅ Click handlers (confirm/cancel)
- ✅ ESC key handling
- ✅ Backdrop click
- ✅ Loading states
- ✅ Button labels customizados
- ✅ Acessibilidade (ARIA, roles)
- ✅ Async confirmation handling
- ✅ Tablet variant

## Casos de Uso

### Deletar Usuário
```jsx
<ConfirmationDialog
  isOpen={show}
  onClose={() => setShow(false)}
  onConfirm={deleteUser}
  title="Delete User"
  recordIdentifier={`${user.name} (${user.email})`}
  message="All associated data will be permanently removed."
/>
```

### Deletar Transação
```jsx
<ConfirmationDialog
  isOpen={show}
  onClose={() => setShow(false)}
  onConfirm={deleteTransaction}
  title="Delete Transaction"
  recordIdentifier={`${transaction.date} - ${transaction.description}`}
/>
```

### Deletar Fundo
```jsx
<ConfirmationDialog
  isOpen={show}
  onClose={() => setShow(false)}
  onConfirm={deleteFund}
  title="Delete Fund"
  recordIdentifier={fund.ticker}
  message="All positions and history for this fund will be deleted permanently."
/>
```

### Limpar Dados
```jsx
<ConfirmationDialog
  isOpen={show}
  onClose={() => setShow(false)}
  onConfirm={clearData}
  title="Clear All Data"
  recordIdentifier="All records"
  message="This action cannot be undone. All your data will be permanently deleted."
  confirmLabel="Clear All"
/>
```

## Integração com ActionMenu

Use em conjunto com ActionMenu para ações delete:

```jsx
// ActionMenu já abre ConfirmationDialog automaticamente
// através do handler onAction('delete')

// Em componente pai:
const handleAction = (action, record) => {
  if (action === 'delete') {
    setDeleteTarget(record);
    setShowConfirm(true);
  }
};
```

## Requisitos Atendidos

- ✅ **12.1**: Use BottomSheet para mobile
- ✅ **12.2**: Use centered dialog para desktop
- ✅ **12.3**: Display record identifier
- ✅ **12.4**: Display warning message
- ✅ **12.5**: "Cancelar" (neutral #64748b) button
- ✅ **12.6**: "Excluir" (danger #ef4444) button
- ✅ **12.7**: Buttons 48px mínimo
- ✅ **12.8**: Explicit user action required
