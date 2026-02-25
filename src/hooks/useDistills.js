import { useState, useEffect } from 'react';
import { subscribeToDistills } from '../services/firestoreService';
import { useAuth } from './useAuth';

export function useDistills(limitCount = 50) {
  const { user } = useAuth();
  const [distills, setDistills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setDistills([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToDistills(user.uid, (data) => {
      setDistills(data);
      setLoading(false);
    }, limitCount);

    return unsubscribe;
  }, [user, limitCount]);

  return { distills, loading };
}
