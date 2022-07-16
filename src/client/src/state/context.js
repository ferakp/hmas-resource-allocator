import { createContext } from 'react';
import { initialState } from './state';

export let context;

export function getContext() {
  const copiedState = JSON.parse(JSON.stringify(initialState));
  if (!context) context = createContext(copiedState);
  return context;
}
