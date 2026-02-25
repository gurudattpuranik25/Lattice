import { useState, useEffect } from 'react';
import { subscribeToCollections } from '../services/firestoreService';
import { useAuth } from './useAuth';

export function useCollections() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCollections([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToCollections(user.uid, (data) => {
      setCollections(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return { collections, loading };
}
