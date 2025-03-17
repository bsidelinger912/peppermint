import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { Animated } from "react-native";

type HeaderState = {
  title?: string;
  backNavigation?: () => void;
  hasImage?: boolean;
  scrollY: Animated.Value;
};

type HeaderContextType = {
  headerState: HeaderState;
  setHeaderState: Dispatch<SetStateAction<HeaderState>>;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderContextProvider({ children }: { children: React.ReactNode }) {
  const [headerState, setHeaderState] = useState<HeaderState>({ scrollY: new Animated.Value(0) });

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
