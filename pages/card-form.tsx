import React from "react";
import { css } from "@emotion/core";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { loadStripe, StripeCardElementOptions } from "@stripe/stripe-js";
import { px } from "~/lib/cssUtil";
import { STRIPE_API_KEY } from "~/local/stripeConfig";
import DefaultLayout from "~/layouts/DefaultLayout";

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  },
  hidePostalCode: true
};

const stripePromise = loadStripe(STRIPE_API_KEY);

const wrapperStyle = css({
  margin: px(32)
});

const CardForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!elements || !stripe) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    const result = await stripe.createToken(card);
    if (result.error) {
      console.error(result.error.message || null);
    } else if (!result.token) {
      console.error("不明なエラーです");
    } else {
      console.log(result.token.id);
    }
  };

  return (
    <form css={wrapperStyle} onSubmit={handleSubmit}>
      <p>100万円の請求をするので、カード情報を入れてね！</p>
      <CardElement options={CARD_ELEMENT_OPTIONS} />
      <p>
        <button type="submit">OK</button>
      </p>
    </form>
  );
};

export default () => {
  return (
    <DefaultLayout>
      <Elements stripe={stripePromise}>
        <CardForm />
      </Elements>
    </DefaultLayout>
  );
};
