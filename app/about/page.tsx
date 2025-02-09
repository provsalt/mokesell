"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const TeamAnimation = () => {
  return (
    <DotLottieReact
      src="https://lottie.host/90d693fa-b265-4caa-922d-d686914eb52a/20T2S4G476.lottie"
      loop
      autoplay
    />
  );
};

export default function Home() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">About Mokesell</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Who We Are</h2>
        <p className="mt-2">
          Mokesell is a dynamic online marketplace designed to help you buy and
          sell second-hand items with ease. Whether you&apos;re looking to
          declutter your space, find great deals, or give pre-loved items a
          second life, Mokesell provides a seamless platform for secure and
          hassle-free transactions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Our Mission</h2>
        <p className="mt-2">
          At Mokesell, we believe in the power of sustainable shopping. Our
          mission is to create a trusted community where users can buy and sell
          items of different conditions, from brand-new to well-loved, ensuring
          that every item finds a new home instead of ending up in landfills.
        </p>
      </section>
      <div className="w-md h-md flex justify-center items-center">
        {TeamAnimation()}
      </div>
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Why Choose Mokesell?</h2>
        <ul className="list-disc list-inside mt-2">
          <li>
            <strong>Easy Listing & Selling</strong>: Snap a picture, set a
            price, and connect with buyers in minutes.
          </li>
          <li>
            <strong>Varied Product Conditions</strong>: From barely used to
            vintage treasures, find items that match your needs and budget.
          </li>
          <li>
            <strong>Secure Transactions</strong>: We prioritize safety, ensuring
            a reliable and trustworthy platform for all users.
          </li>
          <li>
            <strong>Community-Driven</strong>: Join a marketplace where buyers
            and sellers can engage with confidence and transparency.
          </li>
        </ul>
      </section>

      <section className="text-center mt-6">
        <h2 className="text-xl font-semibold">Join Us Today!</h2>
        <p className="mt-2">
          Start selling or buying today on Mokesell and be part of a community
          that values sustainability, affordability, and convenience.
        </p>
      </section>
    </div>
  );
}
