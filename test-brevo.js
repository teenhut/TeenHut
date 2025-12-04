require("dotenv").config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;

const sendEmailWithRetry = async (to, subject, text, retries = 3) => {
  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY is missing!");
    return false;
  }

  const url = "https://api.brevo.com/v3/smtp/email";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        email: process.env.EMAIL_USER || "no-reply@teenhut.com",
        name: "TeenHut",
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: `<p>${text}</p>`,
    }),
  };

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1} to send email to ${to}...`);
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      console.log("Email sent successfully via Brevo:", data.messageId);
      return true;
    } catch (error) {
      console.error(`Email attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        console.error("All email attempts failed.");
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

// Run test
(async () => {
  console.log("Testing Brevo Email Sending...");
  const testEmail = "teenhut10@gmail.com"; // Sending to self
  await sendEmailWithRetry(
    testEmail,
    "Brevo Test",
    "This is a test email from the Brevo integration."
  );
})();
