import { BookingForm } from "@/components/customer/BookingForm";

export default function CustomerPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Đặt bàn</h1>
        <p className="mt-1 text-sm text-gray-500">
          Buffet Poseidon
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <BookingForm />
      </div>
    </main>
  );
}
