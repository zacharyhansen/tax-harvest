import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface Dataset {
  id: string;
}

// Define the context type
interface DatasetContextType {
  dataset: Dataset;
  setDataset: (newDataset: Dataset) => void;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

interface DatasetProviderProps {
  children: ReactNode;
  datasetId: string;
}

export const DatasetProvider: React.FC<DatasetProviderProps> = ({
  children,
  datasetId,
}) => {
  // TODO: hook up to clerk claim
  const [dataset, setDataset] = useState<Dataset>({
    id: datasetId,
  });
  const value = useMemo(() => ({ dataset, setDataset }), [dataset]);

  return (
    <DatasetContext.Provider value={value}> {children}</DatasetContext.Provider>
  );
};

// Custom hook to use the SchemaContext
export const useDataset = (): DatasetContextType => {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
};
