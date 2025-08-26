export const stringToInitials = (name: string | null | undefined) => {
	if (!name) return '';
	const parts = name.split(' ');
	if (parts.length >= 2) {
		return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase();
	}
	return name.substring(0, 2).toUpperCase();
};
