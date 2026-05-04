import React, { memo } from 'react';

const Bg2: React.FC = () => {
	return (
		<div className="bg-container bg2">
			<div className="gradient-bg" />
			<div className="stars" />
		</div>
	);
};

export default memo(Bg2);
