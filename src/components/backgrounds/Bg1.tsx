import React, { memo } from 'react';

const Bg1: React.FC = () => {
	return (
		<div className="bg-container bg1">
			<div className="gradient-bg" />
			<div className="stars" />
		</div>
	);
};

export default memo(Bg1);
