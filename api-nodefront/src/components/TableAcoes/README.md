# TableAcoes - Componente Universal de Tabela

Um componente React simplificado e universal para exibir tabelas com funcionalidades básicas de busca, paginação e ações.

## Funcionalidades

- ✅ Exibição de dados em tabela
- ✅ Busca/filtragem simples
- ✅ Paginação automática
- ✅ Ações básicas (visualizar, editar, excluir)
- ✅ Exportação para Excel
- ✅ Responsivo com Bootstrap

## Propriedades Básicas

```tsx
import { TableAcoes } from './components/TableAcoes';

const dados = [
  { id: 1, nome: 'João', email: 'joao@email.com', dataCadastro: '2024-01-01' },
  { id: 2, nome: 'Maria', email: 'maria@email.com', dataCadastro: '2024-01-02' }
];

const colunas: ITabela[] = [
  { titulo: 'ID', acesso: 'id', width: '10%' },
  { titulo: 'Nome', acesso: 'nome', width: '30%' },
  { titulo: 'Email', acesso: 'email', width: '40%' },
  { titulo: 'Data Cadastro', acesso: 'dataCadastro', width: '20%' }
];

<TableAcoes
  coluna={colunas}
  data={dados}
  itemsPerPage={10}
  labelpesquisa="Buscar usuários..."
  usaExportar={true}
  nomeArquivoExcel="usuarios"
  usaVisualizar={true}
  acaoVisualizar={(row) => console.log('Visualizar:', row)}
  usaEditar={true}
  acaoEditar={(row) => console.log('Editar:', row)}
  usaExcluir={true}
  acaoExcluir={(row) => console.log('Excluir:', row)}
/>
```

## Interface ITabela

```tsx
interface ITabela {
  titulo: string;      // Título da coluna
  acesso: string;      // Nome da propriedade no objeto de dados
  width?: string;      // Largura opcional da coluna
  align?: string;      // Alinhamento (left, center, right)
  truncate?: boolean;  // Truncar texto longo
  sticky?: boolean;    // Coluna fixa
}
```

## Dependências

- react-bootstrap
- xlsx
- react-icons
- @types/react-bootstrap (opcional)

## Funcionalidades Avançadas (Comentadas)

O componente tem algumas funcionalidades avançadas comentadas que podem ser implementadas futuramente:

- Modal de confirmação para ações
- Impressão personalizada
- Paginação avançada
- Drag and drop de colunas

Para implementar essas funcionalidades, descomente o código relevante e crie os componentes auxiliares necessários.