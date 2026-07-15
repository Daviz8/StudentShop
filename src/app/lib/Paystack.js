const PAYSTACK_BASE_URL = "https://api.paystack.co";

export async function initializePaystackTransaction({
  email,
  amount,
  reference,
  callbackUrl,
  metadata = {},
}) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is missing in .env.local");
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount,
      reference,
      callback_url: callbackUrl,
      currency: "NGN",
      metadata,
    }),
  });

  const data = await response.json();

  console.log("PAYSTACK_INITIALIZE_RESPONSE:", data);

  if (!response.ok || !data.status) {
    throw new Error(data.message || "Failed to initialize Paystack payment.");
  }

  return data.data;
}

export async function verifyPaystackTransaction(reference) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is missing in .env.local");
  }

  const cleanReference = String(reference || "").trim();

  if (!cleanReference) {
    throw new Error("Payment reference is missing.");
  }

  console.log("VERIFYING_PAYSTACK_REFERENCE:", cleanReference);
  console.log(
    "PAYSTACK_KEY_MODE:",
    process.env.PAYSTACK_SECRET_KEY.startsWith("sk_live_")
      ? "LIVE"
      : process.env.PAYSTACK_SECRET_KEY.startsWith("sk_test_")
        ? "TEST"
        : "UNKNOWN"
  );

  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(
      cleanReference
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  console.log("PAYSTACK_VERIFY_RESPONSE:", data);

  if (!response.ok || !data.status) {
    throw new Error(data.message || "Failed to verify Paystack payment.");
  }

  return data.data;
}