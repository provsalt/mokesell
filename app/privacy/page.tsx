import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="p-6 max-w-screen-md mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <section className="mb-6 text-left">
        <h2 className="text-xl font-semibold">1. Introduction</h2>
        <p className="mt-2">
          Your privacy is important to us. This Privacy Policy explains how
          Mokesell collects, uses, and protects your personal information when
          you use our platform.
        </p>
      </section>

      <section className="mb-6 text-left">
        <h2 className="text-xl font-semibold">2. Information We Collect</h2>
        <ul className="list-disc list-inside mt-2">
          <li>
            <strong>Personal Information:</strong> Name, email address, phone
            number, and payment details when you register or make a transaction.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about your interactions
            with Mokesell, including device type, browser, and IP address.
          </li>
          <li>
            <strong>Cookies:</strong> We use cookies to improve your experience
            and provide personalized content.
          </li>
        </ul>
      </section>

      <section className="mb-6 text-left">
        <h2 className="text-xl font-semibold">
          3. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside mt-2">
          <li>To provide, operate, and improve our platform.</li>
          <li>To facilitate transactions between buyers and sellers.</li>
          <li>
            To send important updates, promotions, or service-related messages.
          </li>
          <li>To detect and prevent fraud or security breaches.</li>
        </ul>
      </section>

      <section className="mb-6 text-left">
        <h2 className="text-xl font-semibold">4. Sharing of Information</h2>
        <ul className="list-disc list-inside mt-2">
          <li>We do not sell or rent your personal data.</li>
          <li>
            Information may be shared with trusted third-party services for
            payment processing, fraud detection, and platform analytics.
          </li>
          <li>
            We may disclose information if required by law or to protect the
            rights of Mokesell and its users.
          </li>
        </ul>
      </section>

      <section className="mb-6 text-left">
        <h2 className="text-xl font-semibold">5. Data Security</h2>
        <p className="mt-2">
          We implement security measures to protect your personal data. However,
          no method of transmission over the internet is 100% secure, and we
          cannot guarantee absolute protection.
        </p>
      </section>

      <section className="mb-6 text-left">
        <h2 className="text-xl font-semibold">6. Your Rights</h2>
        <ul className="list-disc list-inside mt-2">
          <li>
            You have the right to access, update, or delete your personal
            information.
          </li>
          <li>
            You can manage cookie preferences through your browser settings.
          </li>
          <li>You may opt out of marketing communications at any time.</li>
        </ul>
      </section>

      <section className="mb-6 text-left">
        <h2 className="text-xl font-semibold">7. Changes to This Policy</h2>
        <p className="mt-2">
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page, and continued use of Mokesell after updates
          constitutes acceptance of the new terms.
        </p>
      </section>

      <section className="mt-6 text-left">
        <h2 className="text-xl font-semibold">8. Contact Us</h2>
        <p className="mt-2">
          If you have any questions about this Privacy Policy, please reach out
          to our support team.
        </p>
        <div className="pt-4">
          <Button>
            <Link className="text-lg font-medium" href="/contact">
              Contact Us
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
