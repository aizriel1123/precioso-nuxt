import { type ClassValue, clsx } from 'clsx'
import Decimal from 'decimal.js';
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Obj = { [key: string]: any };

export function dynamicDenest(
  data: Obj | Obj[] | null | undefined,
  targets: string[],
  mapping: { [key: string]: string } = {}
): Obj | Obj[] {
  if (!data) {
    return [{}];
  }
  if (data === undefined) {
    throw new Error("data is undefined");
  }

  const isObject = (val: any): val is Obj => val && typeof val === "object" && !Array.isArray(val);

  const denest = (obj: Obj): Obj => {
    const newObj = deepCopy(obj); // Make a copy before modifying

    for (const key of targets) {
      if (newObj[key]) {
        if (Array.isArray(newObj[key])) {
          // If the key maps to an array, rename it according to the mapping
          const newKey = mapping[key] || key;
          newObj[newKey] = newObj[key].map((item: Obj) => {
            if (isObject(item)) {
              return denest(item); // Recursively denest objects within the array
            }
            return item;
          });
          if (newKey !== key) delete newObj[key];
        } else if (isObject(newObj[key])) {
          // If the key maps to an object, denest its properties
          const nestedObj = newObj[key];
          Object.assign(newObj, nestedObj);
          delete newObj[key];
        }
      }
    }
    return newObj;
  };

  if (Array.isArray(data)) {
    return data.map((item: Obj) => denest(item));
  } else if (isObject(data)) {
    return denest(data);
  }

  return data;
}

export function deepCopy(obj: Obj): Obj {
  return JSON.parse(JSON.stringify(convertBigIntsToNumbers(obj)));
}

export function convertBigIntsToNumbers(obj: any): any {

  // Does not detect Decimal
  // console.log(obj instanceof Decimal)

  if (typeof obj === "bigint") {
    return Number(obj);
  } else if (obj instanceof Date) {
    return obj.toJSON();
  } else if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map((item) => convertBigIntsToNumbers(item));
    } else {
      const newObj: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = convertBigIntsToNumbers(obj[key]);
        }
      }
      return newObj;
    }
  }
  return obj;
}