import React, { memo } from 'react';

const Bg3: React.FC = () => {
	return (
		<div className="bg-container bg3">
			<div className="gradient-bg" />
			<div className="stars" />
		</div>
	);
};

export default memo(Bg3);
