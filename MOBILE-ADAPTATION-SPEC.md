# 📱 SPEC — Adaptação Mobile para FIITrack

## Objetivo

Transformar o sistema FIITrack de fundos imobiliários, hoje focado apenas em desktop, em uma aplicação utilizável e funcional em smartphones.

A prioridade **NÃO** é apenas "fazer caber na tela". A prioridade é:

- ✅ Manter usabilidade
- ✅ Reduzir fricção
- ✅ Evitar poluição visual
- ✅ Preservar produtividade
- ✅ Melhorar navegação
- ✅ Tornar ações rápidas em telas pequenas

**O maior problema atual:** uso intensivo de grids/tabelas tradicionais, que funcionam no desktop mas quebram completamente a experiência mobile.

---

## Diretriz Principal

### ❌ NÃO tentar manter a mesma UI do desktop no celular

Esse é o erro clássico.

**Grid horizontal com muitas colunas em smartphone:**
- Vira zoom infinito
- Cria scroll lateral irritante
- Destrói legibilidade
- Aumenta erros de clique
- Deixa ações escondidas

**Mobile precisa de:**
- Leitura vertical
- Foco em informação prioritária
- Ações acessíveis com dedo
- Pouco texto por linha
- Hierarquia visual clara

---

## Stack Tecnológico Identificado

### ✅ Frontend
- **React** 19.2.4
- **Vite** 8.0.10
- **Tailwind CSS** 3.4.19 (já configurado!)
- **React Router DOM** 7.14.2
- **React Bootstrap** 2.10.10
- **React Icons** 5.6.0
- **React Toastify** 11.0.5
- **Axios** 1.13.6

### ✅ Backend
- **Node.js** + Express
- **SQLite** (database.db)
- **JWT Authentication**

### ✅ Pontos Positivos
- Tailwind já configurado (facilita responsividade)
- React Icons (ícones escaláveis)
- Estrutura componentizada
- Hooks customizados já em uso
- Design system consistente (cores, spacing)

### ⚠️ Pontos de Atenção
- React Bootstrap pode conflitar com Tailwind (avaliar remoção)
- Muitos inline styles (dificulta manutenção)
- Falta de testes (considerar adicionar após mobile)

---

## Estratégia Geral

### Desktop continua usando Grid
No desktop:
- Manter tabela/grid
- Manter produtividade
- Manter atalhos e visão ampla

### Mobile usa Cards Responsivos
No mobile:
- Substituir grids por cards/listas
- Cada registro vira um card
- Informações ficam empilhadas verticalmente
- Ações ficam compactadas

---

## Estrutura Esperada para Mobile

### Exemplo de conversão

**Desktop:**
```
┌─────────────────────────────────────────────────────────────┐
│ Ativo  │ Quantidade │ Preço Médio │ DY   │ Setor  │ Ações  │
├─────────────────────────────────────────────────────────────┤
│ MXRF11 │ 100        │ R$ 10,12    │ 12%  │ Papel  │ ✏️ 🗑️  │
└─────────────────────────────────────────────────────────────┘
```

**Mobile (cada item vira):**
```
┌─────────────────────────────────┐
│ MXRF11          Papel      ⋮   │
│ Maxi Renda FII                  │
│ Qtd: 100  PM: R$ 10,12  DY: 12% │
└─────────────────────────────────┘
```

---

## Campo "Ações" — Melhor prática

### ❌ NÃO deixar vários botões visíveis

**Erro comum:**
```
[ editar ] [ excluir ] [ detalhes ] [ histórico ] [ dividendos ] [ gráficos ]
```
Isso destrói o layout mobile.

### ✅ Solução correta: Usar menu compacto de ações

**Opção recomendada:**

**Botão:** `⋮` ou `☰`

**Ao clicar, abrir:**
- Bottom Sheet OU
- Dropdown OU
- Modal de ações

### Estrutura recomendada do menu

```
┌─────────────────────────────────┐
│ Ações do ativo            ✕     │
├─────────────────────────────────┤
│ 👁️ Ver detalhes                 │
│ ✏️ Editar                        │
│ 📊 Histórico                     │
│ 💰 Dividendos                    │
│ 🗑️ Excluir                       │
└─────────────────────────────────┘
```

### Melhor abordagem: Bottom Sheet Mobile

No smartphone:
- Modal vindo de baixo
- Ocupando 40~60% da tela
- Fácil para dedo
- Comportamento parecido com apps modernos

Isso deixa:
- Visual limpo
- Navegação moderna
- Ações organizadas

---

## Responsividade

### Breakpoints obrigatórios

| Dispositivo | Breakpoint |
|-------------|------------|
| **Mobile** | Até 768px |
| **Tablet** | 769px até 1024px |
| **Desktop** | Acima de 1024px |

### Breakpoints Tailwind (já configurado)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',  // ← Mobile até aqui
      'lg': '1024px', // ← Tablet
      'xl': '1280px', // ← Desktop
    }
  }
}
```

### Regras de Responsividade

**Mobile:**
- Substituir: tabelas → cards
- Substituir: menus laterais fixos → menu hamburguer
- Substituir: múltiplas colunas → layout vertical
- Substituir: modais grandes → fullscreen ou bottom sheet

---

## Navegação Mobile

### Sidebar

**No desktop:**
- Sidebar fixa (250px)

**No mobile:**
- Sidebar escondida (overlay)
- Abrir via hamburguer
- Position: fixed com z-index alto
- Backdrop blur ao abrir

### Código atual que precisa adaptar

```javascript
// Layout.jsx - PROBLEMA
marginLeft: sidebarOpen ? '250px' : '0px',
```

**Solução:**
```javascript
// Detectar mobile
const isMobile = window.innerWidth < 768;

// Sidebar overlay em mobile
position: isMobile ? 'fixed' : 'relative',
marginLeft: isMobile ? '0' : (sidebarOpen ? '250px' : '0'),
```

---

## Inputs e Formulários

### Regras obrigatórias

**Altura mínima de clique:**
```
48px
```
**Porque:**
- Dedo humano
- Acessibilidade
- Evitar erro de toque

**Espaçamento:**
Nunca deixar elementos grudados.
```
Padding mínimo: 12px
```

**Fontes:**
Nunca abaixo de:
```
14px
```
Ideal:
```
16px
```

---

## Performance Mobile

### Problema
Grid pesado no mobile:
- Trava
- Lag
- Scroll ruim
- Alto consumo de memória

### Soluções
Implementar:
- ✅ Paginação (já existe no TableAcoes)
- ✅ Lazy loading
- ✅ Virtualização
- ✅ Carregamento incremental

---

## UX importante

### Mostrar apenas o essencial

**No mobile:**
- ❌ NÃO mostrar todas as colunas

**Exibir apenas:**
- Nome do ativo
- Preço médio
- Quantidade
- Rendimento
- Status

**Detalhes adicionais:**
- Abrir em modal/página detalhes

---

## Padrão Visual Recomendado

### Cards
Cada card deve possuir:
- Borda suave
- Sombra leve
- Padding interno
- Separação clara

### Estados da aplicação

**Loading:**
- Necessário skeleton loading
- Evitar: tela piscando, loading bruto, layout pulando

**Confirmação de exclusão:**
- Obrigatório
- Excluir no mobile precisa: confirmação, feedback visual, evitar clique acidental

### Melhor prática para exclusão

**Fluxo ideal:**

1. Usuário: `⋮` → Excluir
2. Sistema: Bottom sheet/modal:
   ```
   "Deseja realmente excluir este ativo?"
   [ Cancelar ]  [ Excluir ]
   ```

---

## Melhorias altamente recomendadas

### Swipe actions

**Exemplo:**
- Arrastar card para esquerda: editar, excluir, favoritos

**Mas:**
- Implementar SOMENTE se a UX estiver madura
- Swipe mal implementado piora tudo

---

## Arquitetura recomendada

### ❌ NÃO criar componentes separados totalmente diferentes

**Erro comum:**
```
DesktopTable.jsx
MobileTable.jsx
DesktopCard.jsx
MobileCard.jsx
```
Isso vira caos.

### ✅ Estratégia correta: Criar componentes reutilizáveis

**Exemplo:**
```
AssetList
AssetCard
ActionMenu
ResponsiveContainer
```

Com comportamento adaptável via breakpoint.

---

## Estrutura de Pastas Sugerida

```
src/
├── components/
│   ├── TableAcoes/
│   │   ├── TableAcoes.jsx (desktop)
│   │   ├── CardView.jsx (mobile) ← NOVO
│   │   ├── ActionMenu.jsx (menu ⋮) ← NOVO
│   │   └── ResponsiveTable.jsx (wrapper) ← NOVO
│   ├── Layout/
│   │   ├── Layout.jsx (adaptar)
│   │   └── MobileLayout.jsx ← NOVO (opcional)
│   ├── Sidebar/
│   │   └── Sidebar.jsx (adaptar overlay)
│   ├── BottomSheet/
│   │   └── BottomSheet.jsx ← NOVO
│   └── ...
├── hooks/
│   └── useBreakpoint.js ← NOVO
├── utils/
│   └── responsive.js ← NOVO
```

---

## Detectar Mobile

### Preferir CSS responsivo

**Evitar:**
```javascript
if(window.innerWidth)
```
para tudo.

**Preferir:**
- CSS Grid
- Flexbox
- Media queries
- Tailwind responsivo

### Hook Customizado Recomendado

```javascript
// hooks/useBreakpoint.js
import { useState, useEffect } from 'react';

export const useBreakpoint = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};
```

**Uso:**
```javascript
const { isMobile, isTablet, isDesktop } = useBreakpoint();

return isMobile ? <CardView /> : <TableAcoes />;
```

---

## Componentes que Precisam de Adaptação Mobile

| Componente | Prioridade | Ação Necessária |
|------------|-----------|-----------------|
| **TableAcoes** | 🔴 CRÍTICA | Criar versão Card + Bottom Sheet para ações |
| **Sidebar** | 🔴 CRÍTICA | Overlay mobile + hamburguer sempre visível |
| **Layout** | 🔴 CRÍTICA | Remover marginLeft fixo, adaptar padding |
| **Modal Formulário** | 🟡 MÉDIA | Bottom sheet ou fullscreen mobile |
| **TopBar** | 🟡 MÉDIA | Compactar em mobile |
| **DataCard** | 🟢 BAIXA | Já usa flexbox, ajustar apenas spacing |
| **Charts** | 🟢 BAIXA | Recharts é responsivo por padrão |

---

## Pontos Críticos Identificados no Código Atual

### 1. Layout Atual (Desktop-Only)

**Arquivo:** `Layout.jsx`

**Problema:**
```javascript
marginLeft: sidebarOpen ? '250px' : '0px',
paddingTop: '60px',
```
Sidebar fixa de 250px quebra em mobile.

**Solução:**
- Mobile: sidebar overlay (position: fixed com z-index alto)
- Desktop: sidebar fixa lateral
- Breakpoint: 768px

---

### 2. Sidebar — Já tem Toggle, mas precisa adaptar

**Arquivo:** `Sidebar.jsx`

**Problema:**
```javascript
const [isOpen, setIsOpen] = useState(true);
```
Sidebar abre por padrão. Em mobile deve iniciar fechada.

**Solução:**
```javascript
const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
```

---

### 3. TableAcoes — O Grande Desafio

**Arquivo:** `TableAcoes.jsx`

**Estrutura atual:**
- Tabela HTML tradicional com scroll horizontal
- Colunas fixas (Ticker, Nome, CNPJ, Seguimento, Ações)
- Botões de ação inline (Editar, Excluir, etc.)
- Paginação funcional

**Problemas mobile:**
- ❌ Scroll horizontal inevitável
- ❌ Botões pequenos (17px icons)
- ❌ Muita informação horizontal
- ❌ Ações ficam espremidas

**Solução recomendada:**

Criar componente **`ResponsiveTable`** que:
- Detecta breakpoint via CSS/JS
- Renderiza `<TableAcoes>` no desktop
- Renderiza `<CardView>` no mobile

---

### 4. Modal de Formulário — Precisa Adaptar

**Arquivo:** `meusFiis.jsx`

**Código atual:**
```javascript
width: '90%',
maxWidth: '500px',
```

**Problema:** Modal funciona, mas pode melhorar no mobile.

**Solução:**
- Mobile: fullscreen ou bottom sheet
- Desktop: modal centralizado (atual)

---

## Requisitos Técnicos

### Implementar

**Layout:**
- ✅ Responsividade completa
- ✅ Flexbox/grid responsivo
- ✅ Cards mobile

**Navegação:**
- ✅ Menu hamburguer
- ✅ Bottom navigation opcional

**Tabelas:**
- ✅ Conversão automática para cards
- ✅ Esconder colunas secundárias

**Ações:**
- ✅ Menu compacto
- ✅ Bottom sheet
- ✅ Modal responsivo

**UX:**
- ✅ Touch friendly
- ✅ Animações leves
- ✅ Feedback visual

**Performance:**
- ✅ Lazy loading
- ✅ Paginação
- ✅ Renderização otimizada

---

## Fluxo recomendado de implementação

### Fase 1 — Estrutura (1-2 dias)

1. ✅ Criar `useBreakpoint` hook
2. ✅ Criar `BottomSheet.jsx` component
3. ✅ Adaptar `Layout.jsx` (sidebar overlay mobile)
4. ✅ Adaptar `Sidebar.jsx` (iniciar fechado em mobile)
5. ✅ Revisar spacing global

### Fase 2 — Listagens (2-3 dias)

6. ✅ Criar `CardView.jsx` component
7. ✅ Criar `ActionMenu.jsx` component
8. ✅ Criar `ResponsiveTable.jsx` wrapper
9. ✅ Adaptar `meusFiis.jsx` para usar ResponsiveTable
10. ✅ Remover scroll horizontal

### Fase 3 — UX (1-2 dias)

11. ✅ Melhorar feedback visual
12. ✅ Adicionar skeleton loading mobile
13. ✅ Ajustar animações
14. ✅ Melhorar navegação
15. ✅ Adaptar modais (fullscreen mobile)

### Fase 4 — Performance (1-2 dias)

16. ✅ Lazy loading
17. ✅ Paginação otimizada
18. ✅ Virtualização (se necessário)
19. ✅ Redução de re-render

### Fase 5 — Replicação (2-3 dias)

20. ✅ Aplicar padrão em outras páginas:
    - `/controle-ativos`
    - `/operacoes`
    - `/rendimentos`
    - `/usuarios`
    - `/seguimentos`
    - `/precificacao`
    - `/relatorios`

---

## Regras obrigatórias para implementação

### O sistema NÃO pode:

- ❌ Ter scroll horizontal no mobile
- ❌ Exigir zoom manual
- ❌ Ter botão pequeno
- ❌ Esconder ação importante
- ❌ Abrir modal desktop gigante
- ❌ Quebrar layout em telas pequenas

### Resultado esperado

O usuário deve conseguir:

- ✅ Visualizar carteira
- ✅ Editar ativos
- ✅ Excluir ativos
- ✅ Abrir detalhes
- ✅ Navegar rapidamente
- ✅ Operar com uma mão
- ✅ Usar o sistema sem zoom

---

## Decisão arquitetural recomendada

### Melhor abordagem para esse projeto

**Desktop:**
- Grid tradicional

**Mobile:**
- Card-based layout

**Ações:**
- Menu compacto + bottom sheet

### Essa é a abordagem usada por:

- Apps bancários
- Apps financeiros
- CRMs modernos
- Dashboards mobile

**Porque funciona.**

Tentar "encaixar tabela desktop no celular" é insistir numa arquitetura errada.

---

## Métricas de Sucesso

### Após implementação, o sistema deve:

#### ✅ Funcionalidade:
- [ ] Todas as ações acessíveis em telas < 768px
- [ ] Sem scroll horizontal em nenhuma página
- [ ] Sidebar funcional em mobile (overlay)
- [ ] Modais adaptados (bottom sheet/fullscreen)

#### ✅ UX:
- [ ] Touch targets ≥ 48px
- [ ] Fontes ≥ 14px
- [ ] Navegação com uma mão
- [ ] Feedback visual em todas as ações

#### ✅ Performance:
- [ ] Lazy loading implementado
- [ ] Skeleton loading em listas
- [ ] Sem re-renders desnecessários
- [ ] Lighthouse Mobile Score > 80

---

## Exemplo Prático: Componente CardView

### Estrutura proposta

```jsx
// components/TableAcoes/CardView.jsx
import React from 'react';
import ActionMenu from './ActionMenu';

const CardView = ({ 
  data, 
  columns,
  onEdit,
  onDelete,
  onView 
}) => {
  return (
    <div className="flex flex-col gap-3 p-4">
      {data.map((item, index) => (
        <div 
          key={index}
          className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg"
        >
          {/* Header do Card */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-bold text-emerald-400">
                {item.ticker}
              </h3>
              <p className="text-sm text-slate-400">
                {item.nomeFundo}
              </p>
            </div>
            <ActionMenu 
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-500">CNPJ:</span>
              <p className="text-slate-200">{item.cnpj}</p>
            </div>
            <div>
              <span className="text-slate-500">Segmento:</span>
              <p className="text-slate-200">{item.nomeSeguimento}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardView;
```

---

## Exemplo Prático: Componente BottomSheet

```jsx
// components/BottomSheet/BottomSheet.jsx
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const BottomSheet = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 rounded-t-2xl z-50 animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <AiOutlineClose className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
```

---

## Exemplo Prático: Componente ActionMenu

```jsx
// components/TableAcoes/ActionMenu.jsx
import React, { useState } from 'react';
import { 
  AiOutlineEye, 
  AiOutlineEdit, 
  AiOutlineDelete,
  AiOutlineMore 
} from 'react-icons/ai';
import BottomSheet from '../BottomSheet/BottomSheet';

const ActionMenu = ({ item, onEdit, onDelete, onView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { 
      icon: AiOutlineEye, 
      label: 'Ver Detalhes', 
      onClick: () => { onView?.(item); setIsOpen(false); },
      color: 'text-cyan-400'
    },
    { 
      icon: AiOutlineEdit, 
      label: 'Editar', 
      onClick: () => { onEdit?.(item); setIsOpen(false); },
      color: 'text-emerald-400'
    },
    { 
      icon: AiOutlineDelete, 
      label: 'Excluir', 
      onClick: () => { onDelete?.(item); setIsOpen(false); },
      color: 'text-red-400'
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-slate-700 rounded-lg transition"
      >
        <AiOutlineMore className="text-slate-400" size={20} />
      </button>

      <BottomSheet 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title={`Ações - ${item.ticker}`}
      >
        <div className="flex flex-col gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center gap-3 p-4 hover:bg-slate-700 rounded-lg transition text-left"
            >
              <action.icon className={action.color} size={20} />
              <span className="text-slate-200">{action.label}</span>
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
};

export default ActionMenu;
```

---

## Exemplo Prático: ResponsiveTable Wrapper

```jsx
// components/TableAcoes/ResponsiveTable.jsx
import React from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import TableAcoes from './TableAcoes';
import CardView from './CardView';

const ResponsiveTable = (props) => {
  const { isMobile } = useBreakpoint();

  return isMobile ? (
    <CardView {...props} />
  ) : (
    <TableAcoes {...props} />
  );
};

export default ResponsiveTable;
```

---

## Prompt final para implementação

Implemente uma adaptação mobile-first completa para o sistema FIITrack de fundos imobiliários.

### Requisitos:

- ✅ Manter grid apenas no desktop
- ✅ Converter listagens em cards no mobile
- ✅ Remover scroll horizontal
- ✅ Implementar breakpoints responsivos
- ✅ Criar menu compacto de ações via ícone ⋮
- ✅ Abrir ações em bottom sheet/modal responsivo
- ✅ Tornar toda interação touch-friendly
- ✅ Adaptar sidebar para menu hamburguer
- ✅ Otimizar performance mobile
- ✅ Implementar skeleton loading
- ✅ Evitar componentes duplicados
- ✅ Usar componentes reutilizáveis e arquitetura escalável
- ✅ Garantir usabilidade total em smartphones

### Priorizar:

- UX mobile
- Clareza visual
- Performance
- Acessibilidade
- Organização das ações
- Simplicidade operacional

**O sistema deve parecer um app moderno e não apenas uma tabela desktop comprimida em uma tela pequena.**

---

## Páginas que precisam de adaptação

### Prioridade Alta (Tabelas complexas)
1. `/cadastros/meusfiis` - Listagem de fundos
2. `/cadastros/usuarios` - Listagem de usuários
3. `/cadastros/seguimentos` - Listagem de segmentos
4. `/controle-ativos` - Controle de ativos
5. `/operacoes` - Operações financeiras
6. `/rendimentos` - Rendimentos

### Prioridade Média (Visualização)
7. `/` - Dashboard (cards já responsivos)
8. `/precificacao` - Precificação
9. `/relatorios` - Relatórios

### Prioridade Baixa (Configurações)
10. `/configuracoes` - Configurações

---

## Checklist Final de Implementação

### Componentes Novos
- [ ] `hooks/useBreakpoint.js`
- [ ] `components/BottomSheet/BottomSheet.jsx`
- [ ] `components/TableAcoes/CardView.jsx`
- [ ] `components/TableAcoes/ActionMenu.jsx`
- [ ] `components/TableAcoes/ResponsiveTable.jsx`

### Componentes Adaptados
- [ ] `components/Layout/Layout.jsx`
- [ ] `components/Sidebar/Sidebar.jsx`
- [ ] `components/TableAcoes/TableAcoes.jsx`
- [ ] `pages/cadastros/meusFundos/meusFiis.jsx`

### Estilos
- [ ] Adicionar classes Tailwind responsivas
- [ ] Adicionar animações mobile (slide-up, fade-in)
- [ ] Ajustar spacing global para mobile
- [ ] Garantir touch targets ≥ 48px

### Testes
- [ ] Testar em iPhone (Safari)
- [ ] Testar em Android (Chrome)
- [ ] Testar rotação de tela
- [ ] Testar gestos (swipe, tap, long-press)
- [ ] Testar performance (Lighthouse)

---

## Recursos Adicionais

### Bibliotecas Recomendadas (Opcional)

**Para gestos avançados:**
```bash
npm install react-swipeable
```

**Para virtualização (listas grandes):**
```bash
npm install react-window
```

**Para animações:**
```bash
npm install framer-motion
```

### Referências de Design

- **Material Design Mobile:** https://m3.material.io/
- **iOS Human Interface Guidelines:** https://developer.apple.com/design/
- **Tailwind Responsive Design:** https://tailwindcss.com/docs/responsive-design

---

## Conclusão

Esta spec fornece um roadmap completo para transformar o FIITrack em uma aplicação mobile-first moderna, mantendo a produtividade do desktop e oferecendo uma experiência excepcional em smartphones.

**Próximo passo:** Criar uma Spec no Kiro e começar a implementação fase por fase.

---

**Documento criado em:** 21/05/2026  
**Versão:** 1.0  
**Autor:** Kiro AI Assistant  
**Projeto:** FIITrack - Sistema de Fundos Imobiliários
