import { useState, useCallback } from 'react';
import axios from 'axios';
import { AvailableAction, AvailableTrigger } from '../types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const useAvailableItems = () => {
  const [actions, setActions] = useState<AvailableAction[]>([]);
  const [triggers, setTriggers] = useState<AvailableTrigger[]>([]);
  const [loading, setLoading] = useState(false);

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return null;
    }
    return token;
  };

  const fetchActions = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get<AvailableAction[]>(`${BACKEND_URL}/api/v1/actions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActions(response.data);
    } catch (error) {
      console.error('Failed to fetch actions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTriggers = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get<AvailableTrigger[]>(`${BACKEND_URL}/api/v1/triggers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTriggers(response.data);
    } catch (error) {
      console.error('Failed to fetch triggers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    actions,
    triggers,
    loading,
    fetchActions,
    fetchTriggers,
  };
};
