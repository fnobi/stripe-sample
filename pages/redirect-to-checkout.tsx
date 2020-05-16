import React, { useState, useMemo } from "react";
import { css } from "@emotion/core";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, RedirectToCheckoutOptions } from "@stripe/stripe-js";
import { px } from "~/lib/cssUtil";
import { STRIPE_API_KEY } from "~/local/stripeConfig";
import DefaultLayout from "~/layouts/DefaultLayout";

type Product = {
  title: string;
  unit: number;
};

const PRODUCTS = new Map<string, Product>([
  [
    "price_HHZnHmavCm9gVN",
    {
      title: "壺",
      unit: 1000000
    }
  ],
  [
    "price_HHrFkCyrpxt5Tl",
    {
      title: "Tシャツ",
      unit: 50000
    }
  ]
]);

const stripePromise = loadStripe(STRIPE_API_KEY);

const wrapperStyle = css({
  margin: px(32)
});

const cellStyle = css({
  padding: px(16)
});

const ProductRow = (props: {
  product: Product;
  count: number;
  setCount: (n: number) => void;
}) => {
  const { product, count, setCount } = props;
  return (
    <tr>
      <td css={cellStyle}>{product.title}</td>
      <td css={cellStyle}>
        <input
          type="number"
          value={count}
          onChange={e => setCount(Number(e.target.value))}
        />
      </td>
      <td css={cellStyle}>¥{count * product.unit}</td>
    </tr>
  );
};

const CardForm = () => {
  const stripe = useStripe();
  const [counts, setCounts] = useState(
    new Map<string, number>(
      Array.from(PRODUCTS.entries()).map(([id]) => [id, 0])
    )
  );

  const total = useMemo(() => {
    return Array.from(PRODUCTS.entries()).reduce((prev, [id, product]) => {
      return prev + product.unit * (counts.get(id) || 0);
    }, 0);
  }, [counts]);

  const updateCount = (id: string, count: number) => {
    const clone = new Map(counts);
    clone.set(id, count);
    setCounts(clone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe) {
      return;
    }
    const lineItems = Array.from(PRODUCTS.keys())
      .map(id => ({
        price: id,
        quantity: counts.get(id) || 0
      }))
      .filter(p => p.quantity > 0);
    const options: RedirectToCheckoutOptions = {
      successUrl: window.location.href,
      cancelUrl: window.location.href,
      locale: "ja"
    };
    stripe.redirectToCheckout({
      mode: "payment",
      lineItems,
      ...options
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  };

  return (
    <form css={wrapperStyle} onSubmit={handleSubmit}>
      <p>商品数をえらんでください。</p>
      <table>
        <tbody>
          {Array.from(PRODUCTS.entries()).map(([id, product]) => (
            <ProductRow
              key={id}
              product={product}
              count={counts.get(id) || 0}
              setCount={n => updateCount(id, n)}
            />
          ))}
          <tr>
            <td css={cellStyle}>合計</td>
            <td />
            <td css={cellStyle}>¥{total}</td>
          </tr>
        </tbody>
      </table>
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
