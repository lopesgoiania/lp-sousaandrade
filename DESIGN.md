---
name: Lopes · Sousa Andrade
description: Landing page editorial com abertura cinematográfica, vídeos do entorno e conversão por cadastro.
colors:
  red: '#e8232a'
  red-functional: '#df2029'
  red-hover: '#c71420'
  black: '#0a0a0a'
  ink: '#191919'
  white: '#ffffff'
  gray: '#e9e9e9'
  muted: '#595959'
  line: '#d5d5d5'
  territory: '#fafaf9'
  contact: '#ececeb'
  choice: '#121212'
typography:
  display:
    fontFamily: 'Manrope, sans-serif'
    fontSize: 'clamp(42px, 4.9vw, 76px)'
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: '-.04em'
  body:
    fontFamily: 'DM Sans, sans-serif'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.6
rounded:
  field: '5px'
  button: '6px'
  media: '10px'
  form: '12px'
  beam-card: '14px'
spacing:
  page: 'clamp(24px, 5vw, 88px)'
  page-mobile: '24px'
  page-narrow: '19px'
  card: '42px'
  form: '38px'
components:
  button-primary:
    backgroundColor: '{colors.red-functional}'
    textColor: '{colors.white}'
    rounded: '{rounded.button}'
    padding: '18px 24px'
  choice:
    backgroundColor: '{colors.choice}'
    textColor: '{colors.white}'
    rounded: '{rounded.beam-card}'
    padding: '{spacing.card}'
---

# Lopes · Sousa Andrade

## Overview

As logos, a paleta Lopes e as referências fornecidas são a autoridade visual. O site combina preto profundo, tipografia ampla e superfícies claras. O vídeo de abertura dá escala; o entorno traz lugares reais e situações de uso. Não existe composição raster aprovada como referência pixel a pixel.

## Layout

Container máximo de 1440px. Duas colunas no desktop e empilhamento até 760px. O entorno usa duas fotografias animadas em alturas alternadas, com benefício, texto e CTA sob cada mídia. O shopping lidera e o parque entra deslocado verticalmente. O mapa mantém a alternância entre ilustração conceitual e satélite real.

A VSL precede o entorno: texto introdutório, player amplo, pôster e CTA. Enquanto o usuário não fornecer o vídeo, exibir disponibilidade futura sem simular reprodução. Após configurar a mídia, usar controles nativos e reprodução iniciada pelo visitante.

## Typography

Manrope em títulos, DM Sans na leitura, ambas hospedadas localmente. Títulos usam espaçamento negativo; padrão -.04em, com ajustes por componente. Texto principal de apoio entre 15 e 17px; notas a partir de 12px. Vermelho de marca nos destaques, vermelho funcional nos botões para contraste do texto branco. Campos claros, labels explícitas e foco vermelho.

## Components

Os dois cards de escolha usam o componente original BorderBeam de Libraries.dev, tamanho md, colorful, strength 0.7, theme dark e raio 14px. É a exceção expressamente solicitada ao efeito de luz nas bordas. Preservar links e pré-seleção de interesse no formulário.

### Motion

- Abertura: vídeo controlado por scroll e transição para satélite.
- Seções: entradas únicas com deslocamento de 22px e opacidade (650ms); mídia com abertura de máscara de 3% (850ms); easing cubic-bezier(0.16,1,0.3,1).
- Metragens: contagem única ao entrar em tela, até 29/45, em 1450ms; valor acessível estático no rótulo.
- Loops do entorno: sem som, carregamento ao entrar em tela, pausa fora da tela ou aba oculta, controle manual.
- Beam: ativo somente em tela e com movimento permitido.
- Movimento reduzido: pôster estático, números finais, Beam e entradas desativados.

### States and limitations

O formulário permanece desativado até configurar o CRM. Não há confirmação simulada de lead. VSL e CRM são dependências externas distintas. Datas de lançamento e limites do terreno ainda não estão confirmados; holograma e mapa ilustrado são conceituais.


## Colors

Preto #0A0A0A na abertura; #FAFAF9 no entorno; #121212 nos cards. Vermelho Lopes #E8232A para destaque e #DF2029 para botões com texto branco. Demais tokens no frontmatter.

## Elevation & Depth

Mapa: sombra 0 4px 18px #00000012. CTA móvel: 0 6px 24px #0002. Cards Beam usam o efeito original solicitado; demais containers permanecem planos.

## Shapes

Campos com raio 5px; botões 6px; mídias 10px; formulário 12px; cards Beam 14px. Ícones de linha com traço 1.5 e terminais arredondados.

## Do's and Don'ts

- Preservar marcas, proporções e fatos fornecidos.
- Manter controles de pausa, foco visível e movimento reduzido.
- Não simular cadastro recebido nem reprodução da VSL ausente.
- Não descrever os loops gerados como filmagens reais.
