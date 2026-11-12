import { products } from '@/data/products';

const MAX_LINE_QUANTITY = 99;
const MAX_CART_LINES = 50;

export function priceCart(lines) {
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_CART_LINES) {
    throw new Error('The order items are invalid.');
  }

  const items = lines.map((line) => {
    const productId = Number(line?.productId ?? line?.id);
    const quantity = line?.quantity;
    const product = products.find((candidate) => candidate.id === productId);

    if (!product || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_LINE_QUANTITY) {
      throw new Error('The order contains an invalid product or quantity.');
    }

    let size = null;
    let unitPrice = product.price;

    if (product.sizes?.length) {
      if (typeof line.selectedSize !== 'string') {
        throw new Error(`Choose a valid size for ${product.name}.`);
      }
      const selectedOption = product.sizes.find((option) => option.label === line.selectedSize);
      if (!selectedOption) {
        throw new Error(`Choose a valid size for ${product.name}.`);
      }
      size = selectedOption.label;
      unitPrice = selectedOption.price;
    }

    return {
      productId: product.id,
      name: product.name,
      size,
      quantity,
      unitPrice,
    };
  });

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  if (!Number.isSafeInteger(total) || total < 1) {
    throw new Error('The order total is invalid.');
  }

  return { items, total };
}