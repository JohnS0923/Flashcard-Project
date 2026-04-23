const sessionStorageKey = "0";

export const getGlobalVariable = () => {
  const storedNumericValue = sessionStorage.getItem(sessionStorageKey);
  return storedNumericValue ? JSON.parse(storedNumericValue) : "0";
};

export const setGlobalVariable = (value: string) => {
  sessionStorage.setItem(sessionStorageKey, JSON.stringify(value));
};
