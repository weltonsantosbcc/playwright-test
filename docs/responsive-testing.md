# Documentação dos Testes Responsivos

## Objetivo

Validar se a interface do site permanece funcional, legível e visualmente estável em diferentes resoluções de tela, desde desktops até dispositivos móveis.

## Escopo

A suíte de testes responsivos cobre as seguintes dimensões:

| Nome do dispositivo | Largura | Altura |
| --- | ---: | ---: |
| Desktop Full HD | 1920 | 1080 |
| Desktop | 1366 | 768 |
| Notebook | 1280 | 720 |
| Tablet | 768 | 1024 |
| Mobile | 390 | 844 |
| Mobile Small | 320 | 568 |

## Casos de teste

### 01 - Verificar carregamento em todas as resoluções

- Ajusta a viewport para cada resolução
- Acessa a página inicial
- Confirma que o corpo da página está visível
- Registra sucesso por dispositivo

### 02 - Verificar scroll horizontal

- Mede a largura da viewport e da página
- Garante que o conteúdo não ultrapasse a largura disponível
- Identifica overflow horizontal em um layout responsivo

### 03 - Verificar imagens responsivas

- Obtém todas as imagens da página
- Verifica se cada uma possui largura válida
- Confirma que a imagem não excede a área visível da tela

### 04 - Verificar elementos fora da viewport

- Busca todos os elementos do body
- Filtra aqueles com largura maior que zero e posicionamento fora do viewport
- Registra possíveis elementos que extrapolam a área visível

### 05 - Verificar visibilidade do menu

- Define a resolução mobile
- Acessa a página
- Confere se o elemento `nav` existe e se está visível

### 06 - Verificar textos e transbordamento

- Coleta elementos de texto (`h1`, `h2`, `h3`, `p`)
- Compara `scrollWidth` com `clientWidth`
- Falha se houver texto transbordando a largura disponível

### 07 - Verificar botões em mobile

- Navega em viewport mobile
- Coleta elementos interativos como botões, inputs e links
- Confirma que existem elementos clicáveis na interface

### 08 - Verificar layout tablet

- Define viewport de tablet
- Acessa a página
- Captura screenshot para revisão visual

### 09 - Verificar layout mobile

- Define viewport mobile
- Acessa a página
- Captura screenshot para revisão visual

### 10 - Gerar evidências de todas as resoluções

- Itera por todas as resoluções
- Gera screenshots completos da página para cada dispositivo
- Salva os arquivos em `test-results/`

## Observações técnicas

- O teste usa `page.setViewportSize()` para simular o dispositivo.
- A validação é feita diretamente no DOM por meio de `evaluate()`.
- As evidências visuais ajudam na análise de layouts quebrados ou overflow.

## Resultados esperados

A página deve:

- carregar em todas as resoluções;
- não apresentar scroll horizontal desnecessário;
- manter imagens dentro da viewport;
- manter textos legíveis sem transbordamento;
- preservar acessibilidade e usabilidade em mobile;
- manter o layout consistente em tablets e desktops.

## Arquivos relevantes

- [../tests/responsive.spec.ts](../tests/responsive.spec.ts)
- [../playwright.config.ts](../playwright.config.ts)

## Como executar

```bash
npx playwright test tests/responsive.spec.ts
```

Os screenshots gerados ficam em:

```text
test-results/
```
