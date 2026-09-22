/**
 * Nova Fresh International — Application Logic
 * Vanilla JS for Mobile Drawer Toggle, FormSubmit AJAX Handling, and Active Scroll Highlighting
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
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

    const mobileLinks = mobileDrawer.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Functional AJAX Form Submission with FormSubmit API
  const tradeForm = document.getElementById('trade-inquiry-form');
  const formFeedback = document.getElementById('form-feedback');

  if (tradeForm) {
    tradeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = tradeForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '<span>Send Message to Milton</span>';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending Message...</span>';
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
            _subject: 'New Inquiry - Nova Fresh International',
            _captcha: 'false',
            name: data.name,
            company: data.company,
            email: data.email,
            phone: data.phone || 'N/A',
            message: data.message
          })
        });

        if (response.ok) {
          if (formFeedback) {
            formFeedback.className = 'form-feedback success';
            formFeedback.style.display = 'block';
            formFeedback.innerHTML = '<strong>Message Sent Successfully!</strong><br />Thank you for reaching out. Milton A. Johnson will get back to you shortly.';
          }
          tradeForm.reset();
        } else {
          throw new Error('Form submission returned status ' + response.status);
        }
      } catch (error) {
        console.error('Form submission error:', error);
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.style.display = 'block';
          formFeedback.innerHTML = '<strong>Submission Failed.</strong><br />Unable to send your message right now. Please email Milton A. Johnson directly at <a href="mailto:mjohnson@novafreshintl.com" style="text-decoration: underline; color: inherit;">mjohnson@novafreshintl.com</a> or call +1 562 201 7771.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  // 3. Highlight Active Navigation Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (current && link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
