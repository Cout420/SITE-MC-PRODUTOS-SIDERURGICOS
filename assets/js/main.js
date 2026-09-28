/* ==========================================================================
   MC Produtos Siderúrgicos — interações, conversão e medição
   Sem dependências. Carregado com defer em todas as páginas.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.MC_CONFIG || {};
  var doc = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var session = {
    get: function (k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  window.dataLayer = window.dataLayer || [];
  function track(event, params) {
    var p = params || {};
    p.event = event;
    p.page_path = location.pathname;
    window.dataLayer.push(p);
  }

  doc.classList.add("js");
  requestAnimationFrame(function () { doc.classList.add("is-loaded"); });

  /* ---------- Origem do tráfego (UTM) — guardada na sessão ---------- */
  (function captureSource() {
    var params = new URLSearchParams(location.search);
    var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];
    var found = {};
    keys.forEach(function (k) { if (params.get(k)) found[k] = params.get(k); });
    if (Object.keys(found).length) {
      found.landing_page = location.pathname;
      session.set("mc_src", found);
    } else if (!session.get("mc_src")) {
      session.set("mc_src", { referrer: document.referrer || "direto", landing_page: location.pathname });
    }
  })();

  /* ---------- Toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '<svg class="icon" aria-hidden="true"><use href="/assets/img/icons.svg#i-check"></use></svg><span></span>';
    toastEl.lastChild.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2600);
  }

  /* ---------- Header: sombra, progresso, barra mobile ---------- */
  var header = $(".header");
  var progress = $(".progress span");
  var mobileBar = $(".mobile-bar");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    }
    if (mobileBar) mobileBar.classList.toggle("is-visible", y > 320);
    stepsProgress();
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  /* ---------- Mega menu (desktop) ---------- */
  $$(".nav__item").forEach(function (item) {
    var btn = $(".nav__trigger", item);
    if (!btn) return;
    var close = function () { item.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); };
    var open = function () { item.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); };
    btn.addEventListener("click", function () { item.classList.contains("is-open") ? close() : open(); });
    if (finePointer) {
      var t;
      item.addEventListener("mouseenter", function () { clearTimeout(t); open(); });
      item.addEventListener("mouseleave", function () { t = setTimeout(close, 160); });
    }
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    document.addEventListener("click", function (e) { if (!item.contains(e.target)) close(); });
  });

  /* ---------- Menu mobile ---------- */
  var burger = $(".burger");
  var mnav = $(".mobile-nav");
  function toggleMenu(force) {
    if (!mnav) return;
    var open = typeof force === "boolean" ? force : !mnav.classList.contains("is-open");
    mnav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (burger) burger.setAttribute("aria-expanded", String(open));
    mnav.setAttribute("aria-hidden", String(!open));
    if (open) { var f = $("a", mnav); if (f) f.focus(); }
  }
  if (burger) burger.addEventListener("click", function () { toggleMenu(); });
  $$("[data-close-menu]").forEach(function (b) { b.addEventListener("click", function () { toggleMenu(false); }); });
  if (mnav) $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { toggleMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggleMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = $$("[data-reveal]");
    // Escalonamento automático em grupos
    $$("[data-stagger]").forEach(function (group) {
      var step = parseFloat(group.getAttribute("data-stagger")) || 0.08;
      $$(":scope > [data-reveal]", group).forEach(function (el, i) { el.style.setProperty("--d", (i * step).toFixed(2) + "s"); });
    });
    if (reduced || !("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- H1 palavra por palavra ---------- */
  $$(".split-words").forEach(function (el) {
    if (reduced) return;
    var i = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement("span"); w.className = "w";
            var s = document.createElement("span"); s.textContent = part;
            s.style.transitionDelay = (0.1 + i++ * 0.045).toFixed(3) + "s";
            w.appendChild(s); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains("w")) { walk(n); }
      });
    }
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    walk(el);
    $$(".w", el).forEach(function (w) { w.setAttribute("aria-hidden", "true"); });
  });

  /* ---------- Contadores (o número final já está no HTML para SEO) ---------- */
  function initCounters() {
    var els = $$("[data-count]");
    if (reduced || !("IntersectionObserver" in window)) return;
    var fmt = new Intl.NumberFormat("pt-BR");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target, end = parseFloat(el.getAttribute("data-count")), start = performance.now(), dur = 1600;
        (function tick(now) {
          var p = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - p, 4);
          el.textContent = fmt.format(Math.round(end * e));
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Linha de progresso das etapas ---------- */
  var stepsEl = $(".steps");
  function stepsProgress() {
    if (!stepsEl) return;
    var r = stepsEl.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.min(Math.max((vh * 0.75 - r.top) / (r.height + vh * 0.25), 0), 1);
    stepsEl.style.setProperty("--p", p.toFixed(3));
    var steps = $$(".step", stepsEl);
    steps.forEach(function (s, i) { s.classList.toggle("is-active", p >= (i + 0.35) / steps.length); });
  }

  /* ---------- Cards com inclinação e brilho (apenas mouse) ---------- */
  function initTilt() {
    if (reduced || !finePointer) return;
    $$("[data-tilt]").forEach(function (card) {
      var glare = document.createElement("span"); glare.className = "card__glare"; card.appendChild(glare);
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.transform = "perspective(900px) rotateX(" + ((0.5 - y) * 5).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 6).toFixed(2) + "deg) translateY(-4px)";
        card.style.setProperty("--mx", (x * 100) + "%"); card.style.setProperty("--my", (y * 100) + "%");
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
    // Botões magnéticos
    $$("[data-magnetic]").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.25).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* ---------- Abas ---------- */
  $$("[data-tabs]").forEach(function (tabs) {
    var btns = $$('[role="tab"]', tabs);
    function select(btn, focus) {
      btns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute("aria-selected", String(on));
        b.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(b.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) btn.focus();
    }
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () { select(b); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") select(btns[(i + 1) % btns.length], true);
        if (e.key === "ArrowLeft") select(btns[(i - 1 + btns.length) % btns.length], true);
      });
    });
  });

  /* ---------- FAQ: só um aberto por grupo ---------- */
  $$(".faq[data-single]").forEach(function (faq) {
    $$("details", faq).forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (d.open) {
          $$("details", faq).forEach(function (o) { if (o !== d) o.open = false; });
          track("faq_open", { faq_question: $("summary", d).textContent.trim() });
        }
      });
    });
  });

  /* ---------- WhatsApp, telefone e e-mail ---------- */
  function waLink(text) {
    return "https://wa.me/" + (CFG.whatsapp || "551146107679") + "?text=" + encodeURIComponent(text);
  }
  function defaultWaText() {
    var title = document.title.split("|")[0].trim();
    return "Olá, MC Produtos! Vim pelo site (" + title + ") e gostaria de um orçamento.";
  }
  $$("[data-whatsapp]").forEach(function (a) {
    var custom = a.getAttribute("data-whatsapp");
    a.setAttribute("href", waLink(custom || defaultWaText()));
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
    a.addEventListener("click", function () {
      track("whatsapp_click", { link_location: a.getAttribute("data-loc") || "site" });
    });
  });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href^='tel:'], a[href^='mailto:']");
    if (!a) return;
    track(a.href.indexOf("tel:") === 0 ? "phone_click" : "email_click", { link_location: a.getAttribute("data-loc") || "site" });
  });
  // Dica do botão flutuante aparece uma vez
  var fab = $(".fab");
  if (fab && !store.get("mc_fab_tip", false)) {
    setTimeout(function () { fab.classList.add("show-tip"); setTimeout(function () { fab.classList.remove("show-tip"); }, 5000); store.set("mc_fab_tip", true); }, 6000);
  }

  /* ==========================================================================
     Lista de cotação — o visitante junta itens e envia de uma vez
     ========================================================================== */
  var Quote = {
    key: "mc_quote",
    items: function () { return store.get(this.key, []); },
    save: function (list) { store.set(this.key, list); this.render(); },
    add: function (name, family) {
      var list = this.items();
      var found = list.filter(function (i) { return i.name === name; })[0];
      if (found) found.qty += 1; else list.push({ name: name, family: family || "", qty: 1 });
      this.save(list);
      track("add_to_quote", { item_name: name, item_category: family || "" });
    },
    remove: function (name) { this.save(this.items().filter(function (i) { return i.name !== name; })); },
    setQty: function (name, qty) {
      var list = this.items();
      list.forEach(function (i) { if (i.name === name) i.qty = Math.max(1, parseInt(qty, 10) || 1); });
      store.set(this.key, list);
      this.renderCount();
    },
    clear: function () { this.save([]); },
    asText: function () {
      return this.items().map(function (i) { return "• " + i.name + " — qtd: " + i.qty; }).join("\n");
    },
    renderCount: function () {
      var n = this.items().reduce(function (s, i) { return s + 1; }, 0);
      $$(".quote-count").forEach(function (c) {
        c.textContent = n;
        c.classList.toggle("has-items", n > 0);
        c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
      });
      $$("[data-add-quote]").forEach(function (b) {
        var added = Quote.items().some(function (i) { return i.name === b.getAttribute("data-add-quote"); });
        b.classList.toggle("is-added", added);
        var label = $(".add-quote__label", b);
        if (label) label.textContent = added ? "Na cotação" : "Cotar";
      });
    },
    render: function () {
      this.renderCount();
      var body = $("#quote-drawer-body");
      if (body) {
        var list = this.items();
        if (!list.length) {
          body.innerHTML = '<div class="drawer__empty"><svg class="icon" aria-hidden="true"><use href="/assets/img/icons.svg#i-list"></use></svg><p><strong>Sua lista está vazia.</strong><br>Clique em “Cotar” nos produtos para juntar tudo num único pedido.</p><a class="btn btn--ghost btn--sm" href="/produtos/">Ver produtos</a></div>';
        } else {
          body.innerHTML = "";
          list.forEach(function (i) {
            var row = document.createElement("div"); row.className = "q-item";
            row.innerHTML = '<strong></strong><label class="sr-only">Quantidade</label><input type="number" min="1" inputmode="numeric"><button type="button" aria-label="Remover item"><svg class="icon" aria-hidden="true"><use href="/assets/img/icons.svg#i-trash"></use></svg></button>';
            row.querySelector("strong").textContent = i.name;
            var input = row.querySelector("input"); input.value = i.qty;
            input.addEventListener("change", function () { Quote.setQty(i.name, input.value); });
            row.querySelector("button").addEventListener("click", function () { Quote.remove(i.name); });
            body.appendChild(row);
          });
        }
        $$("[data-quote-needs-items]").forEach(function (b) { b.toggleAttribute("disabled", !list.length); b.classList.toggle("is-disabled", !list.length); });
      }
      // Preenche formulários que exibem a lista
      $$("[data-quote-list]").forEach(function (t) { if (!t.value || t.dataset.autofilled) { t.value = Quote.asText(); t.dataset.autofilled = "1"; } });
    }
  };
  window.MCQuote = Quote;

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-add-quote]");
    if (!b) return;
    e.preventDefault();
    var name = b.getAttribute("data-add-quote");
    if (b.classList.contains("is-added")) { openDrawer(); return; }
    Quote.add(name, b.getAttribute("data-family"));
    toast("Adicionado à lista de cotação");
  });

  var drawer = $("#quote-drawer"), backdrop = $(".drawer-backdrop"), lastFocus;
  function openDrawer() {
    if (!drawer) { location.href = "/orcamento/"; return; }
    lastFocus = document.activeElement;
    Quote.render();
    drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false");
    if (backdrop) backdrop.classList.add("is-open");
    document.body.classList.add("menu-open");
    var c = $(".drawer__close", drawer); if (c) c.focus();
    track("view_quote_list");
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true");
    if (backdrop) backdrop.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    if (lastFocus) lastFocus.focus();
  }
  $$("[data-open-quote]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); openDrawer(); }); });
  $$("[data-close-quote]").forEach(function (b) { b.addEventListener("click", closeDrawer); });
  if (backdrop) backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });
  $$("[data-quote-whatsapp]").forEach(function (b) {
    b.addEventListener("click", function () {
      var items = Quote.items();
      if (!items.length) return;
      var text = "Olá, MC Produtos! Gostaria de cotar os itens abaixo (lista montada no site):\n\n" + Quote.asText() + "\n\nEmpresa / CNPJ:\nCidade de entrega:";
      track("whatsapp_click", { link_location: "lista-cotacao", items: items.length });
      window.open(waLink(text), "_blank", "noopener");
    });
  });
  $$("[data-quote-clear]").forEach(function (b) { b.addEventListener("click", function () { Quote.clear(); }); });

  /* ==========================================================================
     Formulários de lead → RD Station (API de conversões) + webhook + GA4
     ========================================================================== */
  function onlyDigits(s) { return (s || "").replace(/\D/g, ""); }
  function maskPhone(v) {
    var d = onlyDigits(v).slice(0, 11);
    if (d.length <= 2) return d ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }
  function maskCnpj(v) {
    var d = onlyDigits(v).slice(0, 14);
    return d.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  function validCnpj(v) {
    var c = onlyDigits(v);
    if (!c) return true; // opcional
    if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
    var calc = function (len) {
      var sum = 0, pos = len - 7;
      for (var i = len; i >= 1; i--) { sum += c.charAt(len - i) * pos--; if (pos < 2) pos = 9; }
      var r = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      return r === parseInt(c.charAt(len), 10);
    };
    return calc(12) && calc(13);
  }
  $$("input[data-mask='phone']").forEach(function (i) { i.addEventListener("input", function () { i.value = maskPhone(i.value); }); });
  $$("input[data-mask='cnpj']").forEach(function (i) { i.addEventListener("input", function () { i.value = maskCnpj(i.value); }); });

  function fieldError(input, msg) {
    var field = input.closest(".field") || input.parentElement;
    var err = field && $(".field__error", field);
    if (field) field.classList.toggle("is-invalid", !!msg);
    if (err) err.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function validate(scope) {
    var ok = true, first;
    $$("input, select, textarea", scope).forEach(function (el) {
      if (el.type === "hidden" || el.closest(".hp")) return;
      var msg = "";
      var v = (el.value || "").trim();
      if (el.required && el.type === "checkbox" && !el.checked) msg = "Precisamos do seu consentimento para responder.";
      else if (el.required && !v) msg = "Campo obrigatório.";
      else if (v && el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = "Confira o e-mail.";
      else if (v && el.dataset.mask === "phone" && onlyDigits(v).length < 10) msg = "Informe DDD + número.";
      else if (v && el.dataset.mask === "cnpj" && !validCnpj(v)) msg = "CNPJ inválido.";
      if (el.type === "checkbox") { var c = el.closest(".consent"); if (c) c.style.color = msg ? "var(--danger)" : ""; }
      else fieldError(el, msg);
      if (msg) { ok = false; if (!first) first = el; }
    });
    if (first) first.focus();
    return ok;
  }

  function buildPayload(form) {
    var fd = new FormData(form);
    var get = function (k) { return (fd.get(k) || "").toString().trim(); };
    var src = session.get("mc_src") || {};
    var identifier = form.getAttribute("data-conversion") || "contato-site";
    var cityUf = get("cidade").split(/[-\/]/);
    var payload = {
      conversion_identifier: identifier,
      name: get("nome"),
      email: get("email"),
      mobile_phone: get("whatsapp") ? "+55" + onlyDigits(get("whatsapp")) : undefined,
      company_name: get("empresa") || undefined,
      job_title: get("cargo") || undefined,
      city: cityUf[0] ? cityUf[0].trim() : undefined,
      state: cityUf[1] ? cityUf[1].trim() : undefined,
      cf_cnpj: get("cnpj") || undefined,
      cf_produto_de_interesse: get("produto") || undefined,
      cf_quantidade: get("quantidade") || undefined,
      cf_setor: get("setor") || undefined,
      cf_mensagem: (get("mensagem") + (get("lista") ? "\n\nLista:\n" + get("lista") : "")).trim() || undefined,
      cf_pagina_de_origem: location.href,
      traffic_source: src.utm_source || (src.gclid ? "google" : undefined),
      traffic_medium: src.utm_medium || (src.gclid ? "cpc" : undefined),
      traffic_campaign: src.utm_campaign || undefined,
      traffic_value: src.utm_term || undefined,
      available_for_mailing: fd.get("consent") === "on",
      legal_bases: fd.get("consent") === "on" ? [{ category: "communications", type: "consent", status: "granted" }] : undefined
    };
    Object.keys(payload).forEach(function (k) { if (payload[k] === undefined || payload[k] === "") delete payload[k]; });
    return payload;
  }

  function sendLead(payload) {
    var jobs = [];
    if (CFG.rdPublicToken) {
      jobs.push(fetch("https://api.rd.services/platform/conversions?api_key=" + encodeURIComponent(CFG.rdPublicToken), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_type: "CONVERSION", event_family: "CDP", payload: payload })
      }).then(function (r) { if (!r.ok) throw new Error("RD " + r.status); }));
    }
    if (CFG.leadWebhook) {
      jobs.push(fetch(CFG.leadWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead: payload, source: session.get("mc_src"), sent_at: new Date().toISOString() })
      }).then(function (r) { if (!r.ok) throw new Error("Webhook " + r.status); }));
    }
    if (!jobs.length) return Promise.resolve({ offline: true });
    // Basta um destino aceitar para considerar enviado
    return Promise.allSettled(jobs).then(function (res) {
      if (res.some(function (r) { return r.status === "fulfilled"; })) return { offline: false };
      throw new Error("Nenhum destino aceitou o envio");
    });
  }

  function leadToWhatsapp(p) {
    var lines = ["Olá, MC Produtos! Enviei um pedido pelo site:", "", "Nome: " + (p.name || "")];
    if (p.company_name) lines.push("Empresa: " + p.company_name);
    if (p.cf_cnpj) lines.push("CNPJ: " + p.cf_cnpj);
    if (p.city) lines.push("Cidade: " + p.city + (p.state ? "/" + p.state : ""));
    if (p.cf_produto_de_interesse) lines.push("Produto: " + p.cf_produto_de_interesse);
    if (p.cf_quantidade) lines.push("Quantidade: " + p.cf_quantidade);
    if (p.cf_mensagem) lines.push("", p.cf_mensagem);
    return waLink(lines.join("\n"));
  }

  function setStatus(form, type, html) {
    var s = $(".form__status", form);
    if (!s) return;
    s.className = "form__status form__status--" + type + " is-visible";
    s.innerHTML = html;
  }

  $$("form[data-lead-form]").forEach(function (form) {
    var started = false;
    form.addEventListener("input", function () {
      if (!started) { started = true; track("form_start", { form_id: form.getAttribute("data-conversion") }); }
    });

    // Etapas
    var steps = $$(".form-step", form);
    var stepper = $$(".stepper li", form);
    function goto(n) {
      steps.forEach(function (s, i) { s.classList.toggle("is-active", i === n); });
      stepper.forEach(function (s, i) { s.classList.toggle("is-done", i < n); s.classList.toggle("is-current", i === n); });
      form.dataset.step = n;
      var f = steps[n] && $("input, select, textarea", steps[n]); if (f) f.focus({ preventScroll: true });
    }
    if (steps.length) {
      goto(0);
      $$("[data-next]", form).forEach(function (b) {
        b.addEventListener("click", function () {
          var cur = parseInt(form.dataset.step, 10) || 0;
          if (validate(steps[cur])) { goto(cur + 1); track("form_step", { form_id: form.getAttribute("data-conversion"), step: cur + 2 }); }
        });
      });
      $$("[data-prev]", form).forEach(function (b) { b.addEventListener("click", function () { goto((parseInt(form.dataset.step, 10) || 1) - 1); }); });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if ($(".hp input", form) && $(".hp input", form).value) return; // robô
      if (!validate(form)) return;
      var btn = $("button[type='submit']", form);
      if (btn) btn.classList.add("is-loading");
      var payload = buildPayload(form);
      var kind = form.getAttribute("data-kind") || "lead";

      sendLead(payload).then(function (res) {
        track("generate_lead", { form_id: payload.conversion_identifier, lead_type: kind, product: payload.cf_produto_de_interesse || "" });
        if (kind === "catalog") {
          track("catalog_download");
          setStatus(form, "ok", 'Pronto! <a href="' + CFG.catalogUrl + '" target="_blank" rel="noopener" download>Clique aqui para baixar o Catálogo 2026</a>. Também enviamos novidades para o seu e-mail.');
          window.open(CFG.catalogUrl, "_blank", "noopener");
        } else if (res.offline) {
          // Sem integração configurada: o pedido segue pelo WhatsApp para não perder o lead
          setStatus(form, "ok", "Abrimos o WhatsApp com seu pedido já preenchido. É só tocar em enviar.");
          window.open(leadToWhatsapp(payload), "_blank", "noopener");
        } else {
          setStatus(form, "ok", "<strong>Pedido recebido!</strong> Um especialista retorna em horário comercial. Quer agilizar? <a data-whatsapp href='" + leadToWhatsapp(payload) + "' target='_blank' rel='noopener'>Fale agora no WhatsApp</a>.");
        }
        if (form.hasAttribute("data-clears-quote")) Quote.clear();
        form.reset();
        if (steps.length) goto(0);
      }).catch(function () {
        setStatus(form, "err", "Não conseguimos enviar agora. <a href='" + leadToWhatsapp(payload) + "' target='_blank' rel='noopener'>Envie pelo WhatsApp</a> ou ligue <a href='tel:+551146107679'>(11) 4610-7679</a>.");
      }).then(function () { if (btn) btn.classList.remove("is-loading"); });
    });
  });

  // Pré-seleciona produto via ?produto= e preenche lista
  (function prefill() {
    var p = new URLSearchParams(location.search).get("produto");
    if (!p) return;
    $$("select[name='produto']").forEach(function (s) {
      $$("option", s).forEach(function (o) { if (o.value === p || o.textContent === p) s.value = o.value; });
    });
  })();

  /* ==========================================================================
     Consentimento de cookies (LGPD) + Google Consent Mode v2
     O padrão "denied" é definido no <head> de cada página antes do GTM.
     ========================================================================== */
  var CONSENT_KEY = "mc_consent_v1";
  function gtag() { window.dataLayer.push(arguments); }
  function applyConsent(c) {
    gtag("consent", "update", {
      analytics_storage: c.analytics ? "granted" : "denied",
      ad_storage: c.ads ? "granted" : "denied",
      ad_user_data: c.ads ? "granted" : "denied",
      ad_personalization: c.ads ? "granted" : "denied"
    });
    window.dataLayer.push({ event: "consent_update", consent_analytics: !!c.analytics, consent_ads: !!c.ads });
  }
  function loadGTM() {
    if (!CFG.gtmId || window.__gtmLoaded) return;
    window.__gtmLoaded = true;
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtm.js?id=" + CFG.gtmId;
    document.head.appendChild(s);
  }
  var cookie = $("#cookie");
  var saved = store.get(CONSENT_KEY, null);
  if (saved) { applyConsent(saved); }
  // GTM carrega sempre com Consent Mode: sem aceite, as tags rodam sem cookies
  if ("requestIdleCallback" in window) requestIdleCallback(loadGTM, { timeout: 3500 }); else setTimeout(loadGTM, 2500);

  function saveConsent(c) {
    c.ts = Date.now();
    store.set(CONSENT_KEY, c);
    applyConsent(c);
    if (cookie) cookie.classList.remove("is-visible");
  }
  if (cookie) {
    if (!saved) setTimeout(function () { cookie.classList.add("is-visible"); }, 1200);
    $$("[data-consent]", cookie).forEach(function (b) {
      b.addEventListener("click", function () {
        var a = b.getAttribute("data-consent");
        if (a === "all") saveConsent({ analytics: true, ads: true });
        else if (a === "none") saveConsent({ analytics: false, ads: false });
        else if (a === "custom") cookie.classList.add("is-custom");
        else if (a === "save") saveConsent({ analytics: $("#ck-analytics", cookie).checked, ads: $("#ck-ads", cookie).checked });
      });
    });
  }
  $$("[data-cookie-prefs]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      if (!cookie) return;
      var c = store.get(CONSENT_KEY, { analytics: false, ads: false });
      $("#ck-analytics", cookie).checked = !!c.analytics;
      $("#ck-ads", cookie).checked = !!c.ads;
      cookie.classList.add("is-visible", "is-custom");
    });
  });

  /* ---------- Ano no rodapé ---------- */
  $$("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });

  /* ---------- Init ---------- */
  initReveal();
  initCounters();
  initTilt();
  Quote.render();
  onScroll();
})();
