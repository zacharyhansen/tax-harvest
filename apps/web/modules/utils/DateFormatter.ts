// biome-ignore lint/complexity/noStaticOnlyClass: <ok>
export class DateFormatter {
	public static shortDay(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			day: '2-digit',
			month: 'short',
			year: '2-digit',
		});
	}

	public static timestamp(dateString: string): string {
		return new Date(dateString).toLocaleString('en-US', {
			day: '2-digit',
			month: 'short',
			year: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZoneName: 'short',
		});
	}

	public static timeAgo(date: Date | string): string {
		const now = new Date();
		const diffMs = now.getTime() - new Date(date).getTime();

		const minutes = Math.floor(diffMs / (1000 * 60));
		const hours = Math.floor(diffMs / (1000 * 60 * 60));
		const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		const months = Math.floor(days / 30);

		if (minutes < 1) {
			return 'just now';
		}
		if (minutes < 60) {
			return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
		}
		if (hours < 24) {
			return `${hours} hour${hours > 1 ? 's' : ''} ago`;
		}
		if (days === 1) {
			return 'yesterday';
		}
		if (days < 30) {
			return `${days} day${days > 1 ? 's' : ''} ago`;
		}
		if (months < 12) {
			return `${months} month${months > 1 ? 's' : ''} ago`;
		}

		return date.toLocaleString(); // More than a year, show full date
	}
}
