> **Integração atual (substitui o fluxo n8n → CRM descrito historicamente abaixo):** formulário → `/api/leads` → CRM e n8n em requisições independentes. A Vercel publica a função de `api/leads.js` além dos arquivos estáticos. O servidor local também atende essa rota e lê `.env.local`.
>
> Configure `CRM_WEBHOOK_URL` e `N8N_WEBHOOK_URL` em Vercel → Settings → Environment Variables. `.env.example` contém os destinos fornecidos, também usados como padrões no servidor. Não há token adicional indicado na documentação recebida. Após alterações de ambiente, faça novo deploy.
>
> CRM recebe name, phone (55 + DDD + número, apenas dígitos), email, message e utm_campaign quando presente. n8n recebe o payload original em português e metadados. A captura não documenta o corpo de resposta do CRM: o adaptador considera HTTP 2xx sem erro explícito. n8n exige 2xx e success:true.
>
> O frontend confirma e registra generate_lead somente após ambos aceitarem. Na mesma página, repetir dados idênticos após falha parcial tenta apenas o destino não confirmado. Isso não garante deduplicação após reload, mudança de dados ou timeout de resultado desconhecido; deduplicação durável pertence aos destinos. Não encaminhar novamente o n8n ao CRM, pois isso duplicaria o lead.
>
> Validação com fetch simulado, sem leads reais. Cadastrar lead de homologação e conferir ambos os destinos continua necessário para validação ponta a ponta.

# Sousa Andrade / Lopes — Flamboyant

Landing page estática em português, com mídia gerada no Higgsfield e direção de design Impeccable. O conteúdo publicado está em `dist/`; briefing e materiais originais permanecem na raiz.

## Executar localmente

```sh
node server.mjs
```

Abrir `http://127.0.0.1:4173`. Requer Node.js, sem compilar para visualizar a saída já gerada. Para reconstruir os cards React, instalar as dependências com pnpm install e executar pnpm build. O servidor de prévia suporta HTTP Range para navegação no vídeo. Fontes e assets utilizados são locais.

## CRM

O cadastro está desativado de forma explícita até a definição da integração. Não há armazenamento de leads, envio para WhatsApp direto nem confirmação simulada.

Em `dist/config.js`, definir `n8nWebhookUrl` para um endpoint HTTPS que aceite POST JSON. O endpoint deve validar os dados, proteger credenciais no servidor, limitar abuso, tratar duplicidade e encaminhar o lead ao CRM. Configurar CORS para a origem do site quando necessário. Nunca colocar tokens de CRM em `config.js`.

Payload: `nome`, `telefone` normalizado como `+55DDDNUMERO`, `email`, `empreendimento`, `lead_intent` (`morar`, `investir` ou `nao_informado`), `consent`, `consentText`, `source`, `landing_page`, `arrived_at`, `submitted_at`, e `attribution` com UTMs, gclid, gbraid e wbraid preservados na sessão. Não são enviados dados para análises de terceiros por padrão.

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

A VSL usa dois vídeos distintos: sGRuxlxNnD4 (horizontal) e iPDSv4ugkNQ (vertical). A versão vertical é selecionada até 760px ou em tablets até 1024px em orientação retrato. Após iniciar, a versão permanece estável durante a reprodução, mesmo ao girar o dispositivo. As capas locais estão configuradas em `vslThumbnailHorizontal` e `vslThumbnailVertical`. O player e a API YouTube só carregam após o clique; autoplay nunca ocorre por scroll. Progresso usa a YouTube IFrame Player API, com marcos únicos por carregamento/reprodução. Bloqueio de autoplay mantém o play nativo disponível.

Os loops de shopping/parque foram gerados no Higgsfield a partir das fotos fornecidas; possuem controles de pausa e param fora da tela.

`src/choices.jsx` usa o pacote original `border-beam` com React. `scripts/build.mjs` gera `dist/assets/choices.js`, mantendo o restante da página em HTML/CSS/JS. Os links dos cards continuam funcionais se a melhoria React não carregar.

## Mensuração e atribuição

`dist/conversion.js` envia eventos à fila `window.dataLayer`, sem instalar GTM/GA4 ou enviar dados pessoais à mensuração. Eventos: hero_cta_click, vsl_play, vsl_25, vsl_50, vsl_75, vsl_complete, location_interaction, lead_intent_morar, lead_intent_investir, form_start, form_submit e generate_lead. A integração das tags/IDs de Google Ads e GA4 permanece a configurar no GTM.

`vsl_play` representa o clique de início; os marcos representam a posição real informada pela API (não tempo de permanência na página). `form_start` ocorre na primeira interação, `form_submit` em cada tentativa sem envio concorrente, e `generate_lead` exclusivamente depois de 2xx com success:true. Não usar o clique ou form_submit como conversão de lead. Page location não inclui query strings; nome, telefone e e-mail ficam exclusivamente no payload do endpoint CRM.

SessionStorage preserva intenção, chegada e atribuição ao navegar/recarregar na mesma sessão. Se indisponível, os valores permanecem em memória durante a página. Novos parâmetros recebidos atualizam suas respectivas chaves. Nenhuma automação n8n, WhatsApp ou e-mail foi criada.

O total de unidades foi omitido por divergência; quantidades por tipologia do briefing foram preservadas. Não deduzir um novo total sem confirmação.

## Ajustes incrementais de mídia e localização

Os loops ambientais atuais são derivados dos MP4 fornecidos em `VIDEOS LOOPING/`: 8s, 1280×720, H.264, sem áudio, faststart. Carregam ao entrar na viewport, repetem sem controles e pausam fora dela/aba oculta. Com preferência por movimento reduzido, mostram o poster. Posters são extraídos dos novos vídeos.

A visualização ilustrada foi removida. `locationSatellite` e `locationSatelliteSmall` recebem a nova imagem corrigida; `googleMapsUrl` deve conter exclusivamente o link oficial fornecido. Enquanto não configurados, não mostrar o antigo pin nem inventar coordenadas. O clique configurado abre nova aba com noopener/noreferrer e enfileira `maps_click` com source `location_section`.

Validação incremental: Chrome desktop e viewport mobile, reprodução em loop, carregamento sob demanda, pausa fora da tela, ausência de controles, destaques e overflow. Safari/macOS, Safari/iPhone e Chrome/Android em aparelhos reais ainda não foram verificados neste ambiente.

## Publicação na Vercel

Importe o repositório com a raiz do projeto como Root Directory (não selecione `dist`). Configuração já declarada em `vercel.json`:

- Framework Preset: Other.
- Node.js: 24.x.
- Install Command: `pnpm install --frozen-lockfile`.
- Build Command: `pnpm build`.
- Output Directory: `dist`.

O gerenciador é fixado em `package.json`. Mantenha `pnpm-lock.yaml` e `pnpm-workspace.yaml` no repositório. `dist` contém também os arquivos-fonte estáticos e deve ser versionada integralmente; o build apenas recompila as ilhas React. Não apagar `dist` antes de compilar. Não é necessário rodar `server.mjs` em produção: a Vercel serve os arquivos estáticos.

O deploy não exige variáveis de ambiente no estado atual. CRM, Google Maps e mensuração continuam dependendo de configuração real; publicar não ativa essas integrações. Não inserir credenciais privadas em `dist/config.js`. A API do CRM deve autorizar a origem final do domínio via CORS quando aplicável.

Depois do deploy, conferir vídeos, formulário, imagens e YouTube no domínio final. A política de cache revalida assets sem hash para não manter versões antigas. `.vercelignore` evita enviar materiais brutos pelo CLI; somente `dist` é publicado como site. Não foram criadas funções, redirects ou automações.

## Fluxo n8n

O navegador envia somente para `n8nWebhookUrl` em `dist/config.js` (a definir). O nome do empreendimento é fixo em `empreendimento`, pois esta página divulga um único projeto. Não há campo comercial extra.

Fluxo previsto: formulário → webhook de produção n8n → CRM, Supabase e regras de e-mail no n8n. Não existe envio paralelo do navegador ao CRM. O endpoint CRM fornecido deve ser configurado no nó HTTP Request do n8n:

`https://api.100bug.app/webhook/leads/9452e285-8aac-4255-90b1-2fd770075473`

O contrato desse CRM ainda precisa ser confirmado no workflow; o frontend não presume o formato esperado pelo CRM. Nenhuma requisição de teste foi enviada ao endereço real.

Configurar o Webhook n8n para POST, aceitar Content-Type application/json e permitir CORS para o domínio da landing page (incluindo preflight OPTIONS quando necessário). Usar Respond to Webhook para devolver HTTP 2xx e `{ "success": true }` após aceitação efetiva/durável do cadastro. Respostas genéricas como “Workflow was started” não confirmam um lead e não disparam generate_lead. Erros devem devolver status de falha. Não aguardar campanhas de e-mail para responder; o frontend possui timeout de 15 segundos.

O JSON inclui nome, email, telefone, empreendimento e preserva lead_intent, atribuição, datas, origem e consentimento existentes. O consentimento atual é de contato sobre o empreendimento; não representa autorização adicional criada pelo site para newsletters genéricas. Credenciais e regras ficam no n8n. Reenvios após timeout devem ser tratados pelo workflow para evitar duplicidades.

## Produção n8n e confirmação VIP

Webhook principal configurado: https://n8n.marketinglopes.com.br/webhook/captura-site-codex . O formulário está habilitado; o endpoint continua devendo responder 2xx com `{"success":true}` após receber o lead. CORS deve autorizar o domínio publicado. Não foram enviados leads de teste ao webhook real.

`/confirmacao-vip` aponta para `dist/confirmacao-vip.html` na Vercel. `vipWebhookUrl` em config.js ainda contém `URL_WEBHOOK_CLICKUP`: substituir pelo webhook secundário HTTPS para habilitar a ação. A página lê nome/email da URL como texto não confiável, valida presença e formato e envia POST JSON {nome,email} apenas ao clique. Exige também 2xx com success:true para mostrar confirmação; erros permitem repetir sem recarregar. Links incompletos não enviam. Não usa tags de analytics e aplica no-referrer/noindex. Os parâmetros não autenticam identidade: o workflow deve validar o contato e tratar repetições.

E-mails e instruções da régua estão em `emails/README.md`. O prazo de contato “em instantes” requer operação de atendimento compatível.

Domínio definitivo: `https://lancamentosousaandrade.com.br`. Configurar o domínio na Vercel e o DNS no provedor; os e-mails já usam HTTPS.
