'use client';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeButton({ priceId }: { priceId: string }) {
  return (
    <Button onClick={async () => {
      const { data } = await api.post('/api/stripe/create-checkout-session/', { priceId });
      const stripe = await stripePromise;
      stripe?.redirectToCheckout({ sessionId: data.id });
    }}>
      Contratar
    </Button>
  );
}