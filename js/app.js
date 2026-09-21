/**
 * Nova Fresh International — Application Logic
 * Standard Vanilla JS for Navigation Drawer, Smooth Scrolling, and Inquiry Form
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

  // 2. B2B Trade Inquiry Form Submission via FormSubmit AJAX Endpoint
  const tradeForm = document.getElementById('trade-inquiry-form');
  const formFeedback = document.getElementById('form-feedback');

  if (tradeForm) {
    tradeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = tradeForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Email';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Email...';
      }

      const formData = new FormData(tradeForm);

      fetch('https://formsubmit.co/ajax/rehancodeofficial@gmail.com', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        if (formFeedback) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = `
            <strong>Inquiry Sent Successfully!</strong><br/>
            Your message has been emailed directly to <strong>rehancodeofficial@gmail.com</strong>.<br/>
            <small style="display:inline-block; margin-top:4px; opacity:0.9;">(Note: On the first test email, check <u>rehancodeofficial@gmail.com</u> inbox/spam to click "Activate Form" if required by FormSubmit).</small>
          `;
        }

        tradeForm.reset();
      })
      .catch(error => {
        console.error('Email send error:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        // Fallback to direct form submit
        tradeForm.submit();
      });
    });
  }

  // 3. Highlight Active Link on Scroll
  const sections = document.querySelectorAll('section[id], div[id].section-bar-header, div[id].about-section-container');
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
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
