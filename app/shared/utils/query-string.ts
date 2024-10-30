import { SearchObject } from "@/shared/types/common.type";

export const toObject = (text: string): SearchObject => {
  const params = new URLSearchParams(text);
  const result: SearchObject = {};
  params.forEach((value, key) => {
    if (!value) return;
    result[key] = value;
  });
  return result;
};

export const toString = (obj: SearchObject): string => {
  const params = new URLSearchParams();
  Object.keys(obj).forEach((key) => {
    if (!obj[key]) return;
    params.set(key, String(obj[key]));
  });
  return params.toString();
};
