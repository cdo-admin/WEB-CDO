import { createContext, useCallback, useContext, useState } from 'react';
import { useT } from '../i18n/I18nProvider.jsx';

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

let seq = 0;
export function ToastProvider({ children }) {
  const [list, setList] = useState([]);
  const t = useT();
  const remove = useCallback((id) => setList((l) => l.filter((x) => x.id !== id)), []);
  const show = useCallback((title, message, type = 'success') => {
    const id = ++seq;
    setList((l) => [...l, { id, title, message, type, on: false }]);
    setTimeout(() => setList((l) => l.map((x) => (x.id === id ? { ...x, on: true } : x))), 10);
    setTimeout(() => setList((l) => l.map((x) => (x.id === id ? { ...x, on: false, out: true } : x))), 4500);
    setTimeout(() => remove(id), 5000);
  }, [remove]);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div id="toast-container">
        {list.map((x) => (
          <div key={x.id} className={'flex items-start gap-4 p-5 bg-navy-900 text-white rounded shadow-luxury-lg border border-slate-700/60 transition-all duration-500 transform max-w-md w-full relative overflow-hidden ' + (x.on ? '' : x.out ? 'opacity-0 translate-y-2' : 'translate-y-4 opacity-0')}>
            <div className={'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ' + (x.type === 'success' ? 'bg-sky-500' : 'bg-rose-500')}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={x.type === 'success' ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'} />
              </svg>
            </div>
            <div className="flex-1 pr-2">
              <h4 className="font-semibold text-sm tracking-wider uppercase text-sky-300 font-luxury-serif">{t(x.title)}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t(x.message)}</p>
            </div>
            <button type="button" className="text-slate-400 hover:text-white transition-colors" onClick={() => remove(x.id)} aria-label={t('Tutup')}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
