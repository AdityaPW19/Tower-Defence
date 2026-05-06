import React from 'react';
import { resolvePath } from '../../utils/paths';

/**
 * Steps 1–3: castle + breathing ring above the dim backdrop, sharing one center point.
 */
const StepCastleHighlight: React.FC = () => {
	return (
		<div className="tut-castle-highlight" aria-hidden="true">
			<div className="tut-spotlight tut-spotlight--stacked" />
			<div className="tut-castle-img-wrap">
				<img
					src={resolvePath('/castle/castle.png')}
					alt=""
					draggable={false}
				/>
			</div>
		</div>
	);
};

export default StepCastleHighlight;
