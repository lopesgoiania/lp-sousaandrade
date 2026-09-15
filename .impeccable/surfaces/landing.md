# Landing page — direção desta implementação

Modo: Persuade. Público: interessados em morar ou investir em compactos na região do Flamboyant. Ação: cadastro de nome/telefone para atendimento distribuído pelo CRM.

## Contrato de direção

FIRST VIEWPORT: uma Terra cinematográfica grande à direita, fundo preto, chamada branca à esquerda com o destaque vermelho “aqui”, marca Lopes no cabeçalho, menção Sousa Andrade no texto e CTA de cadastro visível antes do scroll. Desktop 1440; celular 390. A versão móvel conserva a leitura do texto sobre o globo.

Interação principal: vídeo Higgsfield controlado pelo progresso do scroll, seguido de crossfade à imagem real de satélite fornecida. Após a VSL, a seção do entorno traz mapa editorial gerado com base nessa referência, alternável para o satélite. Textos permanecem em HTML. O mapa ilustrado é explicitamente conceitual.

Sequência: descoberta → VSL → entorno com loops e mapa → compactos e volumetria conceitual → interesse em moradia/investimento → marcas → formulário. A volumetria wireframe separada não representa arquitetura oficial nem delimitação do lote.

Mundo visual: preto #0A0A0A, branco #FFFFFF, cinzas #333333/#E9E9E9 e vermelho Lopes #E8232A. Manrope para títulos e DM Sans para leitura, fontes locais. Vermelho funcional #DF2029 para texto branco com contraste adequado. Poucos containers; mapa amplo, tipografia dominante, respiro editorial; dois blocos de escolha e formulário com cantos suaves.

Construção direta em código conforme autorização para começar, com os assets Higgsfield solicitados. Nenhuma composição raster da interface foi aprovada como referência pixel a pixel; avaliação é sobre este contrato e referências do usuário.

Limitações deliberadas: CRM indefinido, submissão indisponível até endpoint real configurado; datas não confirmadas e omitidas; mapa/holograma conceituais. Não publicar promessa de rentabilidade, prazo de contato ou unidades restantes.

Verificar: responsividade, ausência de overflow, leitura, carregamento de mídia, alternância mapa/satélite, CTAs/interesse, movimento reduzido e validação/sucesso/erro com endpoint interceptado de teste. Nenhum lead real deve ser enviado durante QA.

## Revisão de 15/09

Inserida VSL antes do entorno, aguardando arquivo do usuário. Entorno agora usa dois loops gerados no Higgsfield a partir das fotografias fornecidas, composição alternada e benefícios com CTAs. Cards usam o BorderBeam original via React, conforme preset enviado. Contagem 29/45 e motion sutil de entrada solicitados. Movimento reduzido e pausa fora da tela são obrigatórios.
