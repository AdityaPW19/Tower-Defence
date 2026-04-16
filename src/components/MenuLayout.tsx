import React from 'react';

interface MenuLayoutProps {
	children: React.ReactNode;
}

const MenuLayout: React.FC<MenuLayoutProps> = ({ children }) => {
	return (
		<div className="menu-container">
			<div className="grid-overlay" />
			<div className="scan-line" />
			<div className="menu-content">
				{children}
			</div>
		</div>
	);
};

export default MenuLayout;
