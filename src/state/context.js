import { createContext } from "react";
import {initialState} from './state';

export let context;

export function getContext() {
  if(!context) context = createContext(initialState);
  return context;
}