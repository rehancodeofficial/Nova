/**
 * Nova Fresh International — Master Application Logic
 * International Sourcing & Market Development
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Mobile Navigation Drawer Toggle
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 2. Interactive Role Tab Switcher in Inquiry Form
  // ------------------------------------------------------------------------
  const tabSupplier = document.getElementById('tab-supplier');
  const tabBuyer = document.getElementById('tab-buyer');
  const tabGeneral = document.getElementById('tab-general');
  const formTitle = document.getElementById('form-title');
  const formSubtitle = document.getElementById('form-subtitle');
  const inquiryTypeInput = document.getElementById('inquiry_type');
  const inquiryMessage = document.getElementById('inquiry-message');
  const labelProductInterest = document.getElementById('label-product-interest');

  const roleConfigs = {
    supplier: {
      title: 'Tell Us About Your Product',
      subtitle: 'Share details about your production, export origins, and target international markets.',
      placeholder: 'Please describe your products, current harvest/processing volume, export origins, and target buyer markets...',
      productLabel: 'Product / Crop Sourcing Category *',
      typeValue: 'Supplier / Exporter Inquiry'
    },
    buyer: {
      title: "Tell Us What You're Looking For",
      subtitle: 'Specify your product requirements, required volumes, delivery timelines, and target destinations.',
      placeholder: 'Please describe the products you are seeking to source, required specifications, volume needs, and timeline...',
      productLabel: 'Required Product / Supply Category *',
      typeValue: 'Buyer / Importer Sourcing Inquiry'
    },
    general: {
      title: 'Get in Touch with Nova Fresh',
      subtitle: 'Have a specific commercial inquiry, inspection request, or partnership opportunity? Let us know.',
      placeholder: 'How can Nova Fresh International assist your international trade operations?',
      productLabel: 'Area of Interest / Opportunity *',
      typeValue: 'General / Partnership Inquiry'
    }
  };

  function setInquiryRole(role) {
    const config = roleConfigs[role] || roleConfigs.supplier;

    // Toggle active classes on tab buttons
    [tabSupplier, tabBuyer, tabGeneral].forEach(tab => {
      if (tab) {
        const isMatch = tab.getAttribute('data-role') === role;
        tab.classList.toggle('active', isMatch);
        tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      }
    });

    // Update text content
    if (formTitle) formTitle.textContent = config.title;
    if (formSubtitle) formSubtitle.textContent = config.subtitle;
    if (inquiryMessage) inquiryMessage.setAttribute('placeholder', config.placeholder);
    if (labelProductInterest) labelProductInterest.textContent = config.productLabel;
    if (inquiryTypeInput) inquiryTypeInput.value = config.typeValue;
  }

  if (tabSupplier) tabSupplier.addEventListener('click', () => setInquiryRole('supplier'));
  if (tabBuyer) tabBuyer.addEventListener('click', () => setInquiryRole('buyer'));
  if (tabGeneral) tabGeneral.addEventListener('click', () => setInquiryRole('general'));

  // ------------------------------------------------------------------------
  // 3. Section CTA & Opportunity Buttons Triggering Form State
  // ------------------------------------------------------------------------
  const inquiryTriggers = document.querySelectorAll('.js-set-inquiry');
  inquiryTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const role = btn.getAttribute('data-inquiry-role');
      if (role) {
        setInquiryRole(role);
      }
    });
  });

  const opportunityTriggers = document.querySelectorAll('.js-set-opportunity');
  opportunityTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      setInquiryRole('buyer');
      const product = btn.getAttribute('data-product');
      const productSelect = document.getElementById('product-interest');
      if (productSelect && product) {
        for (let i = 0; i < productSelect.options.length; i++) {
          if (productSelect.options[i].text.includes(product) || productSelect.options[i].value.includes(product)) {
            productSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // ------------------------------------------------------------------------
  // 4. AJAX Form Submission with FormSubmit API
  // ------------------------------------------------------------------------
  const tradeForm = document.getElementById('trade-inquiry-form');
  const formFeedback = document.getElementById('form-feedback');

  if (tradeForm) {
    tradeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = tradeForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '<span>Send Inquiry to Milton A. Johnson</span>';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending Inquiry...</span>';
      }

      if (formFeedback) {
        formFeedback.className = 'form-feedback';
        formFeedback.style.display = 'none';
        formFeedback.textContent = '';
      }

      const formData = new FormData(tradeForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('https://formsubmit.co/ajax/mjohnson@novafreshintl.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `Trade Inquiry (${data.inquiry_type || 'B2B Trade'}) - ${data.name || 'Anonymous'} [${data.company || 'N/A'}]`,
            _captcha: 'false',
            inquiry_type: data.inquiry_type,
            name: data.name,
            company: data.company,
            email: data.email,
            phone: data.phone || 'N/A',
            product_interest: data.product_interest || 'N/A',
            country_region: data.region || 'N/A',
            message: data.message
          })
        });

        if (response.ok) {
          if (formFeedback) {
            formFeedback.className = 'form-feedback success';
            formFeedback.style.display = 'block';
            formFeedback.innerHTML = '<strong>Inquiry Submitted Successfully!</strong><br />Thank you for reaching out. Milton A. Johnson will review your inquiry and follow up shortly.';
          }
          tradeForm.reset();
          // Reset hidden role
          if (inquiryTypeInput) inquiryTypeInput.value = 'Supplier / Exporter Inquiry';
        } else {
          throw new Error('Server returned response code ' + response.status);
        }
      } catch (error) {
        console.error('Inquiry submission error:', error);
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.style.display = 'block';
          formFeedback.innerHTML = '<strong>Submission Notice:</strong><br />We encountered an issue submitting the form. Please email Milton A. Johnson directly at <a href="mailto:mjohnson@novafreshintl.com" style="text-decoration: underline; color: inherit; font-weight: bold;">mjohnson@novafreshintl.com</a> or message via WhatsApp at <a href="https://wa.me/17146249974" style="text-decoration: underline; color: inherit; font-weight: bold;">+1 714.624.9974</a>.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. Active Scroll Navigation Highlighting
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header .nav-link');

  function updateActiveNav() {
    let current = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (current && href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
});
