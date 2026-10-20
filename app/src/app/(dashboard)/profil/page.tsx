'use client';

import { useState } from 'react';
import {
  User,
  Building2,
  Phone,
  Mail,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';

const initialProfile = {
  full_name: 'Ahmad Suryadi',
  farm_name: 'Peternakan Markas Endog',
  farm_address: 'Jl. Kandang Raya No. 12, Desa Sukamaju, Bandung, Jawa Barat',
  phone: '08123456789',
  email: 'admin@markasendog.com',
  total_chickens: 2500,
};

export default function ProfilPage() {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialProfile);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Success notification */}
      {saved && (
        <div
          className="animate-fade-in flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-semibold"
          style={{ background: 'rgba(5, 150, 105, 0.08)', color: '#059669', border: '1px solid rgba(5, 150, 105, 0.3)' }}
        >
          <CheckCircle2 size={16} />
          Perubahan profil peternakan berhasil disimpan ke sistem.
        </div>
      )}

      {/* Profile Card */}
      <Card padding="md">
        {/* Avatar + name */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar Icon */}
          <div className="relative">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-sm flex-shrink-0"
              style={{ background: '#ea580c' }}
            >
              AS
            </div>
            {!editing && (
              <button
                id="edit-avatar-btn"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-slate-500 hover:text-slate-800"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                title="Ganti foto profil"
              >
                <Edit3 size={11} />
              </button>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{profile.full_name}</h2>
            <p className="text-xs text-slate-500">{profile.farm_name}</p>
            <p className="text-xs mt-0.5 text-slate-400 font-mono">{profile.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
                style={{ background: 'rgba(234,88,12,0.08)', color: '#ea580c' }}
              >
                <Layers size={13} />
                <span className="font-mono font-semibold">{profile.total_chickens.toLocaleString()}</span> ekor ayam
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
                style={{ background: 'rgba(5,150,105,0.08)', color: '#059669' }}
              >
                <CheckCircle2 size={13} />
                Admin Aktif
              </span>
            </div>
          </div>

          <div className="sm:ml-auto">
            {editing ? (
              <div className="flex gap-2">
                <Button id="btn-save-profile" size="sm" onClick={handleSave}>
                  <Save size={13} />
                  Simpan
                </Button>
                <Button id="btn-cancel-edit" variant="secondary" size="sm" onClick={handleCancel}>
                  <X size={13} />
                  Batal
                </Button>
              </div>
            ) : (
              <Button id="btn-edit-profile" variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Edit3 size={13} />
                Edit Profil
              </Button>
            )}
          </div>
        </div>

        <div className="border-t mt-5 pt-5" style={{ borderColor: 'var(--border-color)' }}>
          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="edit-name"
                label="Nama Lengkap Penanggung Jawab"
                value={draft.full_name}
                onChange={e => setDraft({ ...draft, full_name: e.target.value })}
              />
              <Input
                id="edit-farm"
                label="Nama Usaha Peternakan"
                value={draft.farm_name}
                onChange={e => setDraft({ ...draft, farm_name: e.target.value })}
              />
              <Input
                id="edit-phone"
                label="Nomor Telepon / WhatsApp"
                type="tel"
                value={draft.phone}
                onChange={e => setDraft({ ...draft, phone: e.target.value })}
              />
              <Input
                id="edit-email"
                label="Alamat Email Akun"
                type="email"
                value={draft.email}
                onChange={e => setDraft({ ...draft, email: e.target.value })}
              />
              <Input
                id="edit-chickens"
                label="Populasi Ayam Layer (ekor)"
                type="number"
                value={draft.total_chickens}
                onChange={e => setDraft({ ...draft, total_chickens: parseInt(e.target.value) || 0 })}
              />
              <div className="sm:col-span-2">
                <Input
                  id="edit-address"
                  label="Lokasi Kandang Peternakan"
                  value={draft.farm_address}
                  onChange={e => setDraft({ ...draft, farm_address: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: User, label: 'Nama Lengkap', value: profile.full_name },
                { icon: Building2, label: 'Nama Peternakan', value: profile.farm_name },
                { icon: Phone, label: 'Nomor HP', value: profile.phone },
                { icon: Mail, label: 'Email', value: profile.email },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-orange-700 dark:text-orange-400"
                    style={{ background: 'rgba(194,65,12,0.1)' }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{value}</p>
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2 flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-orange-700 dark:text-orange-400"
                  style={{ background: 'rgba(194,65,12,0.1)' }}
                >
                  <Building2 size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Lokasi Kandang</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{profile.farm_address}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Farm Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Populasi Ayam', value: `${profile.total_chickens.toLocaleString()} ekor`, color: '#c2410c' },
          { label: 'Status Kandang', value: 'Produksi Aktif', color: '#15803d' },
          { label: 'Versi Dashboard', value: 'v1.1.0 (Stabil)', color: '#1d4ed8' },
        ].map(item => (
          <Card key={item.label} padding="sm" className="text-center">
            <p className="text-lg font-extrabold font-mono" style={{ color: item.color }}>{item.value}</p>
            <p className="text-xs font-bold mt-0.5 text-slate-600 dark:text-slate-300">{item.label}</p>
          </Card>
        ))}
      </div>

      {/* Settings Menu */}
      <Card padding="none">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">Pengaturan Akun & Peternakan</h3>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          {[
            { icon: Bell, id: 'settings-notif', label: 'Preferensi Notifikasi', desc: 'Atur batas peringatan stok pakan kritis dan panen harian' },
            { icon: Shield, id: 'settings-security', label: 'Keamanan Akun', desc: 'Ubah kata sandi dan autentikasi admin' },
            { icon: HelpCircle, id: 'settings-help', label: 'Pusat Panduan & Dukungan', desc: 'Dokumentasi penggunaan dan kontak bantuan teknis' },
          ].map(({ icon: Icon, id, label, desc }) => (
            <button
              key={id}
              id={id}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-slate-700 dark:text-slate-200"
                style={{ background: 'var(--bg-primary)' }}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{label}</p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">{desc}</p>
              </div>
              <ChevronRight size={18} className="text-slate-500" />
            </button>
          ))}
        </div>
      </Card>

      {/* Logout button */}
      <div className="flex justify-end">
        <Button id="btn-logout" variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20">
          <LogOut size={14} />
          Keluar dari Sesi Dashboard
        </Button>
      </div>
    </div>
  );
}
