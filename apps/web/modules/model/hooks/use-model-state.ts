'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

type ModelStateStorage = {
	isPanelOpen: boolean;
	isPanelMinimized: boolean;
};

const STORAGE_KEY = 'tax-model-state';

/**
 * Hook for managing model state with localStorage persistence
 * @returns Model state and control functions
 * @example
 * ```tsx
 * const {
 *   modelLotIds,
 *   addLot,
 *   removeLot,
 *   clearAll,
 *   isInModel,
 *   isPanelOpen,
 *   setIsPanelOpen,
 * } = useModelState();
 * ```
 */
export function useModelState() {
	// Panel UI state (persisted to localStorage)
	const [isPanelOpen, setIsPanelOpen] = useState(false);
	const [isPanelMinimized, setIsPanelMinimized] = useState(false);

	// Model data (will come from backend later, mocked for now)
	const [modelLotIds, setModelLotIds] = useState<string[]>([]);
	const [addedAt, setAddedAt] = useState<Record<string, number>>({});

	// Load panel state from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const state = JSON.parse(stored) as ModelStateStorage;
				setIsPanelOpen(state.isPanelOpen ?? false);
				setIsPanelMinimized(state.isPanelMinimized ?? false);
			} catch (e) {
				console.error('Failed to parse model state from localStorage', e);
			}
		}
	}, []);

	// Save panel state to localStorage when it changes
	useEffect(() => {
		const state: ModelStateStorage = { isPanelOpen, isPanelMinimized };
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	}, [isPanelOpen, isPanelMinimized]);

	// Add lot to model
	const addLot = useCallback((lotId: string) => {
		setModelLotIds((prev) => {
			if (prev.includes(lotId)) return prev;
			return [...prev, lotId];
		});
		setAddedAt((prev) => ({
			...prev,
			[lotId]: Date.now(),
		}));
	}, []);

	// Remove lot from model
	const removeLot = useCallback((lotId: string) => {
		setModelLotIds((prev) => prev.filter((id) => id !== lotId));
		setAddedAt((prev) => {
			const newAddedAt = { ...prev };
			delete newAddedAt[lotId];
			return newAddedAt;
		});
	}, []);

	// Clear all lots from model
	const clearAll = useCallback(() => {
		setModelLotIds([]);
		setAddedAt({});
	}, []);

	// Check if lot is in model
	const isInModel = useCallback(
		(lotId: string) => modelLotIds.includes(lotId),
		[modelLotIds],
	);

	// Sort lot IDs by when they were added (oldest first)
	const sortedLotIds = useMemo(() => {
		return [...modelLotIds].sort((a, b) => {
			return (addedAt[a] ?? 0) - (addedAt[b] ?? 0);
		});
	}, [modelLotIds, addedAt]);

	return {
		modelLotIds,
		addLot,
		removeLot,
		clearAll,
		isInModel,
		isPanelOpen,
		setIsPanelOpen: (open: boolean) => setIsPanelOpen(open),
		isPanelMinimized,
		setIsPanelMinimized: (minimized: boolean) => setIsPanelMinimized(minimized),
		sortedLotIds,
	};
}
