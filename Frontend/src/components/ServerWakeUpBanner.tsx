import { useState } from "react";
import { Alert } from "react-bootstrap";

// Il backend gira sul piano gratuito di Render: dopo ~15 minuti senza richieste
// si spegne e la prima chiamata impiega ~50 secondi. Senza avviso sembra un sito rotto.
// Lo stato non viene salvato: il banner ricompare a ogni apertura del sito.
const ServerWakeUpBanner = () => {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <Alert
      variant="danger"
      dismissible
      onClose={() => setShow(false)}
      className="mb-0 rounded-0 text-center small py-2"
    >
      <i className="bi bi-hourglass-split me-2"></i>
      <strong>Heads up:</strong> the backend runs on a free hosting plan and
      goes to sleep when idle. The first load can take up to ~50 seconds while
      the server wakes up — the site isn't broken, thanks for your patience!
    </Alert>
  );
};

export default ServerWakeUpBanner;
