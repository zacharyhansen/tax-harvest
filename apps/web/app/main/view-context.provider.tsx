import type React from 'react';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useUser } from './user.provider';

import { mergeViewNameWithRole } from '~/lib/view-helpers';

type ViewContext = Record<string, Record<string, string | number>>;

// Define the context type
interface ViewContextType {
  viewContext: ViewContext;
  roleViewContext: ViewContext;
  setViewContext: (viewContext: ViewContext) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

interface SchemaProviderProps {
  children: ReactNode;
}

export const ViewContextProvider: React.FC<SchemaProviderProps> = ({
  children,
}) => {
  const [viewContext, setViewContext] = useState<ViewContext>({});
  const { user } = useUser();

  const value = useMemo(
    () => ({
      viewContext,
      setViewContext,
      roleViewContext: Object.entries(viewContext).reduce(
        (acc, curr) => ({
          ...acc,
          [mergeViewNameWithRole({ view: curr[0], role: user.role_name })]:
            curr[1],
        }),
        {}
      ),
    }),
    [viewContext, user.role_name]
  );

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};

// Custom hook to use the ViewContext
export const useViewContext = (): ViewContextType => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useViewContext must be used within a ViewContextProvider');
  }
  return context;
};
