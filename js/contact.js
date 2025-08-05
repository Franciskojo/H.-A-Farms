document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const submitButton = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const message = form.querySelector('textarea').value.trim();

    if (!name || !email || !message) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all fields.'
      });
      return;
    }

    // Disable the button while sending
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      const response = await fetch("https://h-a-farms-backend.onrender.com/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      await Swal.fire({
        icon: 'success',
        title: 'Message Sent',
        text: data.message || "Your message has been sent successfully!",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });

      form.reset();
      window.location.href = "thank-you.html"; // ✅ Redirect after success

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || "Failed to send message."
      });
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  });

  document.getElementById("menuToggle").addEventListener("click", function () {
    document.querySelector("nav").classList.toggle("open");
  });
});
