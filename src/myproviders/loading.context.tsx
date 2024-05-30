import { createContext, useState, ReactNode } from 'react';

interface LoadingContextValue {
    loading: number;
    description: string;
    setLoading: (value: number, description?: string, force: boolean) => void
}

export const LoadingContext = createContext<LoadingContextValue>({
    loading: 0,
    setLoading: () => { },
    description: "this is my own provider"
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(0);
    const [description, setDescription] = useState('Loading...');

    const handleSetLoading = (value: number, newDescription?: string, force: boolean) => {

        if (force) {
            setLoading(0);
        } else {
            if (value)
                setLoading((prev) => (prev + 1));
            else
                setLoading((prev) => (prev - 1));
        }

        if (newDescription) {
            setDescription(newDescription);
        }

    };

    return (
        <LoadingContext.Provider value={{ loading, setLoading: handleSetLoading, description }}>
            {children}
        </LoadingContext.Provider>
    );
};