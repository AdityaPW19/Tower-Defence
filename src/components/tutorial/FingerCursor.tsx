import React from 'react';
import { resolvePath } from '../../utils/paths';

interface FingerCursorProps {
	left: string | number;
	top: string | number;
	size?: number;
	style?: React.CSSProperties;
	className?: string;
}

const FingerCursor: React.FC<FingerCursorProps> = ({ left, top, size, style, className }) => {
	const positionStyle: React.CSSProperties = {
		left: typeof left === 'number' ? `${left}px` : left,
		top: typeof top === 'number' ? `${top}px` : top,
		...(size ? { width: `${size}px` } : {}),
		...style
	};

	const cls = ['tut-finger', className].filter(Boolean).join(' ');

	return (
		<div className={cls} style={positionStyle} aria-hidden="true">
			<img src={resolvePath('/tutorial/finger-cursor.svg')} alt="" />
		</div>
	);
};

export default FingerCursor;
