import { BookingTable } from "@/components/admin/BookingTable";
import DemandChartLazy from "@/components/admin/DemandChartLazy";

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đặt bàn</h1>
        <p className="mt-1 text-sm text-gray-500">Buffet Poseidon</p>
      </div>

      <BookingTable />

      <hr className="my-10 border-gray-200" />

      <DemandChartLazy />
    </main>
  );
}
