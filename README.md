# Dawn COD Colombia

Tema Shopify baseado no **Dawn 16.0.0**, reconstruído para uma loja **100% colombiana**,
com **pagamento contra entrega (COD)**, formulário do **EasySell** e tráfego frio vindo do **TikTok**.

Todo o conteúdo visível para o cliente está em **espanhol colombiano**.
Esta documentação está em português porque é para você, não para o cliente final.

---

## 1. Instalar o tema

Você precisa do [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) instalado.

```bash
# 1. Clonar este repositório
git clone https://github.com/ayroncosta743-lgtm/shopify-tema.git
cd shopify-tema
git checkout claude/shopify-colombia-tiktok-conversion-lpisbl

# 2. Subir como tema novo (NÃO publica ainda — fica como rascunho)
shopify theme push --unpublished --theme "Dawn COD Colombia"
```

O CLI vai pedir para você fazer login na loja `savenas.store`.

Depois de subir: **Loja online → Temas → Dawn COD Colombia → Visualizar**.
Só publique (`Publicar`) depois de fazer os 6 ajustes da seção 2.

Para editar com preview ao vivo:

```bash
shopify theme dev
```

---

## 2. Os 6 ajustes obrigatórios antes de publicar

Sem esses ajustes o tema funciona, mas com dados de exemplo.

### 2.1 Número do WhatsApp

`Personalizar → Configuração → ⚡ Conversión COD → Botón flotante de WhatsApp`

Troque `573001112233` pelo seu número real.
Formato: **57 + número, sem `+`, sem espaços**. Ex: `573012345678`.

Esse número alimenta 3 lugares: o botão flutuante, o botão na ficha do produto
e o botão de apoio dentro do formulário de pedido.

### 2.2 Instalar e conectar o EasySell

1. Instale o **EasySell COD Form** na App Store da Shopify.
2. No editor de temas, abra a página de produto.
3. Vá na seção **COD · Formulario**.
4. Clique em **Agregar bloque → Apps → EasySell COD Form**.

Pronto. O formulário aparece dentro da moldura vermelha que o tema já desenhou
(com resumo do produto, lista de confiança e botão de WhatsApp em volta).

> Se a sua versão do EasySell não oferecer bloco de app, use o campo
> **Alternativa manual → Código personalizado** na mesma seção e cole o código de inserção.

### 2.3 Desligar o checkout da Shopify

O modo COD já esconde carrinho, busca e botões de pagamento rápido
(`Configuração → ⚡ Conversión COD → Modo pago contra entrega`).

Mas ainda falta o lado do admin:

- `Configurações → Pagamentos` → desative todos os provedores, **exceto**
  `Pagamento manual → Contra entrega (COD)`.
- `Configurações → Checkout` → deixe o telefone como campo obrigatório.

### 2.4 Vídeo do TikTok na página de produto

`Personalizar → Produto → COD · Video de venta`

Suba o mesmo criativo que já está rodando no TikTok (formato vertical 9:16).
É a seção que mais converte com público frio: ele acabou de ver o vídeo e
quer confirmar que o produto é real.

A portada da home (`COD · Portada`) também aceita vídeo de fundo.

### 2.5 Trocar os depoimentos

As reseñas que vêm no tema são **exemplos e precisam ser substituídas**.

`Personalizar → Produto → COD · Testimonios`

Use prints reais de WhatsApp, fotos que clientes te mandaram, comentários do TikTok.
Cada bloco aceita foto do cliente, estrelas, texto, nome e cidade.

> Inventar depoimento é propaganda enganosa. Na Colômbia a **SIC**
> (Superintendencia de Industria y Comercio) multa por isso.

### 2.6 Conferir os prazos e a garantia

- `COD · Entrega` (bloco na ficha do produto): hoje está **1 a 4 dias úteis**.
- `COD · Garantía`: hoje está **30 dias**.

Ajuste para o que a sua transportadora realmente cumpre.

---

## 3. Como a página de produto está montada

É uma landing page de conversão, não uma ficha de produto comum.
A ordem foi montada para quebrar objeção de tráfego frio, de cima para baixo:

| # | Seção | O que faz |
|---|-------|-----------|
| 1 | `COD · Contador` | Urgência logo no topo |
| 2 | Ficha do produto | Preço grande, selos COD, escassez, tallas, botão |
| 3 | `COD · Confianza` | 4 garantias em ícones |
| 4 | `COD · Video de venta` | O criativo do TikTok, prova visual |
| 5 | `COD · Beneficios` | Por que comprar de você |
| 6 | `COD · Testimonios` | Prova social |
| 7 | `COD · Cómo comprar` | Mostra que pedir leva 1 minuto |
| 8 | **`COD · Formulario`** | **Onde o EasySell entra — o ponto de conversão** |
| 9 | `COD · Garantía` | Tira o risco |
| 10 | `COD · Comparativa` | Você vs. as outras páginas |
| 11 | `COD · Preguntas` | Últimas objeções |
| 12 | `COD · Barra fija` | Botão de pedir sempre visível |

Dentro da ficha do produto (bloco 2), os blocos são:

`título → COD · Precio → COD · Insignias → COD · Urgencia → tallas →
botão de pedir → WhatsApp → COD · Entrega → COD · Argumentos → COD · Garantía → descrição`

Todos podem ser reordenados ou removidos no editor, arrastando.

### O botão principal

Por padrão ele **não adiciona ao carrinho**: ele rola a página até o formulário COD
e já coloca o cursor no primeiro campo.

Para mudar: `Produto → bloco Botones de compra → ⚡ Contra entrega → Qué hace el botón principal`.

---

## 4. Seções disponíveis

Todas aparecem no editor com o prefixo `COD ·` e podem ser usadas em qualquer página.

| Seção | Uso |
|-------|-----|
| `COD · Portada` | Capa com vídeo/imagem de fundo, preço e um botão só |
| `COD · Contador` | Contagem regressiva (diária, data fixa ou por visitante) |
| `COD · Deslizante` | Faixa preta com mensagens em movimento |
| `COD · Confianza` | Tira de garantias com ícones |
| `COD · Beneficios` | Cards de benefício |
| `COD · Cómo comprar` | Passo a passo numerado |
| `COD · Testimonios` | Depoimentos com foto e estrelas |
| `COD · Preguntas` | FAQ sanfona |
| `COD · Garantía` | Selo de garantia + texto |
| `COD · Comparativa` | Tabela você vs. concorrência |
| `COD · Video de venta` | Vídeo vertical, quadrado ou horizontal |
| `COD · Urgencia` | Estoque + visitantes ao vivo + contador |
| `COD · Formulario` | Moldura do formulário EasySell |
| `COD · Barra fija` | Barra de compra fixa no rodapé |

Quase toda seção tem um campo **`O desplazar hasta (selector CSS)`**.
Coloque `#CodOrderForm` nele e o botão leva direto ao formulário, sem recarregar a página.

---

## 5. Cores e tipografia

`Personalizar → Configuração → ⚡ Conversión COD → Colores de conversión`

| Variável | Padrão | Onde aparece |
|----------|--------|--------------|
| Principal | `#E5322D` vermelho | Botões, preço, urgência |
| Contraste | `#FFFFFF` | Texto dentro dos botões |
| Acento | `#FFD233` amarelo | Destaques e realces |
| Confiança | `#16A34A` verde | Selos COD, garantias, checks |

Os 5 esquemas de cor do tema (`Configuração → Colores`):

1. Branco — conteúdo principal
2. Cinza claro — seções alternadas
3. Preto — capa e faixa deslizante
4. Vermelho — barra de anúncio e selos de oferta
5. Verde — confiança

Tipografia: **Poppins** (títulos em peso 700, corpo em 400), títulos a 115%.

---

## 6. Escassez e urgência — leia antes de configurar

O tema traz contador, barra de estoque e contador de visitantes.
Eles vêm configurados de forma **conservadora e honesta** de propósito:

- A barra de estoque usa, por padrão, o **inventário real da Shopify**
  (`Origen de los datos → Inventario real`).
- O contador está no modo **diário**, que reinicia de verdade toda meia-noite.
- O contador de visitantes é uma **estimativa visual** que varia dentro do intervalo
  que você definir — não é telemetria real.

Na Colômbia, anunciar desconto falso, prazo falso ou estoque falso é sancionado pela
**SIC** sob a **Ley 1480 de 2011 (Estatuto del Consumidor)**. O contador de visitantes
é o item mais frágil juridicamente: se não quiser esse risco, desligue-o em
`COD · Urgencia → Mostrar contador de visitantes`.

Também há um modal anti-abandono, **desligado por padrão**:
`Configuração → ⚡ Conversión COD → Anti-abandono`.

---

## 7. Páginas que você ainda precisa criar

O tema traz o template, mas o conteúdo é seu. Em `Loja online → Páginas`:

| Página | Template | Obrigatória? |
|--------|----------|--------------|
| Preguntas frecuentes | `page.faq` | Recomendada |
| Política de privacidad | `page` | **Sim** (lei colombiana) |
| Términos y condiciones | `page` | **Sim** |
| Política de envíos y devoluciones | `page` | **Sim** |
| Contacto | `page.contact` | Recomendada |

Ponha todas no menu do rodapé (`Navegação → Footer menu`).
A Shopify tem geradores prontos em `Configurações → Políticas`.

---

## 8. Estrutura dos arquivos novos

```
assets/
  cod-theme.css              Sistema visual (1.169 linhas)
  cod-theme.js               Web components de conversão

sections/
  cod-hero.liquid            cod-testimonials.liquid
  cod-countdown-bar.liquid   cod-faq.liquid
  cod-marquee.liquid         cod-guarantee.liquid
  cod-trust-bar.liquid       cod-comparison.liquid
  cod-benefits.liquid        cod-video.liquid
  cod-steps.liquid           cod-urgency.liquid
  cod-order-form.liquid      cod-sticky-buy-bar.liquid

snippets/
  cod-icon.liquid            Biblioteca de 22 ícones SVG
  cod-stars.liquid           cod-countdown.liquid
  cod-whatsapp-button.liquid cod-exit-intent.liquid
  cod-product-price.liquid   cod-product-badges.liquid
  cod-product-urgency.liquid cod-product-checklist.liquid
  cod-product-delivery.liquid cod-product-guarantee.liquid
  cod-product-cta.liquid
```

Arquivos do Dawn que foram modificados:

- `layout/theme.liquid` — variáveis COD, assets, classes no `<body>`, WhatsApp
- `sections/main-product.liquid` — 7 blocos novos
- `snippets/buy-buttons.liquid` — botão que rola até o formulário
- `config/settings_schema.json` — grupo `⚡ Conversión COD`
- `config/settings_data.json` — paleta e valores padrão
- `locales/es.default.json` — espanhol virou o idioma padrão do tema

### Componentes JavaScript

| Tag | O que faz |
|-----|-----------|
| `<cod-countdown>` | Contagem regressiva nos 3 modos |
| `<cod-sticky-bar>` | Mostra a barra quando o botão sai da tela |
| `<cod-live-count>` | Número de visitantes que varia |
| `<cod-stock-bar>` | Anima a barra de estoque ao entrar na tela |

Todos respeitam `prefers-reduced-motion` e funcionam sem `localStorage`
(navegação anônima não quebra nada).

---

## 9. Verificar antes de publicar

```bash
shopify theme check
```

Estado atual: **0 erros**, 9 avisos — todos herdados do Dawn original
(complexidade de Liquid e snippets órfãos do tema base).

Checklist final:

- [ ] WhatsApp trocado pelo número real
- [ ] Bloco do EasySell adicionado na seção `COD · Formulario`
- [ ] Todos os provedores de pagamento desativados, menos COD
- [ ] Vídeo do TikTok subido
- [ ] Depoimentos de exemplo substituídos por reais
- [ ] Prazo de entrega conferido com a transportadora
- [ ] Páginas de política criadas e no menu do rodapé
- [ ] Testado no celular (é de onde vem 95% do tráfego do TikTok)

---

## Licença

Baseado no [Dawn](https://github.com/Shopify/dawn), MIT. Veja `LICENSE.md`.
