# Sousa Andrade / Lopes — Flamboyant

Landing page estática em português, com mídia gerada no Higgsfield e direção de design Impeccable. O conteúdo publicado está em `dist/`; briefing e materiais originais permanecem na raiz.

## Executar localmente

```sh
node server.mjs
```

Abrir `http://127.0.0.1:4173`. Requer Node.js, sem compilar para visualizar a saída já gerada. Para reconstruir os cards React, instalar as dependências com pnpm install e executar pnpm build. O servidor de prévia suporta HTTP Range para navegação no vídeo. Fontes e assets utilizados são locais.

## CRM

O cadastro está desativado de forma explícita até a definição da integração. Não há armazenamento de leads, envio para WhatsApp direto nem confirmação simulada.

Em `dist/config.js`, definir `leadEndpoint` para um endpoint HTTPS que aceite POST JSON. O endpoint deve validar os dados, proteger credenciais no servidor, limitar abuso, tratar duplicidade e encaminhar o lead ao CRM. Configurar CORS para a origem do site quando necessário. Nunca colocar tokens de CRM em `config.js`.

Payload: `name`, `phone` normalizado como `+55DDDNUMERO`, `interest` opcional, `consent`, `consentText`, `source`, e `attribution` com UTMs presentes. Não são enviados dados para análises de terceiros por padrão.

O servidor deve responder com status 2xx e `{ "success": true }` somente quando o cadastro for aceito. O frontend então mostra sucesso e dispara `lead:accepted` sem dados pessoais. Em erro ou timeout de 15 segundos, preserva os campos para nova tentativa. A distribuição entre corretores pertence ao CRM.

## Conteúdo e mídia

- `dist/index.html`: seções, textos e formulário.
- `dist/styles.css`: identidade e responsividade.
- `dist/app.js`: sincronização vídeo/scroll, mapa, wireframe conceitual e formulário.
- `dist/config.js`: URLs públicas de mídia e endpoint de cadastro.
- `PRODUCT.md`: fatos confirmados e decisões em aberto.
- `Contexto/pipeline.md`: pipeline acordado.

As datas de lançamento não estão confirmadas. A imagem ilustrada e o volume wireframe são conceituais. Dados de área/quantidade vieram do briefing e precisam de confirmação comercial antes de tráfego público. A localização do pin foi fornecida pelo usuário; os limites do lote não foram validados.

## Validação

Revisão visual desktop (1440 px) e celular (390 px), com capturas complementares de chegada, mapa e formulário. Testes de navegador verificam CTAs, seleção de interesse, alternância do mapa, ausência de erros JavaScript e modo de movimento reduzido. Fluxo de formulário testado com endpoint interceptado localmente: dados inválidos não enviados, falha preserva campos, sucesso exige resposta positiva, telefone normalizado e UTMs preservadas. Integração real com CRM permanece pendente.

## Atualização de VSL e movimento

O usuário fornecerá a VSL. Configurar `presentationVideo` em `dist/config.js` para o arquivo de vídeo, e `presentationCaptions` opcional para um arquivo WebVTT. Enquanto ausente, exibe apresentação em breve. Os loops de shopping/parque foram gerados no Higgsfield a partir das fotos fornecidas; possuem controles de pausa e param fora da tela.

`src/choices.jsx` usa o pacote original `border-beam` com React. `scripts/build.mjs` gera `dist/assets/choices.js`, mantendo o restante da página em HTML/CSS/JS. Os links dos cards continuam funcionais se a melhoria React não carregar.
