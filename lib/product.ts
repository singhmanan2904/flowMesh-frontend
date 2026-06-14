export type Product = {
  id: string;
  price: number;
  imageUrl: string;
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export const formatProductName = (id: string) => {
  const slug = id.replace(/^prod-/, "");
  return `Product ${slug.toUpperCase()}`;
};
