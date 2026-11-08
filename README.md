# QAXDTS - Testes Automatizados com Playwright

Este repositório contém a suíte de testes automatizados para validação de qualidade de interface com foco em acessibilidade, segurança e responsividade.

## Visão geral

O projeto utiliza:

- Playwright
- TypeScript
- Allure Reports
- Navegador Chromium
- Base URL do site em produção: https://www.weltonsantos.com.br

## Estrutura do projeto

```text
QAXDTS/
├── tests/
│   ├── accessibility.spec.ts
│   ├── example.spec.ts
│   ├── responsive.spec.ts
│   └── security.spec.ts
├── allure-results/
├── allure-report/
├── test-results/
├── package.json
├── playwright.config.ts
├── README.md
└── docs/
    └── responsive-testing.md
```

## Pré-requisitos

- Node.js 18+
- npm
- Navegador Chromium disponível via Playwright

## Instalação

```bash
npm install
npx playwright install --with-deps chromium
```

## Execução dos testes

### Executar a suíte completa

```bash
npx playwright test
```

### Executar apenas a suíte responsiva

```bash
npx playwright test tests/responsive.spec.ts
```

### Executar em modo interativo

```bash
npx playwright test --ui
```

### Gerar relatório de execução

```bash
npx playwright show-report
```

## Relatórios

Os resultados da execução são salvos em:

- `allure-results/` - artefatos utilizados pelo Allure
- `test-results/` - screenshots e evidências gerais
- `allure-report/` - relatório HTML gerado

## Configuração principal

A configuração está centralizada em `playwright.config.ts` e define:

- diretório de testes: `./tests`
- base URL: `https://www.weltonsantos.com.br`
- navegador: Chromium
- modo: headless desativado
- screenshots apenas em falhas
- trace e vídeo retidos em falhas

## Cobertura de testes responsivos

A suíte em `tests/responsive.spec.ts` valida as principais dimensões de tela e comportamento visual em diferentes resoluções.

### Resoluções testadas

- Desktop Full HD: 1920x1080
- Desktop: 1366x768
- Notebook: 1280x720
- Tablet: 768x1024
- Mobile: 390x844
- Mobile Small: 320x568

### Casos cobertos

1. Carregamento do site em todas as resoluções
2. Verificação de scroll horizontal
3. Validação de imagens responsivas
4. Detecção de elementos fora da viewport
5. Verificação da visibilidade do menu em mobile
6. Checagem de textos e transbordamento
7. Verificação de botões e elementos interativos em mobile
8. Screenshot do layout em tablet
9. Screenshot do layout em mobile
10. Geração de evidências em todas as resoluções

## Observações

- A suíte é projetada para validar o comportamento visual em diferentes tamanhos de viewport.
- Os logs de console são usados para registrar cada resolução testada e possíveis inconsistências.
- Screenshots são gerados para documentação visual e revisão manual.

## Documentação complementar

Consulte a documentação detalhada dos testes responsivos em [docs/responsive-testing.md](docs/responsive-testing.md).
