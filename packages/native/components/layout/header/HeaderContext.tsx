import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type HeaderState = {
  title?: string;
  backNavigation?: () => void;
  hasImage?: boolean;
  scrollPosition: number;
};

type HeaderContextType = {
  headerState: HeaderState;
  setHeaderState: Dispatch<SetStateAction<HeaderState>>;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderContextProvider({ children }: { children: React.ReactNode }) {
  const [headerState, setHeaderState] = useState<HeaderState>({ scrollPosition: 0 });

  return (
    <HeaderContext.Provider value={{ headerState, setHeaderState }}>
      {children}
    </HeaderContext.Provider>
  );
}

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
};
