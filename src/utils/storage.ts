export function saveToStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromStorage(key: string): any {
  const d = localStorage.getItem(key);
  if (!d) return undefined;
  return JSON.parse(d);
}