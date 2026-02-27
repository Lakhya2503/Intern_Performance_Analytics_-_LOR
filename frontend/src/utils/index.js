export const requestHandler = async(
  api,
  setLoading,
  onSuccess,
  onError
) => {
   let isMounted = true;

  try {

    setLoading?.(true);
    const response= await api()

    const data = response?.data ?? response ?? null

    if(!data) {
      throw new Error(`No data recived from API`)
    }

    onSuccess(data)

  } catch (error) {

      if (error?.response?.status === 401 || error?.response?.status === 403) {
            LocalStorage.clear();
            if (isBrowser) {
                window.location.href = '/login';
            }
        } else if ([400, 401, 403].includes(error?.response?.data?.statusCode)) {
            LocalStorage.clear();
            if (isBrowser) {
                window.location.href = '/login';
            }
        }
  }  finally {
       if (isMounted) {
            setLoading?.(false);
        }
  }
};

export const isBrowser = typeof window !== 'undefined';

export class LocalStorage {
    static get(key) {
        if (!isBrowser) return null;

        try {
            const value = localStorage.getItem(key);
            if (!value) return null;

            // Handle common bad values
            if (value === 'undefined' || value === 'null') return null;

            const parsed = JSON.parse(value);
            return parsed;
        } catch (error) {
            // Get the raw value again for error handling
            const rawValue = localStorage.getItem(key);
            console.warn(`localStorage "${key}" corrupted:`,
                rawValue?.substring?.(0, 50) || rawValue, error);

            // Graceful fallback for simple values
            if (rawValue && typeof rawValue === 'string') {
                if (!rawValue.startsWith('{') && !rawValue.startsWith('[')) {
                    if (rawValue === 'true') return true;
                    if (rawValue === 'false') return false;
                    if (rawValue === 'null') return null;
                    if (!isNaN(rawValue) && rawValue !== '') {
                        return Number(rawValue);
                    }
                    return rawValue;
                }
            }

            // Auto-clean corrupted data
            localStorage.removeItem(key);
            return null;
        }
    }

    static set(key, value) {
        if (!isBrowser) return;

        try {
            // Handle special cases
            if (value === undefined ||
                value === null ||
                typeof value === 'function' ||
                typeof value === 'symbol') {
                localStorage.setItem(key, JSON.stringify(null));
                return;
            }

            // Handle non-serializable values
            try {
                const serialized = JSON.stringify(value);
                localStorage.setItem(key, serialized);
            } catch (serializeError) {
                console.warn(`Cannot serialize value for key "${key}":`, value);
                // Store a string representation as fallback
                localStorage.setItem(key, JSON.stringify(String(value)));
            }
        } catch (error) {
            console.error(`Failed to set "${key}":`, error);
        }
    }

    static remove(key) {
        if (!isBrowser) return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Failed to remove "${key}":`, error);
        }
    }

    static clear() {
        if (!isBrowser) return;
        try {
            localStorage.clear();
        } catch (error) {
            console.error('localStorage.clear() failed:', error);
        }
    }
}
