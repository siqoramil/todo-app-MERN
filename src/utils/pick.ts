export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  return keys.reduce(
    (result, key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = obj[key];
      }
      return result;
    },
    {} as Pick<T, K>
  );
};

export const pickDefined = <T extends object>(obj: T): Partial<T> => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (value !== undefined) {
      (result as Record<string, unknown>)[key] = value;
    }
    return result;
  }, {} as Partial<T>);
};
