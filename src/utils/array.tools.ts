export const toggleArrayItem = <T>(arr: T[], v: T): T[] => {
  const localArray = [...arr];

  const i = localArray.indexOf(v);
  if (i === -1) {
    localArray.push(v);
  } else {
    localArray.splice(i, 1);
  }

  return localArray;
};
