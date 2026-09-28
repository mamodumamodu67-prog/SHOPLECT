'use client';
import { useState } from 'react';
import PageHead from '@/components/dash/PageHead';
import Modal from '@/components/ui/Modal';
import { EmptyState, ErrorNote, Loading, StatusBadge } from '@/components/ui/bits';
import { orderApi } from '@/lib/api';
import { useResource } from '@/lib/useResource';
import type { Appeal, Message } from '@/lib/types';

function AppealThread({ a, onSend, onDissolve }: { a: Appeal; onSend: (t: string) => void; onDissolve: () => void }) {
  const [text, setText] = useState('');
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="chat" style={{ height: 460 }}>
      <div className="top"><b>{a.title}</b><StatusBadge status={a.status === 'Ongoing' ? 'Under Review' : 'Completed'} /></div>
      <div className="msgs">{a.messages.length ? a.messages.map((m: Message) => <div key={m.id} className={`bubble ${m.from === 'me' ? 'me' : ''}`}>{m.author && <b style={{ display: 'block', fontSize: 12 }}>{m.author}</b>}{m.text}<small>{m.when}</small></div>) : <p className="muted center">No messages yet.</p>}</div>
      {a.status === 'Ongoing' && (
        <>
          <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { onSend(text.trim()); setText(''); } }}>
            <input className="f-input" placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value.slice(0, 1000))} aria-label="Message" />
            <button className="btn">Send</button>
          </form>
          <div style={{ padding: '0 16px 16px' }}><button className="link-btn" onClick={() => setConfirm(true)}>Dissolve appeal</button></div>
        </>
      )}
      {confirm && (
        <Modal title="Dissolve appeal" onClose={() => setConfirm(false)} width={380}>
          <p>This closes the appeal and ends admin review. Continue?</p>
          <div className="modal-actions"><button className="btn outline" onClick={() => setConfirm(false)}>Cancel</button><button className="btn danger" onClick={() => { onDissolve(); setConfirm(false); }}>Dissolve</button></div>
        </Modal>
      )}
    </div>
  );
}

export default function AppealsPage() {
  const { data, setData, loading, error } = useResource(() => orderApi.appeals());
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = data?.find((a) => a.id === activeId) || data?.[0];
  return (
    <>
      <PageHead title="Escalated appeal" />
      {loading ? <Loading /> : error ? <ErrorNote msg={error} /> : data?.length ? (
        <div className="dpanel inbox">
          <div className="list" role="listbox" aria-label="Appeals">
            {data.map((a) => (
              <button key={a.id} className="conv" role="option" aria-current={active?.id === a.id} onClick={() => setActiveId(a.id)}>
                <span style={{ flex: 1 }}>{a.title}<small><StatusBadge status={a.status === 'Ongoing' ? 'Under Review' : 'Completed'} /></small></span>
              </button>
            ))}
          </div>
          {active && (
            <AppealThread a={active}
              onSend={(t) => { const msg: Message = { id: `m${Date.now()}`, from: 'me', author: 'You', text: t, when: 'just now' }; setData((d) => d && d.map((a) => (a.id === active.id ? { ...a, messages: [...a.messages, msg] } : a))); orderApi.sendAppealMessage(active.id, t).catch(() => {}); }}
              onDissolve={() => { setData((d) => d && d.map((a) => (a.id === active.id ? { ...a, status: 'Completed' } : a))); orderApi.dissolveAppeal(active.id).catch(() => {}); }} />
          )}
        </div>
      ) : <div className="dpanel"><EmptyState title="No appeals yet" /></div>}
    </>
  );
}
