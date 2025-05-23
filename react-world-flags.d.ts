declare module 'react-world-flags' {
  import * as React from 'react';
  interface FlagProps extends React.HTMLAttributes<HTMLImageElement> {
    code: string;
    style?: React.CSSProperties;
    className?: string;
  }
  const Flag: React.FC<FlagProps>;
  export default Flag;
}
