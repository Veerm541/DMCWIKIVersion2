(() => {
  const { $ } = window.DMC;

  const form = $('#contactForm');

  if (!form) return;


  const FORMSPREE_ENDPOINT =
    'https://formspree.io/f/xyezwlln';


  const fields = {
    name: $('#name'),
    email: $('#email'),
    subject: $('#subject'),
    message: $('#message')
  };


  const errors = {
    name: $('#nameError'),
    email: $('#emailError'),
    subject: $('#subjectError'),
    message: $('#messageError')
  };


  const status = $('#contactStatus');

  const submitButton =
    form.querySelector(
      'button[type="submit"]'
    );


  /* =========================================
     FIELD ERROR
     ========================================= */

  const setError = (
    key,
    message = ''
  ) => {

    errors[key].textContent =
      message;

    fields[key].classList.toggle(
      'invalid',
      Boolean(message)
    );

    fields[key].setAttribute(
      'aria-invalid',
      Boolean(message)
    );

  };


  /* =========================================
     VALIDATION
     ========================================= */

  const validate = () => {

    let valid = true;


    Object.keys(fields).forEach(
      key => setError(key)
    );


    /* Name */

    if (
      fields.name.value
        .trim()
        .length < 2
    ) {

      setError(
        'name',
        'Please enter at least 2 characters.'
      );

      valid = false;

    }


    /* Email */

    const email =
      fields.email.value.trim();


    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email)
    ) {

      setError(
        'email',
        'Enter a valid email address.'
      );

      valid = false;

    }


    /* Subject */

    if (!fields.subject.value) {

      setError(
        'subject',
        'Choose a topic.'
      );

      valid = false;

    }


    /* Message */

    if (
      fields.message.value
        .trim()
        .length < 10
    ) {

      setError(
        'message',
        'Please write at least 10 characters.'
      );

      valid = false;

    }


    return valid;
  };


  /* =========================================
     REMOVE ERROR WHILE USER TYPES
     ========================================= */

  Object.entries(fields).forEach(
    ([key, field]) => {

      const eventName =
        field.tagName === 'SELECT'
          ? 'change'
          : 'input';


      field.addEventListener(
        eventName,
        () => setError(key)
      );

    }
  );


  /* =========================================
     SUBMIT FORM
     ========================================= */

  form.addEventListener(
    'submit',
    async event => {

      event.preventDefault();


      /* -----------------------------
         Local validation
         ----------------------------- */

      if (!validate()) {

        status.textContent =
          'Check the highlighted fields and try again.';

        status.style.color =
          'var(--danger)';


        form
          .querySelector('.invalid')
          ?.focus();


        return;
      }


      /* -----------------------------
         Loading state
         ----------------------------- */

      submitButton.disabled = true;


      const originalButtonHTML =
        submitButton.innerHTML;


      submitButton.innerHTML = `
        Sending...
        <i class="fa-solid fa-spinner fa-spin"></i>
      `;


      status.textContent =
        'Sending your message...';


      status.style.color =
        'var(--muted)';


      try {

        /*
          FormData automatically collects:

          name
          email
          subject
          message

          because your HTML inputs
          already have name="" attributes.
        */

        const formData =
          new FormData(form);


        const response =
          await fetch(
            FORMSPREE_ENDPOINT,
            {
              method: 'POST',

              body: formData,

              headers: {
                Accept:
                  'application/json'
              }
            }
          );


        const result =
          await response
            .json()
            .catch(() => null);


        /* -----------------------------
           Formspree error
           ----------------------------- */

        if (!response.ok) {

          let errorMessage =
            'Unable to send your message. Please try again.';


          if (
            result &&
            Array.isArray(result.errors) &&
            result.errors.length
          ) {

            errorMessage =
              result.errors
                .map(error =>
                  error.message
                )
                .join(' ');

          }


          throw new Error(
            errorMessage
          );

        }


        /* -----------------------------
           Success
           ----------------------------- */

        const visitorName =
          fields.name.value.trim();


        status.textContent =
          `Thanks, ${visitorName}! Your message was sent successfully.`;


        status.style.color =
          'var(--success)';


        form.reset();


        Object.keys(fields)
          .forEach(
            key => setError(key)
          );


      } catch (error) {

        console.error(
          'Contact form error:',
          error
        );


        status.textContent =
          error.message ||
          'Something went wrong while sending your message.';


        status.style.color =
          'var(--danger)';

      } finally {

        /* -----------------------------
           Restore button
           ----------------------------- */

        submitButton.disabled = false;

        submitButton.innerHTML =
          originalButtonHTML;

      }

    }
  );

})();