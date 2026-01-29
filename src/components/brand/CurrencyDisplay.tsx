'use client';

interface CurrencyDisplayProps {
    amount: number;
    currency?: 'ADA' | 'USD';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
};

export function CurrencyDisplay({
    amount,
    currency = 'ADA',
    size = 'md',
    showLabel = false,
}: CurrencyDisplayProps) {
    const symbol = currency === 'ADA' ? '₳' : '$';

    return (
        <div className="flex items-baseline gap-1">
            <span className={`font-bold text-green-600 dark:text-green-400 ${sizeClasses[size]}`}>
                {amount.toLocaleString()} {symbol}
            </span>
            {showLabel && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{currency}</span>
            )}
        </div>
    );
}
