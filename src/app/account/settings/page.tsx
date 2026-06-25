"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Trash2, ChevronRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useCustomerContext } from "@/lib/customer-context";

const CITIES = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];

const SAMPLE_DEVICES = [
  { name: "Chrome on Windows", last: "Thiết bị hiện tại / Current device", current: true },
  { name: "iPhone 14 Pro", last: "2 ngày trước / 2 days ago", current: false },
  { name: "MacBook Pro", last: "5 ngày trước / 5 days ago", current: false },
];

export default function SettingsPage() {
  const { t } = useTranslation();
  const { customer, logout } = useCustomerContext();
  const router = useRouter();

  const [offers, setOffers] = useState(true);
  const [touchId, setTouchId] = useState(false);
  const [faceId, setFaceId] = useState(false);
  const [city, setCity] = useState(CITIES[0]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!customer) return null;

  function handleLogout() {
    logout();
    router.push("/");
  }

  function handleDelete() {
    // Prototype: just logs out — no server-side deletion
    logout();
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t("accountSettings")}</h1>
        <p className="mt-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          ⚠️ {t("settingsProto")}
        </p>
      </div>

      {/* Change password (prototype) */}
      <SettingsCard title={t("settingsPasswordTitle")}>
        <button
          onClick={() => alert(t("settingsProto"))}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          <span>{t("settingsPasswordTitle")}</span>
          <ChevronRight size={14} className="text-gray-400" />
        </button>
      </SettingsCard>

      {/* Biometric security */}
      <SettingsCard title={t("settingsSecurityTitle")}>
        <div className="space-y-3">
          <ToggleRow
            label={t("settingsTouchId")}
            checked={touchId}
            onChange={setTouchId}
          />
          <ToggleRow
            label={t("settingsFaceId")}
            checked={faceId}
            onChange={setFaceId}
          />
        </div>
      </SettingsCard>

      {/* Offer notifications */}
      <SettingsCard title={t("settingsOffersTitle")}>
        <ToggleRow
          label={t("settingsOffersToggle")}
          checked={offers}
          onChange={setOffers}
        />
      </SettingsCard>

      {/* Location */}
      <SettingsCard title={t("settingsLocationTitle")}>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </SettingsCard>

      {/* Devices */}
      <SettingsCard title={t("settingsDevicesTitle")}>
        <ul className="divide-y divide-gray-50">
          {SAMPLE_DEVICES.map((d) => (
            <li key={d.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{d.name}</p>
                <p className={`text-xs ${d.current ? "text-green-600" : "text-gray-400"}`}>{d.last}</p>
              </div>
              {!d.current && (
                <button
                  onClick={() => alert(t("settingsProto"))}
                  className="rounded-md border border-red-100 bg-red-50 px-2.5 py-1 text-xs text-red-600 transition-colors hover:bg-red-100"
                >
                  {t("logoutBtn")}
                </button>
              )}
            </li>
          ))}
        </ul>
      </SettingsCard>

      {/* Sign out */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <LogOut size={16} className="shrink-0 text-gray-500" />
          {t("settingsLogout")}
        </button>
      </div>

      {/* Delete account */}
      <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-red-400">
          {t("settingsDeleteTitle")}
        </p>
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="flex w-full items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
          >
            <Trash2 size={16} className="shrink-0" />
            {t("settingsDeleteBtn")}
          </button>
        ) : (
          <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{t("settingsDeleteConfirm")}</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
              >
                {t("settingsDeleteBtn")}
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {t("confirmationClose")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-brand-red" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
