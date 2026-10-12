import { appState } from '../home/state/state.js';

export default function ConnectivityBanner() {
  if (appState.internet) return null;

  return (
    <div className="ConnectivityBanner" role="alert" aria-live="polite">
      <span className="ConnectivityIcon">📡</span>
      <span className="ConnectivityMessage">Sin conexión a Internet</span>
    </div>
  );
}
