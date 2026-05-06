import React from 'react';

interface StepCardProps {
	stepNumber?: number;
	totalSteps?: number;
	title: string;
	subtitle?: string;
	variant?: 'bottom' | 'popup' | 'final';
	ctaText?: string;
	onCta?: () => void;
	children?: React.ReactNode;
	className?: string;
}

const StepCard: React.FC<StepCardProps> = ({
	stepNumber,
	totalSteps = 8,
	title,
	subtitle,
	variant = 'bottom',
	ctaText,
	onCta,
	children,
	className
}) => {
	const variantClass =
		variant === 'popup' ? 'tut-popup' : variant === 'final' ? 'tut-popup tut-final' : '';

	return (
		<div
			className={['tut-step-card', variantClass, className].filter(Boolean).join(' ')}
			role="dialog"
			aria-live="polite"
		>
			{stepNumber != null && (
				<span className="tut-step-pill">Step {stepNumber}/{totalSteps}</span>
			)}
			<h2 className="tut-step-title">{title}</h2>
			{subtitle && <p className="tut-step-sub">{subtitle}</p>}
			{children}
			{ctaText && onCta && (
				<div className="tut-step-cta">
					<button className="tut-cta" onClick={onCta} type="button">
						{ctaText}
					</button>
				</div>
			)}
		</div>
	);
};

export default StepCard;
