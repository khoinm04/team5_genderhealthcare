// src/services/MenstrualCycleService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/menstrual-cycles';

export const trackCycle = (customerId, startDate, cycleLength, menstruationDuration, notes) => {
  return axios.post(
    `${BASE_URL}/track`,
    null,
    {
      params: {
        customerId,
        startDate,
        cycleLength,
        menstruationDuration,
        notes,
      }
    }
  );
};

export const getNextPeriod = (customerId) => {
  return axios.get(`${BASE_URL}/customer/${customerId}/next-period`);
};

export const getOvulationDate = (customerId) => {
  return axios.get(`${BASE_URL}/customer/${customerId}/ovulation`);
};

export const getCurrentCycle = (customerId) => {
  return axios.get(`${BASE_URL}/customer/${customerId}/current`);
};

export const getPredictedCycle = (customerId) => {
  return axios.get(`${BASE_URL}/customer/${customerId}/predicted`);
};

export const deleteCycle = (customerId, cycleId) => {
  return axios.delete(`${BASE_URL}/customer/${customerId}/cycles/${cycleId}`);
};

export const updateCycle = (customerId, cycleId, cycleData) => {
  return axios.put(
    `${BASE_URL}/customer/${customerId}/cycles/${cycleId}`,
    cycleData
  );
};
