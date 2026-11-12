'use client';

export default function AdminLogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
  };

  return (
    <button type="button" onClick={handleLogout} className="rounded-full border border-[#e2d8d3] px-4 py-2 text-sm font-semibold text-[#333] transition hover:bg-[#fff5f0]">
      Sign out
    </button>
  );
}