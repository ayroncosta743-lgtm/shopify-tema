# Shrine PRO · Español Colombia

Tema **Shrine PRO 1.2.0** da loja [savenas.store](https://savenas.store),
traduzido e adaptado para **espanhol da Colômbia**.

Esta documentação está em português porque é para você. Tudo que o cliente
vê está em espanhol.

---

## O que foi traduzido

### 1. Idioma do tema (`locales/es.json`)

O tema trazia 334 chaves em espanhol e 440 em inglês. As 106 que faltavam
caíam no fallback em inglês — apareciam assim para o cliente, principalmente
no **checkout** e na **conta do cliente**.

Agora são **440 de 440**. Entre as que faltavam:

| Onde aparecia em inglês | Agora |
|---|---|
| `Secure Checkout` | Pago seguro |
| `Complete Purchase` | Finalizar compra |
| `Shipping method` | Método de envío |
| `Shipping Address` | Dirección de envío |
| `Email or Phone` | Correo o celular |
| `Confirm Shipping Selection` | Confirmar el envío |

Também foram traduzidas as mensagens de pontos de recolha, cartões-presente,
assinaturas, erros de envio e a conta do cliente.

Vocabulário colombiano: **celular** (não "móvil"), **pedido** (não "orden"),
**carrito** (não "cesta"), **número de guía** para o rastreio, tratamento por
**tú**.

### 2. Conteúdo dos templates

O tema veio com o conteúdo de demonstração de uma loja de **joias**
(EFFEMIN — colares, ouro 18k, peças à prova d'água). Como a loja vende
**tênis**, o texto não foi só traduzido: foi adaptado ao produto.

| Antes | Agora |
|---|---|
| `ALL OUR JEWELRY IS WATERPROOF` | ENVÍO GRATIS A TODA COLOMBIA |
| `FREE SHIPPING WORLDWIDE` | PAGO CONTRA ENTREGA |
| `BUY 2 ITEMS, GET A FREE CLOVER NECKLACE` | LLEVA 2 PARES Y AHORRA EN EL SEGUNDO |
| Texto sobre ouro 18k e PVD | Materiais do tênis: capellada, sola antiderrapante, costuras reforçadas |
| Texto sobre joia à prova d'água | Garantia de 30 dias e uso diário |
| `Free Shipping Worldwide` + taxas alfandegárias | Envio grátis na Colômbia + pagamento contra entrega |

Foram 129 substituições em 18 arquivos.

### 3. Swatches de cor

O mapa `swatches_predefined_colors` só tinha nomes em inglês
(`Black`, `White`…). Seus produtos usam **Negro** e **Blanco**, então
**os swatches não encontravam a cor**.

O mapa agora tem os nomes em espanhol (incluindo `Vinotinto`, `Café`,
`Nude`, `Camel`, `Celeste`) e mantém os em inglês, para funcionar com
qualquer nomenclatura de variante.

---

## O que NÃO foi alterado

- **Nenhum arquivo `.liquid`.** A tradução foi toda em `locales/` e nos
  templates JSON. O código do tema está intacto.
- **O tema publicado.** O trabalho foi aplicado num duplicado.

---

## Erros pré-existentes do tema

O `shopify theme check` acusa **10 erros**, todos do Shrine PRO original,
nenhum causado pela tradução:

| Arquivo | Erro |
|---|---|
| `layout/password.liquid` | `assets/global.js` não existe (o export não trouxe) |
| `sections/email-signup-banner.liquid` | Propriedade `templates` inválida no schema |
| `sections/main-product.liquid` | Erro de sintaxe na tag `render` |
| `snippets/card-product.liquid` | Erro de sintaxe na tag `assign` |
| `sections/track-order.liquid` | Script bloqueante (17track) |
| `snippets/aliexpress_reviews.liquid` | Script bloqueante (app de reseñas) |
| `snippets/cjpod.liquid` | Modificação de `content_for_header` |

Não mexi neles: é um tema pago e são coisas do autor ou dos apps.
O `global.js` faltando pode quebrar a página de senha — vale conferir
se ele existe no tema que está na loja (o export pode só não tê-lo incluído).

---

## Como subir

O tema já está aplicado em **Shrine PRO · Español Colombia** na loja,
como rascunho. Para subir este zip do zero:

**Loja online → Temas → Adicionar tema → Carregar arquivo zip**

Ele entra como rascunho e não substitui o que está no ar.

---

## Verificar

```bash
shopify theme check
```

Esperado: 10 erros (os da tabela acima) e 92 avisos, todos do tema original.
