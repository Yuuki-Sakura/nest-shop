export const TimestampTransformer = {
  from: (value: number): Date => {
    return new Date(+value);
  },
  to: (value: Date) => {
    if (!value) return value;
    return value.getTime();
  },
};
