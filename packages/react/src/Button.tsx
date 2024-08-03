import { ReactNode } from 'react';

export type ButtonProps = {
  children: ReactNode;
};

export const Button = (props: ButtonProps) => {
  return <button {...props} className="yahoo12" />;
};
