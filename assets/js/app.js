/* =========================================================
   Adventure Dog – Serre-Chevalier
   JavaScript sans dépendance externe : navigation, modales, formulaire.
   ========================================================= */

(() => {
  'use strict';

  const services = {
    balade: {
      kicker: 'Sortie douce',
      title: 'Balade 1 heure',
      price: '20 €',
      image: 'assets/images/balade.webp',
      description: "Une promenade d'une heure pour offrir au chien de l'air, du mouvement et une présence attentive, sans transformer chaque sortie en expédition himalayenne.",
      bullets: [
        'Idéal pour les chiens calmes, jeunes, seniors ou en reprise.',
        'Parcours adapté à la météo, au tempérament et au niveau de fatigue.',
        'Laisse obligatoire en ville et gestion attentive des croisements.',
        'Nouvelles possibles après la sortie.'
      ]
    },
    randonnee: {
      kicker: 'Grand air',
      title: 'Randonnée montagne',
      price: '45 €',
      image: 'assets/images/randonnee.webp',
      description: "Une vraie sortie montagne pour les chiens à l'aise avec l'effort, les chemins, les odeurs, les copains et cette grande absurdité magnifique qu'on appelle la pente.",
      bullets: [
        'Rythme adapté, pauses, hydratation et surveillance de la fatigue.',
        'Liberté en montagne uniquement si le rappel est excellent.',
        'Lecture permanente de l’environnement : météo, troupeaux, autres chiens, terrain.',
        'Parfait pour les chiens sportifs et sociables.'
      ]
    },
    'demi-journee': {
      kicker: 'Demi-journée',
      title: 'Demi-journée',
      price: '35 €',
      image: 'assets/images/demi-journee.webp',
      description: "Un format souple qui combine activité, présence et repos. Pratique quand les humains ont décidé d'aller skier, travailler ou pratiquer une autre activité très importante sans leur chien.",
      bullets: [
        'Temps de présence élargi avec sortie adaptée.',
        'Compatible avec chiots selon âge, vaccination et énergie.',
        'Moments de calme prévus pour éviter la surstimulation.',
        'Organisation selon profil et habitudes du chien.'
      ]
    },
    journee: {
      kicker: 'Journée complète',
      title: 'Journée',
      price: '60 €',
      image: 'assets/images/journee.webp',
      description: "Une journée complète pensée pour que le chien vive une vraie parenthèse en montagne, entre activité, surveillance, repos et sociabilité maîtrisée.",
      bullets: [
        'Sortie principale adaptée au niveau du chien.',
        'Présence, surveillance et temps de récupération.',
        'Photos ou nouvelles possibles pendant la garde.',
        'Option deuxième chien : +10 €.'
      ]
    },
    nuit: {
      kicker: 'Garde au domicile',
      title: 'Nuit',
      price: '90 €',
      image: 'assets/images/nuit.webp',
      description: "Une garde de nuit au domicile, dans un cadre familial, calme et rassurant. Le chien dort, les humains respirent, et l'univers continue vaguement de tourner.",
      bullets: [
        'Accueil au domicile selon compatibilité avec les deux chiens de la maison.',
        'Respect des habitudes de couchage et de repas.',
        'Carnet de vaccination et identification obligatoires.',
        'Forfaits semaine possibles sur demande.'
      ]
    }
  };

  const selectors = {
    header: '.site-header',
    progress: '.progress-bar',
    loader: '#loader',
    reveal: '.reveal, .reveal-logo',
    pawScroll: '.paw-scroll',
    modal: '#serviceModal',
    modalCard: '.modal-card',
    modalTitle: '#modalTitle',
    modalKicker: '#modalKicker',
    modalImage: '#modalImage',
    modalDescription: '#modalDescription',
    modalList: '#modalList',
    modalPrice: '#modalPrice',
    form: '#reservationForm',
    formStatus: '#formStatus'
  };

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  const setYear = () => {
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  };

  const initLoader = () => {
    const loader = $(selectors.loader);
    if (!loader) return;
    const hide = () => loader.classList.add('is-hidden');
    window.addEventListener('load', () => window.setTimeout(hide, 450), { once: true });
    window.setTimeout(hide, 2200);
  };

  const initScrollState = () => {
    const header = $(selectors.header);
    const progress = $(selectors.progress);
    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (header) header.classList.toggle('scrolled', scrollY > 42);
      if (progress) progress.style.width = maxScroll > 0 ? `${(scrollY / maxScroll) * 100}%` : '0%';
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  const initSmoothAnchors = () => {
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const target = $(anchor.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const paw = $(selectors.pawScroll);
    const adventures = $('#aventures');
    if (paw && adventures) {
      paw.addEventListener('click', () => adventures.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  };

  const initReveal = () => {
    const elements = $$(selectors.reveal);
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((el, index) => {
      el.style.animationDelay = `${Math.min(index * 45, 220)}ms`;
      observer.observe(el);
    });
  };

  const initModal = () => {
    const modal = $(selectors.modal);
    if (!modal) return;

    const modalCard = $(selectors.modalCard, modal);
    const title = $(selectors.modalTitle, modal);
    const kicker = $(selectors.modalKicker, modal);
    const image = $(selectors.modalImage, modal);
    const description = $(selectors.modalDescription, modal);
    const list = $(selectors.modalList, modal);
    const price = $(selectors.modalPrice, modal);
    let previousFocus = null;

    const openModal = (serviceKey) => {
      const service = services[serviceKey];
      if (!service) return;

      previousFocus = document.activeElement;
      title.textContent = service.title;
      kicker.textContent = service.kicker;
      image.src = service.image;
      image.alt = service.title;
      description.textContent = service.description;
      price.textContent = service.price;
      list.innerHTML = service.bullets.map((item) => `<li>${item}</li>`).join('');

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      window.setTimeout(() => modalCard?.focus(), 50);
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    };

    $$('[data-open-service]').forEach((button) => {
      button.addEventListener('click', () => openModal(button.dataset.openService));
    });

    $$('[data-close-modal]', modal).forEach((button) => button.addEventListener('click', closeModal));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  };

  const initFaq = () => {
    const details = $$('#faq details');
    details.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        details.forEach((other) => {
          if (other !== item) other.removeAttribute('open');
        });
      });
    });
  };

  const initGalleryLightbox = () => {
    const lightbox = $('#galleryLightbox');
    const image = $('#lightboxImage');
    const caption = $('#lightboxCaption');
    if (!lightbox || !image || !caption) return;

    const open = (figure) => {
      const img = $('img', figure);
      const figcaption = $('figcaption', figure);
      if (!img) return;
      image.src = img.src;
      image.alt = img.alt || '';
      caption.textContent = figcaption ? figcaption.textContent : '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    };

    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    };

    $$('[data-lightbox]').forEach((figure) => {
      figure.setAttribute('tabindex', '0');
      figure.setAttribute('role', 'button');
      figure.setAttribute('aria-label', 'Voir la photo en plein écran');
      figure.addEventListener('click', () => open(figure));
      figure.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open(figure);
        }
      });
    });

    $$('[data-close-lightbox]').forEach((button) => button.addEventListener('click', close));
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('is-open')) close();
    });
  };

  const formDataToObject = (form) => {
    const data = new FormData(form);
    const payload = {};
    data.forEach((value, key) => {
      if (key !== 'siteWeb') payload[key] = String(value).trim();
    });
    payload.dateEnvoi = new Date().toISOString();
    payload.source = 'Site Adventure Dog – Serre-Chevalier';
    return payload;
  };

  const buildMailto = (payload) => {
    const config = window.ADVENTURE_DOG_CONFIG || {};
    const email = config.contactEmail || 'fouchyelias@gmail.com';
';
    const subject = encodeURIComponent(`Demande de réservation Adventure Dog – ${payload.prestation || 'Prestation'}`);
    const body = encodeURIComponent([
      `Nom : ${payload.nom || ''}`,
      `Email : ${payload.email || ''}`,
      `Téléphone : ${payload.telephone || ''}`,
      `Chien : ${payload.chien || ''}`,
      `Profil : ${payload.profil || ''}`,
      `Prestation : ${payload.prestation || ''}`,
      `Date souhaitée : ${payload.date || ''}`,
      `Deuxième chien : ${payload.deuxiemeChien || ''}`,
      '',
      'Message :',
      payload.message || ''
    ].join('\n'));
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const initForm = () => {
    const form = $(selectors.form);
    const status = $(selectors.formStatus);
    if (!form || !status) return;

    const setStatus = (message, isError = false) => {
      status.textContent = message;
      status.style.color = isError ? '#ffe0d8' : '#f8f5ef';
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (form.siteWeb && form.siteWeb.value) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        setStatus('Merci de compléter les champs obligatoires.', true);
        return;
      }

      const payload = formDataToObject(form);
      const config = window.ADVENTURE_DOG_CONFIG || {};
      const endpoint = "https://script.google.com/macros/s/AKfycbxmv9RLi3QIlJm86oF3aDQoicXigKN7u4JWqkHDG7hYQXRY6KIBsVgm71hHpbrBEEfr9g/exec";
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Envoi en cours…';

      try {
        if (endpoint) {
          await fetch(endpoint, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
          });
          setStatus('Demande envoyée. Une confirmation automatique va être transmise par email. Le progrès, parfois, existe.');
          form.reset();
        } else {
          window.location.href = buildMailto(payload);
          setStatus("Le connecteur Google Apps Script n'est pas encore renseigné. Une demande email a été préparée automatiquement.");
        }
      } catch (error) {
        console.error(error);
        window.location.href = buildMailto(payload);
        setStatus("L'envoi automatique a échoué. Une demande email a été préparée à la place.", true);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Envoyer la demande';
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    setYear();
    initLoader();
    initScrollState();
    initSmoothAnchors();
    initReveal();
    initModal();
    initFaq();
    initGalleryLightbox();
    initForm();
  });
})();
