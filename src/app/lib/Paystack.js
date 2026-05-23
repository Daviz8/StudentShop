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

  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const data = await response.json();

  console.log("PAYSTACK_VERIFY_RESPONSE:", data);

  if (!response.ok || !data.status) {
    throw new Error(data.message || "Failed to verify Paystack payment.");
  }

  return data.data;
}

const payNow = async () => {
  if (!customer.fullName || !customer.email || !customer.phone) {
    alert("Please enter your full name, email and phone number");
    return;
  }

  if (deliveryMethod === "standard" && !customer.address) {
    alert("Please enter your delivery address");
    return;
  }

  if (cartItems.length === 0) {
    alert("Your cart is empty");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/orders/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer,
        deliveryMethod,
        shippingFee,
        escrowFee,
        items: cartItems,
      }),
    });

    const data = await res.json();

    console.log("CHECKOUT_RESPONSE:", data);

    if (!res.ok || !data.success) {
      alert(data.message || "Payment initialization failed");
      return;
    }

    if (!data.payment?.authorizationUrl) {
      console.error("PAYSTACK_AUTH_URL_MISSING:", data);
      alert("Paystack authorization URL was not returned by the server.");
      return;
    }

    localStorage.setItem("pending_order_id", data.order._id);
    window.location.href = data.payment.authorizationUrl;
  } catch (error) {
    console.error("PAYSTACK_CHECKOUT_ERROR:", error);
    alert("Something went wrong while starting payment");
  } finally {
    setLoading(false);
  }
};