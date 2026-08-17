'use client';

export default function DeliveryAnimation() {
  return (
    <div className="delivery-animation mx-auto mt-8 flex max-w-3xl items-center justify-center">
      <div className="truck-shell">
        <div className="truck-cab">
          <div className="truck-window" />
        </div>
        <div className="truck-body" />
        <div className="truck-wheel truck-wheel-front" />
        <div className="truck-wheel truck-wheel-rear" />
      </div>
      <div className="delivery-path" aria-hidden="true">
        <span className="delivery-dot" />
        <span className="delivery-dot" />
        <span className="delivery-dot" />
        <span className="delivery-dot" />
      </div>
    </div>
  );
}
