import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">1. Introduction</h2>
        <p className="mt-2">
          Welcome to Mokesell! By using our platform, you agree to the following
          terms and conditions. Please read them carefully before buying or
          selling items on Mokesell.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">2. User Responsibilities</h2>
        <ul className="list-disc list-inside mt-2">
          <li>
            You must be at least 18 years old or have parental consent to use
            Mokesell.
          </li>
          <li>All information you provide must be accurate and up to date.</li>
          <li>
            Users are responsible for their own transactions and interactions
            with other users.
          </li>
          <li>
            Prohibited items such as illegal goods, counterfeit products, or
            hazardous materials cannot be sold.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">3. Buying & Selling</h2>
        <ul className="list-disc list-inside mt-2">
          <li>
            Sellers must provide truthful descriptions of their items, including
            their condition.
          </li>
          <li>
            Buyers and sellers are responsible for agreeing on payment and
            delivery methods.
          </li>
          <li>
            Mokesell does not offer refunds, returns, or guarantees on
            transactions between users.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">4. Prohibited Conduct</h2>
        <ul className="list-disc list-inside mt-2">
          <li>
            Harassment, scams, or fraudulent activity will result in account
            suspension.
          </li>
          <li>
            Any attempt to circumvent Mokesell&apos;s security measures is
            strictly prohibited.
          </li>
          <li>
            Spamming, fake listings, or misleading advertisements are not
            allowed.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">5. Liability Disclaimer</h2>
        <p className="mt-2">
          Mokesell is a platform that connects buyers and sellers. We do not
          take responsibility for any disputes, damages, or losses arising from
          user transactions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">6. Changes to Terms</h2>
        <p className="mt-2">
          Mokesell reserves the right to modify these terms at any time.
          Continued use of the platform after updates constitutes acceptance of
          the new terms.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">7. Contact Us</h2>
        <p className="mt-2">
          If you have any questions or concerns, please reach out to our support
          team.
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
