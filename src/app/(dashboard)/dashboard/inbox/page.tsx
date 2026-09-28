'use client';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';
import { EmptyState, ErrorNote, Loading } from '@/components/ui/bits';
import { socialApi } from '@/lib/api';
import { useResource } from '@/lib/useResource';
import PageHead from '@/components/dash/PageHead';
import type { Conversation, Message } from '@/lib/types';

function Thread({ c, onSend }: { c: Conversation; onSend: (text: string) => void }) {
  const [text, setText] = useState('');
  const [dlg, setDlg] = useState<'block' | 'report' | null>(null);
  return (
    <div className="chat">
      <div className="top"><b>{c.name}</b>
        <div className="row" style={{ gap: 8 }}>
          <button className="icon-btn" aria-label="Block" onClick={() => setDlg('block')}><Icon name="close" size={16} /></button>
          <button className="icon-btn" aria-label="Report" onClick={() => setDlg('report')}><Icon name="flag" size={16} /></button>
        </div>
      </div>
      <div className="msgs">
        {c.messages.length ? c.messages.map((m: Message) => <div key={m.id} className={`bubble ${m.from === 'me' ? 'me' : ''}`}>{m.text}<small>{m.when}</small></div>) : <p className="muted center">No messages yet — say hello.</p>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { onSend(text.trim()); setText(''); } }}>
        <input className="f-input" placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value.slice(0, 1000))} aria-label="Message" />
        <button className="btn" aria-label="Send"><Icon name="send" size={18} /></button>
      </form>
      {dlg && (
        <Modal title={dlg === 'block' ? 'Block user' : 'Report user'} onClose={() => setDlg(null)} width={380}>
          <p>Are you sure you want to {dlg} {c.name}?</p>
          <div className="modal-actions"><button className="btn outline" onClick={() => setDlg(null)}>Cancel</button><button className="btn danger" onClick={() => { (dlg === 'block' ? socialApi.block : socialApi.report)(c.id).catch(() => {}); setDlg(null); }}>{dlg === 'block' ? 'Block' : 'Report'}</button></div>
        </Modal>
      )}
    </div>
  );
}

export default function InboxPage() {
  const { data, setData, loading, error } = useResource(() => socialApi.conversations());
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = data?.find((c) => c.id === activeId) || data?.[0];
  function send(text: string) {
    if (!active) return;
    const msg: Message = { id: `m${Date.now()}`, from: 'me', text, when: 'just now' };
    setData((d) => d && d.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, msg] } : c)));
    socialApi.sendMessage(active.id, text).catch(() => {});
  }
  return (
    <>
      <PageHead title="Inbox" />
      {loading ? <Loading /> : error ? <ErrorNote msg={error} /> : data?.length ? (
        <div className="dpanel inbox">
          <div className="list" role="listbox" aria-label="Conversations">
            {data.map((c) => (
              <button key={c.id} className="conv" role="option" aria-current={active?.id === c.id} aria-selected={active?.id === c.id} onClick={() => setActiveId(c.id)}>
                <span className="avatar" aria-hidden="true">{c.name[0]}</span><span><b style={{ fontWeight: 500, display: 'block' }}>{c.name}</b><small>{c.date}</small></span>
              </button>
            ))}
          </div>
          {active && <Thread key={active.id} c={active} onSend={send} />}
        </div>
      ) : <div className="dpanel"><EmptyState title="No messages yet" /></div>}
    </>
  );
}
