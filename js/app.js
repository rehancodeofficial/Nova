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

  // 2. B2B Trade Inquiry Form Submission
  const tradeForm = document.getElementById('trade-inquiry-form');
  const formFeedback = document.getElementById('form-feedback');

  if (tradeForm) {
    tradeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('full-name').value;
      const company = document.getElementById('company-name').value;
      const email = document.getElementById('work-email').value;
      const phone = document.getElementById('phone-number').value;
      const service = document.getElementById('service-interest').value;
      const message = document.getElementById('inquiry-message').value;

      const submitBtn = tradeForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Email';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Email...';
      }

      // Construct direct mailto link for instant local fallback
      const mailtoSubject = encodeURIComponent(`Trade Inquiry: ${name} - ${company}`);
      const mailtoBody = encodeURIComponent(
        `Full Name: ${name}\n` +
        `Company Name: ${company}\n` +
        `Email Address: ${email}\n` +
        `Phone Number: ${phone}\n` +
        `Service Interest: ${service}\n\n` +
        `Inquiry Message:\n${message}`
      );
      const mailtoUrl = `mailto:rehancodeofficial@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

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
        console.log('FormSubmit response:', data);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        if (data.success === "true" || data.success === true) {
          if (formFeedback) {
            formFeedback.className = 'form-feedback success';
            formFeedback.innerHTML = `
              <strong>Inquiry Sent Successfully!</strong><br/>
              Your message has been emailed directly to <strong>rehancodeofficial@gmail.com</strong>.
            `;
          }
          tradeForm.reset();
        } else {
          // Local file origin fallback: open mailto link
          window.location.href = mailtoUrl;
          if (formFeedback) {
            formFeedback.className = 'form-feedback success';
            formFeedback.innerHTML = `
              <strong>Opening Email Client...</strong><br/>
              Opening your mail app to send inquiry to <strong>rehancodeofficial@gmail.com</strong>.
            `;
          }
        }
      })
      .catch(error => {
        console.log('Fallback to mailto:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        window.location.href = mailtoUrl;
        if (formFeedback) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = `
            <strong>Opening Email Client...</strong><br/>
            Opening your mail app to send inquiry to <strong>rehancodeofficial@gmail.com</strong>.
          `;
        }
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
