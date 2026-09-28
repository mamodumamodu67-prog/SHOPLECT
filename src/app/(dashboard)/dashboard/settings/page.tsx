'use client';
import { useState } from 'react';
import PageHead from '@/components/dash/PageHead';
import { Tabs } from '@/components/ui/bits';
import { ProfilePanel, PasswordPanel, NotificationSettingsPanel, DeliverySettingsPanel } from '@/components/dash/SettingsPanels';

const TABS = ['Profile', 'Password', 'Notifications', 'Delivery'] as const;
export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Profile');
  return (
    <>
      <PageHead title="Settings" />
      <div style={{ marginBottom: 20 }}><Tabs tabs={TABS} value={tab} onChange={setTab} label="Settings section" /></div>
      {tab === 'Profile' && <ProfilePanel />}
      {tab === 'Password' && <PasswordPanel />}
      {tab === 'Notifications' && <NotificationSettingsPanel />}
      {tab === 'Delivery' && <DeliverySettingsPanel />}
    </>
  );
}
