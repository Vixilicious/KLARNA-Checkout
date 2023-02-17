import fetch from "node-fetch";

function getKlarnaAuth() {
  const auth =
    "Basic " +
    Buffer.from(process.env.PUBLIC_KEY + ":" + process.env.SECRET_KEY).toString(
      "base64"
    );

  return auth;
}

export async function createOrder(product) {
  const auth = getKlarnaAuth();
  const url = "https://api.playground.klarna.com/checkout/v3/orders";

  const quantity = 1;
  const price = product.price * 100;
  const total_amount = price * quantity;
  const total_tax_amount = total_amount * 0.2;

  const payload = {
    purchase_country: "SE",
    purchase_currency: "SEK",
    locale: "sv-SE",
    order_amount: total_amount,
    order_tax_amount: total_tax_amount,
    order_lines: [
      {
        type: "physical",
        reference: product.id,
        name: product.name,
        quantity: quantity,
        quantity_unit: "pcs",
        unit_price: price,
        tax_rate: 2500,
        total_amount: total_amount,
        total_discount_amount: 0,
        total_tax_amount,
      },
    ],
    merchant_urls: {
      terms: "https://www.example.com/terms.html",
      checkout:
        "https://www.example.com/checkout.html?order_id={checkout.order.id}",
      confirmation:
        process.env.REDIRECT_URL + "/confirmation?order_id={checkout.order.id}",
      push: "https://www.example.com/api/push?order_id={checkout.order.id}",
    },
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json", Authorization: auth },
  });
  const data = await response.json();
  console.log(data);
  return data;
}

export async function retrieveOrder(order_id) {
  const auth = getKlarnaAuth();
  const url = "https://api.playground.klarna.com/checkout/v3/orders";

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", Authorization: auth },
  });
}
