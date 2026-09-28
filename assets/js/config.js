/* ==========================================================================
   Configuração central do site — edite apenas este arquivo para integrar.
   ========================================================================== */
window.MC_CONFIG = {
  // Contato (fonte: Google, certificado ISO e LinkedIn)
  whatsapp: "551146107679",
  phone: "+551146107679",
  email: "vendas@mcprodutos.com.br",

  // RD Station Marketing — API de conversões (token PÚBLICO da conta RD).
  // RD Station > Conta > Integrações > Token público. Vazio = envio desativado.
  rdPublicToken: "",

  // Endpoint próprio opcional (webhook do n8n/Make/Zapier ou função serverless)
  // recebe o mesmo JSON enviado ao RD. Vazio = desativado.
  leadWebhook: "",

  // Google Tag Manager (contêiner atual). GA4 e Ads ficam dentro do GTM.
  // Consent Mode v2 é aplicado antes do carregamento (ver consent em main.js).
  gtmId: "GTM-ND9KVHL4",

  // Caminho do catálogo servido pelo próprio site (liberado após o cadastro)
  catalogUrl: "/assets/docs/MC-Catalogo-2026-web.pdf",

  // Link para avaliações no Google
  googleReviewsUrl: "https://www.google.com/maps/search/MC+Produtos+Sider%C3%BArgicos+Aruj%C3%A1"
};
