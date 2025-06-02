<script>
  import HeroLayout from "$lib/layout/hero-layout.svelte";
</script>


<HeroLayout>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl">Privacy Policy</h1>
      <p><strong>Effective Date:</strong> June 1, 2025</p>

      <p>Thank you for using our app! At Peppermint Music Inc, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect and how we use it.</p>
    </div>

    <div class="flex flex-col gap-4">
      <div>
        <h2 class="text-2xl">1. Information We Collect</h2>
        <p>We collect only the minimum necessary information to provide our services:</p>
        <ul>
          <li><strong>Authentication Information:</strong> When you log in using Face ID, Google, or email, we collect basic login credentials (such as your email address or account identifier) to verify your identity.</li>
          <li><strong>Playback Data:</strong> We may collect anonymized usage data (e.g., which albums you've redeemed or streamed) to improve app performance and ensure access to your purchased music.</li>
        </ul>
      </div>

      <div>
        <h2  class="text-2xl">2. How We Use Your Information</h2>
        <p>We use your information only to:</p>
        <ul>
          <li>Authenticate your account and allow you to access your previously purchased music.</li>
          <li>Maintain and improve the functionality and security of our app.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl">3. What We Don't Collect</h2>
        <ul>
          <li>We do <strong>not</strong> collect your contacts, location, device ID, or any personal data unrelated to login and music access.</li>
          <li>We do <strong>not</strong> share your information with third parties for marketing or advertising purposes.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl">4. Data Storage</h2>
        <p>We store only the login information required to authenticate your account. All data is stored securely using industry-standard practices.</p>
      </div>

      <div>
        <h2 class="text-2xl">5. Your Privacy Choices</h2>
        <p>You can delete your account and any associated data at any time by contacting us at <a href="mailto:peppermint.music.inc@gmail.com">peppermint.music.inc@gmail.com</a>.</p>
      </div>

      <div>
        <h2 class="text-2xl">6. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted within the app and on our website.</p>
      </div>

      <div>
        <h2 class="text-2xl">7. Contact Us</h2>
        <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
        <p><strong>Peppermint Music Inc</strong><br>
          <a href="mailto:peppermint.music.inc@gmail.com">peppermint.music.inc@gmail.com</a>
        </p>
      </div>
    </div>
  </div>
</HeroLayout>