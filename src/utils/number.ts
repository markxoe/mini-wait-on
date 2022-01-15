export const isNumberOr = (input: any, or: any) =>
  Number.isNaN(Number(input)) ? or : Number(input);
