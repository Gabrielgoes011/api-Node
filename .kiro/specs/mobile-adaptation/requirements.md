# Requirements Document

## Introduction

Este documento especifica os requisitos para a adaptação mobile do sistema FIITrack, um sistema de gestão de fundos imobiliários atualmente funcional apenas em desktop. O objetivo é transformar a aplicação em uma solução mobile-first, mantendo a produtividade no desktop e oferecendo experiência excepcional em smartphones.

O sistema atual utiliza React 19.2.4, Vite, Tailwind CSS, e apresenta problemas críticos em dispositivos móveis: tabelas com scroll horizontal, sidebar fixa que quebra o layout, botões de ação muito pequenos (17px), modais não adaptados, e ausência completa de responsividade em telas menores que 768px.

A solução proposta envolve manter o grid tradicional no desktop e converter para layout baseado em cards no mobile, implementar menu compacto de ações com bottom sheet, adaptar a sidebar para overlay em mobile, e tornar todos os modais responsivos (fullscreen ou bottom sheet em mobile).

## Glossary

- **FIITrack_System**: Sistema web de gestão de fundos imobiliários desenvolvido em React
- **Desktop_View**: Visualização em telas maiores que 1024px com layout em grid/tabela
- **Mobile_View**: Visualização em telas menores que 768px com layout em cards
- **Tablet_View**: Visualização em telas entre 769px e 1024px
- **Responsive_Table**: Componente wrapper que alterna entre TableAcoes e CardView baseado no breakpoint
- **CardView**: Componente de visualização em cards para dispositivos móveis
- **ActionMenu**: Menu compacto de ações acessado via ícone ⋮
- **BottomSheet**: Modal que surge da parte inferior da tela, comum em aplicações mobile
- **Sidebar**: Menu lateral de navegação principal do sistema
- **Touch_Target**: Área clicável/tocável de um elemento interativo
- **Breakpoint**: Ponto de quebra de layout responsivo (768px para mobile, 1024px para desktop)
- **Overlay**: Camada sobreposta que cobre o conteúdo principal
- **Skeleton_Loading**: Indicador de carregamento que simula a estrutura do conteúdo
- **Viewport**: Área visível da página no navegador
- **Swipe_Action**: Ação ativada por gesto de arrastar em tela touch

- **Lazy_Loading**: Técnica de carregamento sob demanda de conteúdo
- **Virtualization**: Renderização apenas dos elementos visíveis no viewport
- **Hamburger_Menu**: Ícone de menu (☰) usado para abrir navegação em mobile
- **Backdrop**: Camada escura semi-transparente atrás de modais/overlays
- **Fullscreen_Modal**: Modal que ocupa toda a tela em dispositivos móveis
- **Inline_Styles**: Estilos CSS aplicados diretamente via atributo style
- **Tailwind_Utilities**: Classes utilitárias do framework Tailwind CSS
- **React_Hook**: Função React que permite usar estado e outros recursos
- **JWT_Authentication**: Sistema de autenticação via JSON Web Tokens
- **SQLite_Database**: Banco de dados relacional usado no backend

## Requirements

### Requirement 1: Detecção de Breakpoints Responsivos

**User Story:** Como desenvolvedor, eu quero detectar automaticamente o tipo de dispositivo (mobile/tablet/desktop), para que o sistema possa renderizar a interface apropriada para cada tamanho de tela.

#### Acceptance Criteria

1. THE FIITrack_System SHALL provide a custom React_Hook named useBreakpoint that detects viewport width
2. WHEN the viewport width is less than 768px, THE useBreakpoint hook SHALL return isMobile as true
3. WHEN the viewport width is between 769px and 1024px, THE useBreakpoint hook SHALL return isTablet as true
4. WHEN the viewport width is greater than 1024px, THE useBreakpoint hook SHALL return isDesktop as true
5. WHEN the window is resized, THE useBreakpoint hook SHALL update the breakpoint state within 100ms
6. THE useBreakpoint hook SHALL clean up event listeners when the component unmounts
7. THE useBreakpoint hook SHALL use window.matchMedia for optimal performance instead of resize events

### Requirement 2: Layout Responsivo com Sidebar Adaptável

**User Story:** Como usuário mobile, eu quero que o menu lateral não ocupe espaço fixo na tela, para que eu possa visualizar o conteúdo completo sem obstruções.

#### Acceptance Criteria

1. WHEN isMobile is true, THE Sidebar SHALL render as an overlay with position fixed and z-index 999
2. WHEN isMobile is true, THE Sidebar SHALL initialize in closed state by default
3. WHEN isMobile is false, THE Sidebar SHALL render as a fixed lateral panel with width 250px
4. WHEN the Sidebar is opened in Mobile_View, THE FIITrack_System SHALL display a Backdrop with opacity 0.6
5. WHEN the user clicks the Backdrop, THE Sidebar SHALL close with a smooth transition
6. WHEN the Sidebar state changes, THE transition animation SHALL complete within 300ms
7. THE Hamburger_Menu button SHALL be visible at all times in Mobile_View with minimum Touch_Target of 48px
8. WHEN isMobile is true, THE main content area SHALL have marginLeft of 0px regardless of Sidebar state

9. WHEN isMobile is false, THE main content area SHALL adjust marginLeft based on Sidebar open state (250px or 0px)

### Requirement 3: Conversão de Tabelas para Cards em Mobile

**User Story:** Como usuário mobile, eu quero visualizar dados em formato de cards verticais ao invés de tabelas horizontais, para que eu possa ler informações sem scroll horizontal e com melhor legibilidade.

#### Acceptance Criteria

1. THE FIITrack_System SHALL provide a CardView component that renders data as vertical cards
2. WHEN isMobile is true, THE Responsive_Table SHALL render CardView instead of TableAcoes
3. WHEN isMobile is false, THE Responsive_Table SHALL render TableAcoes with grid layout
4. THE CardView SHALL display each record as a card with background color #0f172a and border color #1e293b
5. THE CardView SHALL display primary information (ticker, name) in the card header with font size minimum 16px
6. THE CardView SHALL display secondary information (quantity, price, yield) in a grid layout with 2 columns
7. THE CardView SHALL include the ActionMenu component in the top-right corner of each card
8. THE CardView SHALL maintain consistent spacing of 12px between cards
9. THE CardView SHALL support the same pagination functionality as TableAcoes
10. THE CardView SHALL display "Nenhum registro encontrado" when data array is empty

### Requirement 4: Menu Compacto de Ações com Bottom Sheet

**User Story:** Como usuário mobile, eu quero acessar ações de cada registro através de um menu compacto, para que eu possa executar operações sem botões pequenos e difíceis de clicar.

#### Acceptance Criteria

1. THE FIITrack_System SHALL provide an ActionMenu component that displays a vertical ellipsis icon (⋮)
2. THE ActionMenu icon SHALL have minimum Touch_Target of 48px in all dimensions
3. WHEN the user taps the ActionMenu icon, THE FIITrack_System SHALL open a BottomSheet with available actions
4. THE BottomSheet SHALL slide up from the bottom of the screen with animation duration of 250ms
5. THE BottomSheet SHALL display a Backdrop with background color rgba(0,0,0,0.6) and backdrop-blur effect
6. THE BottomSheet SHALL occupy between 40% and 60% of the viewport height
7. THE BottomSheet SHALL display action buttons with icons, labels, and minimum height of 48px
8. WHEN the user taps an action button, THE BottomSheet SHALL close and execute the corresponding action
9. WHEN the user taps the Backdrop or close button, THE BottomSheet SHALL close without executing actions
10. THE BottomSheet SHALL display the record identifier (e.g., ticker) in the header
11. THE BottomSheet SHALL support actions: visualizar, editar, excluir, resetar senha, inativar, reativar
12. THE BottomSheet SHALL use color coding: cyan for view, emerald for edit, red for delete, amber for reset

### Requirement 5: Touch-Friendly Interface Elements

**User Story:** Como usuário mobile, eu quero que todos os elementos interativos sejam fáceis de tocar, para que eu possa usar o sistema confortavelmente com meus dedos sem erros de clique.

#### Acceptance Criteria

1. THE FIITrack_System SHALL ensure all interactive elements have minimum Touch_Target of 48px in both width and height
2. THE FIITrack_System SHALL ensure all text inputs have minimum height of 48px
3. THE FIITrack_System SHALL ensure all buttons have minimum height of 48px
4. THE FIITrack_System SHALL use font size minimum 14px for body text in Mobile_View
5. THE FIITrack_System SHALL use font size minimum 16px for input fields in Mobile_View
6. THE FIITrack_System SHALL maintain minimum spacing of 12px between interactive elements
7. THE FIITrack_System SHALL provide visual feedback (color change or scale) within 50ms of touch interaction

8. THE FIITrack_System SHALL prevent accidental double-tap zoom on buttons and interactive elements

### Requirement 6: Modais Responsivos para Mobile

**User Story:** Como usuário mobile, eu quero que modais de formulário ocupem a tela completa ou apareçam como bottom sheet, para que eu possa preencher informações confortavelmente sem elementos pequenos.

#### Acceptance Criteria

1. WHEN isMobile is true, THE FIITrack_System SHALL render form modals as fullscreen overlays
2. WHEN isMobile is true AND the form has less than 5 fields, THE FIITrack_System SHALL render form modals as BottomSheet
3. WHEN isMobile is false, THE FIITrack_System SHALL render form modals as centered dialogs with max-width 500px
4. THE fullscreen modal SHALL include a fixed header with title and close button
5. THE fullscreen modal SHALL include a fixed footer with action buttons (Cancelar, Salvar)
6. THE fullscreen modal content SHALL be scrollable when it exceeds viewport height
7. THE modal close button SHALL have minimum Touch_Target of 48px
8. THE modal action buttons SHALL have minimum height of 48px and full width in Mobile_View
9. WHEN a modal opens, THE FIITrack_System SHALL prevent body scroll
10. WHEN a modal closes, THE FIITrack_System SHALL restore body scroll

### Requirement 7: Eliminação de Scroll Horizontal

**User Story:** Como usuário mobile, eu quero que nenhuma página tenha scroll horizontal, para que eu possa navegar naturalmente apenas com scroll vertical.

#### Acceptance Criteria

1. THE FIITrack_System SHALL ensure no element exceeds viewport width in Mobile_View
2. THE FIITrack_System SHALL set overflow-x hidden on the body element in Mobile_View
3. THE FIITrack_System SHALL wrap or truncate long text content instead of allowing horizontal overflow
4. THE FIITrack_System SHALL use responsive images that scale to container width with max-width 100%
5. THE FIITrack_System SHALL hide non-essential table columns in Mobile_View
6. THE FIITrack_System SHALL replace wide tables with CardView component in Mobile_View
7. WHEN testing on viewport width 320px, THE FIITrack_System SHALL display all content without horizontal scroll

### Requirement 8: Performance Otimizada para Mobile

**User Story:** Como usuário mobile, eu quero que o sistema carregue rapidamente e responda de forma fluida, para que eu possa trabalhar eficientemente mesmo em conexões mais lentas.

#### Acceptance Criteria

1. THE FIITrack_System SHALL implement Lazy_Loading for list items beyond the initial viewport
2. THE FIITrack_System SHALL display Skeleton_Loading placeholders while data is being fetched
3. THE FIITrack_System SHALL limit initial render to maximum 20 items per page in Mobile_View
4. THE FIITrack_System SHALL debounce search input with 300ms delay to reduce re-renders
5. THE FIITrack_System SHALL use React.memo for CardView items to prevent unnecessary re-renders
6. THE FIITrack_System SHALL achieve Lighthouse Mobile Performance Score greater than 80
7. THE FIITrack_System SHALL achieve First Contentful Paint (FCP) less than 2 seconds on 3G connection
8. THE FIITrack_System SHALL achieve Time to Interactive (TTI) less than 4 seconds on 3G connection
9. WHEN scrolling through lists, THE FIITrack_System SHALL maintain frame rate above 50fps
10. THE FIITrack_System SHALL compress and optimize images to maximum 200KB per image

### Requirement 9: Navegação Mobile-First

**User Story:** Como usuário mobile, eu quero navegar pelo sistema facilmente com uma mão, para que eu possa usar o aplicativo em qualquer situação.

#### Acceptance Criteria

1. THE FIITrack_System SHALL position primary navigation elements within thumb reach (bottom 60% of screen)

2. THE Hamburger_Menu button SHALL be positioned in the top-left corner with fixed position
3. THE FIITrack_System SHALL provide visual feedback for all touch interactions within 50ms
4. THE FIITrack_System SHALL support swipe-to-close gesture for Sidebar and BottomSheet
5. THE FIITrack_System SHALL prevent navigation during active touch gestures
6. THE FIITrack_System SHALL maintain scroll position when navigating back to previous page
7. THE FIITrack_System SHALL provide a "back to top" button when user scrolls beyond 2 viewport heights

### Requirement 10: Adaptação de Páginas Prioritárias

**User Story:** Como usuário mobile, eu quero que todas as páginas principais do sistema funcionem perfeitamente em mobile, para que eu possa executar todas as operações necessárias do meu smartphone.

#### Acceptance Criteria

1. THE page /cadastros/meusfiis SHALL render with CardView in Mobile_View displaying ticker, name, CNPJ, and segment
2. THE page /cadastros/usuarios SHALL render with CardView in Mobile_View displaying name, email, role, and status
3. THE page /cadastros/seguimentos SHALL render with CardView in Mobile_View displaying name and description
4. THE page /controle-ativos SHALL render with CardView in Mobile_View displaying asset, quantity, average price, and current value
5. THE page /operacoes SHALL render with CardView in Mobile_View displaying date, type, asset, quantity, and value
6. THE page /rendimentos SHALL render with CardView in Mobile_View displaying date, asset, value, and type
7. THE page / (dashboard) SHALL adapt DataCard components to stack vertically in Mobile_View
8. THE page /precificacao SHALL render with CardView in Mobile_View displaying asset, current price, and variation
9. THE page /relatorios SHALL adapt charts to full width with minimum height 300px in Mobile_View
10. THE page /configuracoes SHALL render form fields with full width and minimum height 48px in Mobile_View

### Requirement 11: Feedback Visual e Estados de Carregamento

**User Story:** Como usuário mobile, eu quero receber feedback visual claro sobre o estado do sistema, para que eu saiba quando ações estão sendo processadas ou quando ocorrem erros.

#### Acceptance Criteria

1. THE FIITrack_System SHALL display Skeleton_Loading with shimmer animation while fetching list data
2. THE FIITrack_System SHALL display a loading spinner centered on screen during authentication
3. WHEN a user submits a form, THE FIITrack_System SHALL disable the submit button and show loading state
4. WHEN an action succeeds, THE FIITrack_System SHALL display a toast notification with success message for 3 seconds
5. WHEN an action fails, THE FIITrack_System SHALL display a toast notification with error message for 5 seconds
6. THE FIITrack_System SHALL use color coding: emerald for success, red for error, amber for warning, cyan for info
7. WHEN a button is pressed, THE FIITrack_System SHALL provide haptic feedback (if supported by device)
8. THE FIITrack_System SHALL display empty state illustrations when lists have no data
9. THE Skeleton_Loading SHALL match the layout structure of the actual content (cards or table rows)

### Requirement 12: Confirmação de Ações Destrutivas

**User Story:** Como usuário mobile, eu quero confirmar ações destrutivas antes de executá-las, para que eu possa evitar exclusões ou alterações acidentais.

#### Acceptance Criteria

1. WHEN the user selects "Excluir" action, THE FIITrack_System SHALL display a confirmation BottomSheet
2. THE confirmation BottomSheet SHALL display the record identifier and a warning message
3. THE confirmation BottomSheet SHALL provide two buttons: "Cancelar" (secondary) and "Excluir" (danger)
4. THE "Excluir" button SHALL use red color (#ef4444) to indicate destructive action
5. THE "Cancelar" button SHALL use neutral color (#64748b) and be positioned on the left
6. WHEN the user confirms deletion, THE FIITrack_System SHALL close the BottomSheet and execute the action
7. WHEN the user cancels, THE FIITrack_System SHALL close the BottomSheet without executing the action

8. THE confirmation dialog SHALL require explicit user action and not auto-dismiss

### Requirement 13: Busca e Filtros Responsivos

**User Story:** Como usuário mobile, eu quero buscar e filtrar dados facilmente em tela pequena, para que eu possa encontrar informações rapidamente sem digitar em campos minúsculos.

#### Acceptance Criteria

1. THE search input SHALL have minimum height of 48px in Mobile_View
2. THE search input SHALL have font size of 16px to prevent auto-zoom on iOS
3. THE search input SHALL display a clear button (X) when text is entered
4. THE search input SHALL show search icon on the left side with color #64748b
5. WHEN the user types in search, THE FIITrack_System SHALL debounce the search with 300ms delay
6. WHEN search results are empty, THE FIITrack_System SHALL display "Nenhum registro encontrado" message
7. THE search input SHALL maintain focus after filtering results
8. THE search input SHALL support clearing via clear button or backspace
9. WHEN search is active, THE FIITrack_System SHALL display result count below the search input

### Requirement 14: Acessibilidade Mobile

**User Story:** Como usuário com necessidades especiais, eu quero que o sistema seja acessível em dispositivos móveis, para que eu possa usar leitores de tela e outras tecnologias assistivas.

#### Acceptance Criteria

1. THE FIITrack_System SHALL provide aria-label attributes for all icon-only buttons
2. THE FIITrack_System SHALL maintain logical tab order for keyboard navigation
3. THE FIITrack_System SHALL provide sufficient color contrast ratio of at least 4.5:1 for text
4. THE FIITrack_System SHALL support screen reader announcements for dynamic content changes
5. THE FIITrack_System SHALL provide focus indicators with 2px outline for all interactive elements
6. THE FIITrack_System SHALL use semantic HTML elements (nav, main, article, button) appropriately
7. THE FIITrack_System SHALL provide alternative text for all images and icons
8. THE FIITrack_System SHALL announce loading states to screen readers via aria-live regions

### Requirement 15: Suporte a Orientação de Tela

**User Story:** Como usuário mobile, eu quero que o sistema funcione tanto em modo retrato quanto paisagem, para que eu possa usar o dispositivo na orientação mais confortável.

#### Acceptance Criteria

1. WHEN device orientation is portrait, THE FIITrack_System SHALL render CardView with single column layout
2. WHEN device orientation is landscape AND viewport width is less than 768px, THE FIITrack_System SHALL render CardView with two column layout
3. WHEN orientation changes, THE FIITrack_System SHALL adjust layout within 300ms
4. THE FIITrack_System SHALL maintain scroll position when orientation changes
5. THE FIITrack_System SHALL close open BottomSheet when orientation changes to landscape
6. THE Sidebar SHALL remain functional in both portrait and landscape orientations
7. THE FIITrack_System SHALL adjust BottomSheet height to 70% of viewport in landscape mode

### Requirement 16: Otimização de Formulários Mobile

**User Story:** Como usuário mobile, eu quero preencher formulários facilmente em tela pequena, para que eu possa cadastrar e editar informações sem frustração.

#### Acceptance Criteria

1. THE FIITrack_System SHALL stack form fields vertically with full width in Mobile_View
2. THE FIITrack_System SHALL use appropriate input types (email, tel, number, date) for mobile keyboards
3. THE FIITrack_System SHALL set autocomplete attributes for common fields (name, email, phone)
4. THE FIITrack_System SHALL display field labels above inputs with font size minimum 14px
5. THE FIITrack_System SHALL display validation errors below the corresponding field with red color
6. THE FIITrack_System SHALL scroll to the first error field when form validation fails
7. THE FIITrack_System SHALL disable form submission while validation is in progress
8. THE FIITrack_System SHALL provide clear visual indication of required fields with asterisk (*)

9. THE FIITrack_System SHALL maintain form state when user navigates away and returns

### Requirement 17: Componentes Reutilizáveis e Arquitetura Escalável

**User Story:** Como desenvolvedor, eu quero componentes reutilizáveis e bem estruturados, para que eu possa manter e expandir o sistema facilmente.

#### Acceptance Criteria

1. THE FIITrack_System SHALL provide a Responsive_Table component that wraps TableAcoes and CardView
2. THE Responsive_Table SHALL accept the same props interface as TableAcoes for backward compatibility
3. THE FIITrack_System SHALL provide a BottomSheet component that can be reused across different features
4. THE BottomSheet component SHALL accept props: isOpen, onClose, title, children
5. THE FIITrack_System SHALL provide an ActionMenu component that can be configured with different actions
6. THE ActionMenu component SHALL accept props: item, actions array, onActionClick callback
7. THE FIITrack_System SHALL provide a CardView component that accepts column configuration
8. THE CardView component SHALL support custom render functions for field values
9. THE FIITrack_System SHALL organize mobile-specific components in dedicated folders
10. THE FIITrack_System SHALL avoid code duplication between desktop and mobile components
11. THE FIITrack_System SHALL use TypeScript interfaces or PropTypes for component props validation

### Requirement 18: Testes de Responsividade

**User Story:** Como desenvolvedor, eu quero garantir que a adaptação mobile funcione corretamente em diferentes dispositivos, para que os usuários tenham experiência consistente.

#### Acceptance Criteria

1. THE FIITrack_System SHALL be tested on viewport width 320px (iPhone SE)
2. THE FIITrack_System SHALL be tested on viewport width 375px (iPhone 12/13)
3. THE FIITrack_System SHALL be tested on viewport width 414px (iPhone 12 Pro Max)
4. THE FIITrack_System SHALL be tested on viewport width 768px (iPad portrait)
5. THE FIITrack_System SHALL be tested on Safari iOS 15+
6. THE FIITrack_System SHALL be tested on Chrome Android 90+
7. THE FIITrack_System SHALL pass Lighthouse Mobile audit with score above 80 for Performance
8. THE FIITrack_System SHALL pass Lighthouse Mobile audit with score above 90 for Accessibility
9. THE FIITrack_System SHALL pass Lighthouse Mobile audit with score above 90 for Best Practices
10. THE FIITrack_System SHALL have no horizontal scroll on any tested viewport width

### Requirement 19: Migração Gradual e Compatibilidade

**User Story:** Como desenvolvedor, eu quero migrar gradualmente para a versão mobile sem quebrar funcionalidades existentes, para que o sistema permaneça estável durante a transição.

#### Acceptance Criteria

1. THE Responsive_Table component SHALL maintain full backward compatibility with existing TableAcoes usage
2. THE FIITrack_System SHALL allow pages to opt-in to mobile adaptation individually
3. THE FIITrack_System SHALL maintain existing Desktop_View functionality without regressions
4. THE FIITrack_System SHALL not require changes to backend APIs or data structures
5. THE FIITrack_System SHALL maintain existing authentication and authorization flows
6. THE FIITrack_System SHALL preserve all existing features (visualizar, editar, excluir, etc.)
7. THE FIITrack_System SHALL maintain existing keyboard shortcuts in Desktop_View
8. THE FIITrack_System SHALL not break existing unit tests for desktop components

### Requirement 20: Documentação e Manutenibilidade

**User Story:** Como desenvolvedor, eu quero documentação clara sobre os componentes mobile, para que eu possa entender e modificar o código facilmente.

#### Acceptance Criteria

1. THE useBreakpoint hook SHALL include JSDoc comments explaining parameters and return values
2. THE BottomSheet component SHALL include usage examples in comments
3. THE CardView component SHALL include prop descriptions and examples
4. THE ActionMenu component SHALL document available action types and their icons
5. THE FIITrack_System SHALL include a README.md file explaining mobile architecture decisions

6. THE FIITrack_System SHALL document breakpoint values and their usage in a central configuration file
7. THE FIITrack_System SHALL include code comments explaining complex responsive logic
8. THE FIITrack_System SHALL maintain a CHANGELOG.md documenting mobile adaptation progress

### Requirement 21: Animações e Transições Mobile

**User Story:** Como usuário mobile, eu quero animações suaves e naturais, para que a interface pareça moderna e responsiva.

#### Acceptance Criteria

1. THE BottomSheet SHALL slide up from bottom with cubic-bezier(0.4, 0, 0.2, 1) easing
2. THE Sidebar SHALL slide in from left with duration 300ms
3. THE Backdrop SHALL fade in with duration 200ms
4. THE CardView items SHALL fade in sequentially with 50ms stagger
5. THE ActionMenu buttons SHALL scale to 0.95 on press with duration 100ms
6. THE FIITrack_System SHALL disable animations when user prefers reduced motion
7. THE FIITrack_System SHALL use CSS transforms instead of position changes for better performance
8. THE FIITrack_System SHALL use will-change property sparingly to optimize rendering

### Requirement 22: Gestão de Estado Mobile

**User Story:** Como usuário mobile, eu quero que o sistema mantenha meu estado de navegação, para que eu não perca contexto ao alternar entre páginas.

#### Acceptance Criteria

1. THE FIITrack_System SHALL preserve scroll position when navigating back from detail pages
2. THE FIITrack_System SHALL preserve search query when navigating back to list pages
3. THE FIITrack_System SHALL preserve pagination state when navigating back to list pages
4. THE FIITrack_System SHALL clear form state when user explicitly cancels or submits
5. THE FIITrack_System SHALL persist Sidebar open/closed preference in localStorage
6. THE FIITrack_System SHALL restore user preferences on page reload
7. THE FIITrack_System SHALL clear sensitive data from state when user logs out

### Requirement 23: Tratamento de Erros Mobile

**User Story:** Como usuário mobile, eu quero mensagens de erro claras e acionáveis, para que eu saiba como resolver problemas.

#### Acceptance Criteria

1. WHEN network request fails, THE FIITrack_System SHALL display error message with retry button
2. WHEN authentication expires, THE FIITrack_System SHALL redirect to login with return URL preserved
3. WHEN form validation fails, THE FIITrack_System SHALL display inline errors below each invalid field
4. WHEN server returns 500 error, THE FIITrack_System SHALL display generic error message without technical details
5. WHEN user is offline, THE FIITrack_System SHALL display offline indicator in top bar
6. THE error messages SHALL use plain language without technical jargon
7. THE error messages SHALL provide actionable next steps when possible
8. THE FIITrack_System SHALL log errors to console for debugging purposes

### Requirement 24: Otimização de Imagens e Assets

**User Story:** Como usuário mobile, eu quero que o sistema carregue rapidamente mesmo em conexões lentas, para que eu possa trabalhar eficientemente.

#### Acceptance Criteria

1. THE FIITrack_System SHALL serve images in WebP format with JPEG fallback
2. THE FIITrack_System SHALL use responsive images with srcset for different screen densities
3. THE FIITrack_System SHALL lazy load images below the fold
4. THE FIITrack_System SHALL compress SVG icons to remove unnecessary metadata
5. THE FIITrack_System SHALL use icon sprites or icon fonts to reduce HTTP requests
6. THE FIITrack_System SHALL implement cache-control headers for static assets
7. THE FIITrack_System SHALL minify CSS and JavaScript bundles for production
8. THE FIITrack_System SHALL use code splitting to load only necessary JavaScript per page

### Requirement 25: Suporte a PWA (Progressive Web App)

**User Story:** Como usuário mobile, eu quero instalar o sistema como um app no meu dispositivo, para que eu possa acessá-lo rapidamente sem abrir o navegador.

#### Acceptance Criteria

1. THE FIITrack_System SHALL provide a valid manifest.json file with app metadata

2. THE manifest.json SHALL include app name, short name, description, icons, and theme color
3. THE FIITrack_System SHALL provide app icons in sizes 192x192 and 512x512
4. THE FIITrack_System SHALL register a service worker for offline functionality
5. THE service worker SHALL cache critical assets (HTML, CSS, JS) for offline access
6. THE FIITrack_System SHALL display install prompt when PWA criteria are met
7. THE FIITrack_System SHALL use standalone display mode to hide browser UI when installed
8. THE FIITrack_System SHALL provide a splash screen with app icon and theme color
9. THE FIITrack_System SHALL handle offline state gracefully with cached data
10. THE FIITrack_System SHALL sync data when connection is restored

### Requirement 26: Segurança Mobile

**User Story:** Como usuário mobile, eu quero que meus dados estejam seguros, para que eu possa usar o sistema com confiança em redes públicas.

#### Acceptance Criteria

1. THE FIITrack_System SHALL enforce HTTPS for all API requests
2. THE FIITrack_System SHALL store JWT_Authentication tokens in httpOnly cookies when possible
3. THE FIITrack_System SHALL implement CSRF protection for state-changing operations
4. THE FIITrack_System SHALL validate and sanitize all user inputs before submission
5. THE FIITrack_System SHALL implement rate limiting for authentication endpoints
6. THE FIITrack_System SHALL clear sensitive data from memory after logout
7. THE FIITrack_System SHALL not log sensitive information (passwords, tokens) to console
8. THE FIITrack_System SHALL implement Content Security Policy headers

### Requirement 27: Internacionalização e Localização

**User Story:** Como usuário brasileiro, eu quero que o sistema use formato de data, moeda e números brasileiros, para que as informações sejam apresentadas de forma familiar.

#### Acceptance Criteria

1. THE FIITrack_System SHALL format dates as DD/MM/YYYY in Mobile_View
2. THE FIITrack_System SHALL format currency as R$ 1.234,56 with Brazilian locale
3. THE FIITrack_System SHALL format percentages as 12,34% with comma as decimal separator
4. THE FIITrack_System SHALL use Portuguese (pt-BR) for all UI text and messages
5. THE FIITrack_System SHALL format large numbers with dot as thousands separator (1.234.567)
6. THE FIITrack_System SHALL display month names in Portuguese (Janeiro, Fevereiro, etc.)
7. THE FIITrack_System SHALL use 24-hour time format (14:30) instead of AM/PM

### Requirement 28: Analytics e Monitoramento Mobile

**User Story:** Como administrador do sistema, eu quero monitorar o uso mobile, para que eu possa identificar problemas e oportunidades de melhoria.

#### Acceptance Criteria

1. THE FIITrack_System SHALL track page views with device type (mobile/tablet/desktop)
2. THE FIITrack_System SHALL track user interactions (button clicks, form submissions)
3. THE FIITrack_System SHALL track errors and exceptions with stack traces
4. THE FIITrack_System SHALL track performance metrics (FCP, LCP, TTI, CLS)
5. THE FIITrack_System SHALL track network requests duration and success rate
6. THE FIITrack_System SHALL respect user privacy and LGPD compliance
7. THE FIITrack_System SHALL allow users to opt-out of analytics tracking
8. THE FIITrack_System SHALL not track personally identifiable information without consent

### Requirement 29: Compatibilidade com Navegadores Mobile

**User Story:** Como usuário mobile, eu quero que o sistema funcione no meu navegador preferido, para que eu não seja forçado a instalar um navegador específico.

#### Acceptance Criteria

1. THE FIITrack_System SHALL support Safari iOS 14+
2. THE FIITrack_System SHALL support Chrome Android 90+
3. THE FIITrack_System SHALL support Firefox Android 90+
4. THE FIITrack_System SHALL support Samsung Internet 14+
5. THE FIITrack_System SHALL use CSS features with appropriate fallbacks for older browsers
6. THE FIITrack_System SHALL polyfill JavaScript features not supported in target browsers
7. THE FIITrack_System SHALL test critical paths on actual devices, not just emulators
8. THE FIITrack_System SHALL display browser compatibility warning for unsupported browsers


### Requirement 30: Modo Escuro Otimizado para Mobile

**User Story:** Como usuário mobile, eu quero que o modo escuro seja otimizado para telas pequenas, para que eu possa usar o sistema confortavelmente em ambientes com pouca luz.

#### Acceptance Criteria

1. THE FIITrack_System SHALL use OLED-friendly pure black (#000000) for backgrounds in dark mode
2. THE FIITrack_System SHALL ensure text contrast ratio of at least 7:1 in dark mode
3. THE FIITrack_System SHALL reduce brightness of white elements to #f8fafc instead of pure white
4. THE FIITrack_System SHALL use emerald accent color (#10b981) consistently in dark mode
5. THE FIITrack_System SHALL apply subtle shadows and borders to separate elements in dark mode
6. THE FIITrack_System SHALL respect system dark mode preference via prefers-color-scheme
7. THE FIITrack_System SHALL persist user dark mode preference in localStorage
8. THE FIITrack_System SHALL transition smoothly between light and dark modes with 200ms duration

## Notes

### Implementation Priority

A implementação deve seguir a ordem de prioridade estabelecida:

**Fase 1 - Estrutura Base (Requisitos 1, 2, 17):**
- Criar hook useBreakpoint para detecção de dispositivo
- Adaptar Layout e Sidebar para overlay mobile
- Estabelecer arquitetura de componentes reutilizáveis

**Fase 2 - Visualização de Dados (Requisitos 3, 4, 7):**
- Criar componente CardView para mobile
- Implementar ActionMenu com BottomSheet
- Eliminar scroll horizontal em todas as páginas

**Fase 3 - UX e Interação (Requisitos 5, 6, 11, 12):**
- Garantir touch targets adequados
- Adaptar modais para mobile
- Implementar feedback visual e confirmações

**Fase 4 - Performance (Requisitos 8, 24):**
- Implementar lazy loading e skeleton loading
- Otimizar imagens e assets
- Melhorar métricas Lighthouse

**Fase 5 - Replicação (Requisito 10):**
- Aplicar adaptação mobile em todas as páginas prioritárias
- Testar fluxos completos em dispositivos reais

### Technical Considerations

**Tailwind CSS:** O projeto já possui Tailwind configurado, o que facilita a implementação de classes responsivas (sm:, md:, lg:). Priorizar uso de utilities Tailwind sobre inline styles.

**React Bootstrap:** Avaliar remoção gradual do React Bootstrap para evitar conflitos com Tailwind e reduzir bundle size.

**Inline Styles:** O código atual usa muitos inline styles. Durante a adaptação mobile, migrar gradualmente para classes Tailwind ou CSS modules para melhor manutenibilidade.

**Performance:** Dispositivos móveis têm menos poder de processamento. Usar React.memo, useMemo e useCallback estrategicamente para evitar re-renders desnecessários.

**Testing:** Priorizar testes em dispositivos reais (iPhone, Android) ao invés de apenas emuladores, pois comportamentos de touch e performance podem diferir significativamente.

### Design System Consistency

Manter consistência com o design system atual:
- **Primary Color:** Emerald (#10b981)
- **Background:** Dark slate (#0f172a, #1e293b)
- **Text:** Light slate (#f8fafc, #cbd5e1, #64748b)
- **Borders:** Slate (#334155, #1e293b)
- **Shadows:** Subtle dark shadows (rgba(0,0,0,0.3))
- **Border Radius:** 8px para cards, 6px para botões
- **Spacing:** Múltiplos de 4px (12px, 16px, 20px, 24px)

### Accessibility Standards

Seguir WCAG 2.1 Level AA:
- Contrast ratio mínimo 4.5:1 para texto normal
- Contrast ratio mínimo 3:1 para texto grande
- Touch targets mínimo 48x48px
- Suporte a navegação por teclado
- Suporte a leitores de tela
- Foco visível em elementos interativos

### Browser Support Matrix

| Browser | Version | Support Level |
|---------|---------|---------------|
| Safari iOS | 14+ | Full Support |
| Chrome Android | 90+ | Full Support |
| Firefox Android | 90+ | Full Support |
| Samsung Internet | 14+ | Full Support |
| Safari iOS | 12-13 | Degraded (fallbacks) |
| Chrome Android | 80-89 | Degraded (fallbacks) |

### Performance Budgets

| Metric | Target | Maximum |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | < 2.5s |
| Largest Contentful Paint | < 2.5s | < 4.0s |
| Time to Interactive | < 3.0s | < 5.0s |
| Total Bundle Size | < 200KB | < 350KB |
| Image Size (per image) | < 100KB | < 200KB |
| Lighthouse Performance | > 85 | > 80 |
| Lighthouse Accessibility | > 95 | > 90 |

