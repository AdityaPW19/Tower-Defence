import React from 'react';

interface PauseOverlayProps {
	isPaused: boolean;
	onResume: () => void;
	onRestart: () => void;
}

const PauseOverlay: React.FC<PauseOverlayProps> = ({ isPaused, onResume, onRestart }) => {
	if (!isPaused) return null;

	return (
		<div style={{ 
			position: 'absolute', 
			inset: 0, 
			display: 'flex', 
			alignItems: 'center', 
			justifyContent: 'center', 
			background: 'rgba(0,0,0,0.7)', 
			zIndex: 120,
			backdropFilter: 'blur(4px)'
		}}>
			<div style={{ 
				background: 'rgba(30,30,30,0.95)', 
				padding: 32, 
				borderRadius: 12, 
				color: '#fff', 
				textAlign: 'center',
				boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
				border: '1px solid rgba(255,255,255,0.1)'
			}}>
				<h2 style={{ margin: '0 0 20px 0', fontSize: 28 }}>Game Paused</h2>
				<p style={{ opacity: 0.7, marginBottom: 24 }}>Press ESC or click Resume to continue</p>
				<div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
					<button 
						className="btn-primary" 
						onClick={onResume}
						style={{
							padding: '12px 32px',
							fontSize: 16,
							background: 'linear-gradient(45deg, #4caf50, #45a049)',
							border: 'none',
							borderRadius: 8,
							color: '#fff',
							cursor: 'pointer',
							fontWeight: 'bold'
						}}
					>
						Resume
					</button>
					<button 
						className="btn-secondary" 
						onClick={onRestart}
						style={{
							padding: '12px 32px',
							fontSize: 16,
							background: 'rgba(255,255,255,0.1)',
							border: '1px solid rgba(255,255,255,0.2)',
							borderRadius: 8,
							color: '#fff',
							cursor: 'pointer'
						}}
					>
						Restart
					</button>
				</div>
			</div>
		</div>
	);
};

export default PauseOverlay;
