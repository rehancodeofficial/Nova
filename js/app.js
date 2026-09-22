/**
 * Nova Fresh International — Application Logic
 * Standard Vanilla JS for Navigation Drawer, Smooth Scrolling, and AJAX Inquiry Form
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
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      
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
        // Post directly to FormSubmit AJAX endpoint
        const response = await fetch('https://formsubmit.co/ajax/mjohnson@novafreshintl.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: 'New Trade Inquiry - Nova Fresh International',
            _captcha: 'false',
            name: data.name,
            company: data.company,
            email: data.email,
            phone: data.phone || 'N/A',
            stakeholder_type: data.stakeholder_type || 'General',
            message: data.message
          })
        });

        if (response.ok) {
          if (formFeedback) {
            formFeedback.className = 'form-feedback success';
            formFeedback.style.display = 'block';
            formFeedback.innerHTML = '<strong>Message Sent Successfully!</strong><br />Thank you for reaching out to Nova Fresh International. Milton A. Johnson will get back to you shortly.';
          }
          tradeForm.reset();
        } else {
          throw new Error('Form submission failed with status ' + response.status);
        }
      } catch (error) {
        console.error('Form submission error:', error);
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.style.display = 'block';
          formFeedback.innerHTML = '<strong>Submission Failed.</strong><br />Unable to send your inquiry right now. Please email Milton A. Johnson directly at <a href="mailto:mjohnson@novafreshintl.com" style="text-decoration: underline; color: inherit;">mjohnson@novafreshintl.com</a> or call +1 562 201 7771.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
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

