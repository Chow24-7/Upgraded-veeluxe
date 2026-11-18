import { cookies } from 'next/headers';
import AdminLoginForm from '@/components/AdminLoginForm';
import AdminLogoutButton from '@/components/AdminLogoutButton';
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from '@/lib/admin-auth';
import { getRecentOrders } from '@/lib/paystack-orders';
import { canonicalMetadata } from '@/lib/seo';

export const runtime = 'nodejs';
export const metadata = canonicalMetadata('/admin/orders', {
  title: 'Order management | Veeluxe',
  robots: { index: false, follow: false },
});

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = isAdminSessionValid(session);

  return (
    <div className="mx-auto min-h-[60vh] max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="page-eyebrow uppercase tracking-[0.24em] text-[#ff5722]">Veeluxe</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#333]">Order management</h1>
        </div>
        {isAuthenticated ? <AdminLogoutButton /> : null}
      </div>

      {!process.env.ADMIN_PASSWORD ? (
        <p className="mt-8 rounded-xl border border-[#f2e7e2] bg-white p-5 text-[#555]">Admin access has not been configured.</p>
      ) : !isAuthenticated ? (
        <div className="mt-8 rounded-[24px] border border-[#f2e7e2] bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-semibold text-[#333]">Sign in to view orders</h2>
          <AdminLoginForm />
        </div>
      ) : (
        <OrdersList />
      )}
    </div>
  );
}

async function OrdersList() {
  let orders;
  try {
    orders = await getRecentOrders();
  } catch (error) {
    console.error('Unable to load admin orders:', error);
    return <p className="mt-8 rounded-xl border border-[#f2e7e2] bg-white p-5 text-[#555]">Orders are temporarily unavailable.</p>;
  }

  if (orders.length === 0) {
    return <p className="mt-8 rounded-xl border border-[#f2e7e2] bg-white p-5 text-[#555]">No paid orders yet.</p>;
  }

  return (
    <div className="mt-8 space-y-5">
      {orders.map((order) => (
        <article key={order.reference} className="rounded-[18px] border border-[#f2e7e2] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#333]">{order.name}</h2>
              <p className="mt-1 text-sm text-[#666]">{order.email}</p>
              <p className="mt-1 text-sm text-[#666]">Reference: {order.reference}</p>
              <p className="mt-1 text-sm text-[#666]">{order.createdAt?.toDate?.().toLocaleString() || 'Date unavailable'}</p>
            </div>
            <p className="font-semibold text-[#ff5722]">₦{order.total.toLocaleString()} · {order.status}</p>
          </div>
          <p className="mt-4 text-sm text-[#555]">Delivery address: {order.address}</p>
          <div className="mt-3 space-y-1 text-sm text-[#555]">
            {order.deliveryArea ? <p>Delivery area: {order.deliveryArea}</p> : null}
            <p>Items subtotal: ₦{(order.itemsSubtotal ?? order.total).toLocaleString()}</p>
            {order.deliveryFee !== undefined ? <p>Delivery fee: ₦{order.deliveryFee.toLocaleString()}</p> : null}
          </div>
          <ul className="mt-4 space-y-2 border-t border-[#f2e7e2] pt-4 text-sm text-[#555]">
            {order.items.map((item, index) => (
              <li key={`${order.reference}-${item.productId}-${index}`} className="flex flex-wrap justify-between gap-2">
                <span>{item.name}{item.size ? ` (${item.size})` : ''} × {item.quantity}</span>
                <span>₦{(item.unitPrice * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}