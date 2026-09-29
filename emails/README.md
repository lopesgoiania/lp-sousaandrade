# Régua de relacionamento — n8n

Arquivos completos de HTML com CSS inline e tabelas de apresentação. Usar no campo HTML do nó de envio em modo Expression, preservando as expressões n8n. Destinatário: `{{ $json.body.email }}`. Nome vem de `$json.body.nome`, escapado para HTML. Links usam encodeURIComponent para preservar nomes e e-mails com caracteres especiais.

1. Imediato — 01-acesso-confirmado.html. Assunto: Seu acesso prioritário está confirmado.
2. D+3 — 02-o-conceito.html. Assunto: Inteligência no espaço. Visão no investimento.
3. D+8 — 03-confirmacao-prioritaria.html. Assunto: O próximo passo pede a sua confirmação.

Domínio definitivo aplicado: `https://lancamentosousaandrade.com.br`. Ativar o domínio e o certificado HTTPS na Vercel antes dos disparos. Os logos usam URL absoluta desse domínio. O link de descadastro usa `https://n8n.marketinglopes.com.br/webhook/descadastro?email={{ encodeURIComponent($json.body.email) }}`. Processar a supressão no n8n antes de disparar cada etapa. Preservar body.nome/body.email após Wait e demais nós; remetente e credenciais são configurados no n8n.

D+8 não afirma data, escassez ou abertura já ocorrida: estas informações não foram confirmadas. Se a mensagem comunicar a abertura real, condicionar o disparo ao marco comercial confirmado, não somente a oito dias. O e-mail 2 não promete retorno financeiro.

Fontes seguem Manrope/DM Sans com fallback Arial: clientes de e-mail podem não disponibilizar as fontes locais do site. Não há JavaScript nem dependência de CSS externo. Validar envio de prova no Gmail/Outlook antes da campanha; renderização em navegador não substitui clientes reais.

Nenhum workflow ou disparo real foi criado. Os arquivos estão fora de dist e não são publicados pela landing page.
