import s from './Auth.module.css';

type Props = {
  id: string; label: string; placeholder: string; value: string; onChange: (v: string) => void;
  error?: string; type?: 'text' | 'email' | 'tel'; autoComplete?: string; maxLength?: number; inputMode?: 'text' | 'email' | 'tel';
};

export default function TextField({ id, label, placeholder, value, onChange, error, type = 'text', autoComplete, maxLength = 254, inputMode }: Props) {
  return (
    <div className={s.fieldWrap}>
      <div className={`${s.field} ${error ? s.fieldErr : ''}`}>
        <label htmlFor={id} className="sr-only">{label}</label>
        <input id={id} className={s.input} type={type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} maxLength={maxLength} inputMode={inputMode}
          aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
      </div>
      {error && <span id={`${id}-err`} className={s.err} role="alert">{error}</span>}
    </div>
  );
}
