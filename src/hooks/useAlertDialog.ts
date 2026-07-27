import { useState, useCallback } from 'react';

interface AlertDialogState {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  loading: boolean;
}

interface ConfirmOptions {
  title: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
}

const initial: AlertDialogState = {
  open: false,
  title: '',
  description: '',
  onConfirm: () => {},
  loading: false,
};

export function useAlertDialog() {
  const [state, setState] = useState<AlertDialogState>(initial);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setState({
      open: true,
      title: opts.title,
      description: opts.description ?? '',
      onConfirm: opts.onConfirm,
      loading: false,
    });
  }, []);

  const cancel = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  return { ...state, confirm, cancel, setLoading };
}
