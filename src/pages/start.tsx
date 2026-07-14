import { useEffect } from 'react';

export default function StartRedirect() {
  useEffect(() => { window.location.href = '/meta-pantavisor/start'; }, []);
  return null;
}
