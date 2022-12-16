import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

const TestContext = createContext<any | null>(null);

export const TestContextProvider = ({ children }: { children: any }) => {
  const [number, setNumber] = useState<number>(0);

  return (
    <TestContext.Provider
      value={{
        number,
        setNumber,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTestSelector = () => {
  const context = useContext(TestContext);

  return context;
};
