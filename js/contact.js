
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // prevent actual form submission (for demo/testing)

      // Get form values (optional - could be used for validation or sending)
      const name = form.querySelector('input[type="text"]').value.trim();
      const email = form.querySelector('input[type="email"]').value.trim();
      const message = form.querySelector('textarea').value.trim();

      // Basic validation (optional: you already use `required` in HTML)
      if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
      }

      // Success feedback (replace with real logic or API call later)
      alert("Thank you, " + name + "! Your message has been sent.");

      // Optional: Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Optional: Clear form
      form.reset();
    });
  });

   document.getElementById("menuToggle").addEventListener("click", function () {
    document.querySelector("nav").classList.toggle("open");
  });
