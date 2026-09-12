(() => {
  const { $, escapeHTML } = window.DMC;
  const form = $('#contactForm');
  if (!form) return;
  const fields = {
    name: $('#name'), email: $('#email'), subject: $('#subject'), message: $('#message')
  };
  const errors = {
    name: $('#nameError'), email: $('#emailError'), subject: $('#subjectError'), message: $('#messageError')
  };
  const setError = (key, message = '') => {
    errors[key].textContent = message;
    fields[key].classList.toggle('invalid', Boolean(message));
    fields[key].setAttribute('aria-invalid', Boolean(message));
  };
  const validate = () => {
    let valid = true;
    Object.keys(fields).forEach(key => setError(key));
    if (fields.name.value.trim().length < 2) { setError('name', 'Please enter at least 2 characters.'); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) { setError('email', 'Enter a valid email address.'); valid = false; }
    if (!fields.subject.value) { setError('subject', 'Choose a topic.'); valid = false; }
    if (fields.message.value.trim().length < 10) { setError('message', 'Please write at least 10 characters.'); valid = false; }
    return valid;
  };
  Object.entries(fields).forEach(([key, field]) => field.addEventListener('input', () => setError(key)));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const status = $('#contactStatus');
    if (!validate()) {
      status.textContent = 'Check the highlighted fields and try again.';
      status.style.color = 'var(--danger)';
      form.querySelector('.invalid')?.focus();
      return;
    }
    const name = escapeHTML(fields.name.value.trim());
    status.textContent = `Thanks, ${name}. Your demo message passed validation successfully.`;
    status.style.color = 'var(--success)';
    form.reset();
  });
})();
