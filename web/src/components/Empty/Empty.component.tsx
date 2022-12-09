import { PropsWithChildren } from 'react';

function Empty(props: PropsWithChildren) {
  const { children } = props;

  return <div className="w-full p-8 pt-40 flex justify-center">
    <h4 className="text-6 leading-6 font-medium text-caption">{ children }</h4>
  </div>;
}

export default Empty;