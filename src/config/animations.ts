export type AnimationDef = {
	name: string;
	frames: string[];
	framesAmount: number;
	frameRate: number;
	loop: boolean;
};

export const animations: Record<string, AnimationDef> = {
	// Enemies - Follow animations
	BlueBlobEliteFollow: {
		name: 'BlueBlobEliteFollow',
		frames: ['/enemies/BlueBlobElite/Follow/0.svg', '/enemies/BlueBlobElite/Follow/1.svg', '/enemies/BlueBlobElite/Follow/2.svg', '/enemies/BlueBlobElite/Follow/3.svg'],
		framesAmount: 4,
		frameRate: 10,
		loop: true
	},
	BlueBlobEliteDie: {
		name: 'BlueBlobEliteDie',
		frames: ['/enemies/BlueBlobElite/Die/0.svg', '/enemies/BlueBlobElite/Die/1.svg', '/enemies/BlueBlobElite/Die/2.svg'],
		framesAmount: 3,
		frameRate: 12,
		loop: false
	},

	BlueCircleEliteFollow: {
		name: 'BlueCircleEliteFollow',
		frames: ['/enemies/BlueCircleElite/Follow/0.svg', '/enemies/BlueCircleElite/Follow/1.svg', '/enemies/BlueCircleElite/Follow/2.svg', '/enemies/BlueCircleElite/Follow/3.svg'],
		framesAmount: 4,
		frameRate: 10,
		loop: true
	},
	BlueCircleEliteDie: {
		name: 'BlueCircleEliteDie',
		frames: ['/enemies/BlueCircleElite/Die/0.svg', '/enemies/BlueCircleElite/Die/1.svg', '/enemies/BlueCircleElite/Die/2.svg'],
		framesAmount: 3,
		frameRate: 12,
		loop: false
	},

	BlueCommonFollow: {
		name: 'BlueCommonFollow',
		frames: ['/enemies/BlueCommon/Follow/0.svg', '/enemies/BlueCommon/Follow/1.svg', '/enemies/BlueCommon/Follow/2.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: true
	},
	BlueCommonDie: {
		name: 'BlueCommonDie',
		frames: ['/enemies/BlueCommon/Die/0.svg', '/enemies/BlueCommon/Die/1.svg', '/enemies/BlueCommon/Die/2.svg'],
		framesAmount: 3,
		frameRate: 12,
		loop: false
	},

	GreenCircleEliteFollow: {
		name: 'GreenCircleEliteFollow',
		frames: ['/enemies/GreenCircleElite/Follow/0.svg', '/enemies/GreenCircleElite/Follow/1.svg', '/enemies/GreenCircleElite/Follow/2.svg', '/enemies/GreenCircleElite/Follow/3.svg'],
		framesAmount: 4,
		frameRate: 10,
		loop: true
	},
	GreenCircleEliteDie: {
		name: 'GreenCircleEliteDie',
		frames: ['/enemies/GreenCircleElite/Die/0.svg', '/enemies/GreenCircleElite/Die/1.svg', '/enemies/GreenCircleElite/Die/2.svg'],
		framesAmount: 3,
		frameRate: 12,
		loop: false
	},

	PurpleCommonFollow: {
		name: 'PurpleCommonFollow',
		frames: ['/enemies/PurpleCommon/Follow/0.svg', '/enemies/PurpleCommon/Follow/1.svg', '/enemies/PurpleCommon/Follow/2.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: true
	},
	PurpleCommonDie: {
		name: 'PurpleCommonDie',
		frames: ['/enemies/PurpleCommon/Die/0.svg', '/enemies/PurpleCommon/Die/1.svg', '/enemies/PurpleCommon/Die/2.svg'],
		framesAmount: 3,
		frameRate: 12,
		loop: false
	},

	RedBlobEliteFollow: {
		name: 'RedBlobEliteFollow',
		frames: ['/enemies/RedBlobElite/Follow/0.svg', '/enemies/RedBlobElite/Follow/1.svg', '/enemies/RedBlobElite/Follow/2.svg', '/enemies/RedBlobElite/Follow/3.svg'],
		framesAmount: 4,
		frameRate: 10,
		loop: true
	},
	RedBlobEliteDie: {
		name: 'RedBlobEliteDie',
		frames: ['/enemies/RedBlobElite/Die/0.svg', '/enemies/RedBlobElite/Die/1.svg', '/enemies/RedBlobElite/Die/2.svg'],
		framesAmount: 3,
		frameRate: 12,
		loop: false
	},

	YellowCommonFollow: {
		name: 'YellowCommonFollow',
		frames: ['/enemies/YellowCommon/Follow/0.svg', '/enemies/YellowCommon/Follow/1.svg', '/enemies/YellowCommon/Follow/2.svg', '/enemies/YellowCommon/Follow/3.svg'],
		framesAmount: 4,
		frameRate: 10,
		loop: true
	},
	YellowCommonDie: {
		name: 'YellowCommonDie',
		frames: ['/enemies/YellowCommon/Die/0.svg', '/enemies/YellowCommon/Die/1.svg', '/enemies/YellowCommon/Die/2.svg'],
		framesAmount: 3,
		frameRate: 12,
		loop: false
	},

	// Projectiles
	Click: {
		name: 'Click',
		frames: ['/projectiles/Click/0.svg', '/projectiles/Click/1.svg', '/projectiles/Click/2.svg', '/projectiles/Click/3.svg'],
		framesAmount: 4,
		frameRate: 12,
		loop: false
	},
	FireballFollow: {
		name: 'FireballFollow',
		frames: ['/projectiles/Fireball/Follow/0.svg', '/projectiles/Fireball/Follow/1.svg', '/projectiles/Fireball/Follow/2.svg', '/projectiles/Fireball/Follow/3.svg'],
		framesAmount: 4,
		frameRate: 12,
		loop: true
	},
	FireballDie: {
		name: 'FireballDie',
		frames: ['/projectiles/Fireball/Die/0.svg', '/projectiles/Fireball/Die/1.svg', '/projectiles/Fireball/Die/2.svg'],
		framesAmount: 3,
		frameRate: 12,
		loop: false
	},
	IceboltFollow: {
		name: 'IceboltFollow',
		frames: ['/projectiles/Icebolt/Follow/0.svg', '/projectiles/Icebolt/Follow/1.svg'],
		framesAmount: 2,
		frameRate: 10,
		loop: true
	},
	IceboltDie: {
		name: 'IceboltDie',
		frames: ['/projectiles/Icebolt/Die/0.svg', '/projectiles/Icebolt/Die/1.svg', '/projectiles/Icebolt/Die/2.svg'],
		framesAmount: 3,
		frameRate: 12,
		loop: false
	},
	PoisonballFollow: {
		name: 'PoisonballFollow',
		frames: ['/projectiles/Poisonball/Follow/0.svg', '/projectiles/Poisonball/Follow/1.svg', '/projectiles/Poisonball/Follow/2.svg', '/projectiles/Poisonball/Follow/3.svg'],
		framesAmount: 4,
		frameRate: 12,
		loop: true
	},
	PoisonballDie: {
		name: 'PoisonballDie',
		frames: ['/projectiles/Poisonball/Die/0.svg', '/projectiles/Poisonball/Die/1.svg', '/projectiles/Poisonball/Die/2.svg'],
		framesAmount: 3,
		frameRate: 12,
		loop: false
	},
	ThunderboltFollow: {
		name: 'ThunderboltFollow',
		frames: ['/projectiles/Thunderbolt/Follow/0.svg', '/projectiles/Thunderbolt/Follow/1.svg', '/projectiles/Thunderbolt/Follow/2.svg', '/projectiles/Thunderbolt/Follow/3.svg'],
		framesAmount: 4,
		frameRate: 12,
		loop: true
	},
	ThunderboltDie: {
		name: 'ThunderboltDie',
		frames: ['/projectiles/Thunderbolt/Die/0.svg', '/projectiles/Thunderbolt/Die/1.svg', '/projectiles/Thunderbolt/Die/2.svg'],
		framesAmount: 3,
		frameRate: 12,
		loop: false
	},

	// Tower Base (empty slot)
	TowerBase: {
		name: 'TowerBase',
		frames: ['/towers/Base.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},

	// Fire Tower
	FireTowerBase0: {
		name: 'FireTowerBase0',
		frames: ['/towers/FireTower/Base0.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	FireTowerBase1: {
		name: 'FireTowerBase1',
		frames: ['/towers/FireTower/Base1.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	FireTowerBase2: {
		name: 'FireTowerBase2',
		frames: ['/towers/FireTower/Base2.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	FireTowerUpgrade0: {
		name: 'FireTowerUpgrade0',
		frames: ['/towers/Base.svg', '/towers/Upgrade0.svg', '/towers/FireTower/Base0.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: false
	},
	FireTowerUpgrade1: {
		name: 'FireTowerUpgrade1',
		frames: ['/towers/FireTower/Base0.svg', '/towers/FireTower/Upgrade1.svg', '/towers/FireTower/Base1.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: false
	},
	FireTowerUpgrade2: {
		name: 'FireTowerUpgrade2',
		frames: ['/towers/FireTower/Base1.svg', '/towers/FireTower/Upgrade2.svg', '/towers/FireTower/Base2.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: false
	},

	// Ice Tower
	IceTowerBase0: {
		name: 'IceTowerBase0',
		frames: ['/towers/IceTower/Base0.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	IceTowerBase1: {
		name: 'IceTowerBase1',
		frames: ['/towers/IceTower/Base1.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	IceTowerBase2: {
		name: 'IceTowerBase2',
		frames: ['/towers/IceTower/Base2.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	IceTowerUpgrade0: {
		name: 'IceTowerUpgrade0',
		frames: ['/towers/Base.svg', '/towers/Upgrade0.svg', '/towers/IceTower/Base0.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: false
	},
	IceTowerUpgrade1: {
		name: 'IceTowerUpgrade1',
		frames: ['/towers/IceTower/Base0.svg', '/towers/IceTower/Upgrade1.svg', '/towers/IceTower/Base1.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: false
	},
	IceTowerUpgrade2: {
		name: 'IceTowerUpgrade2',
		frames: ['/towers/IceTower/Base1.svg', '/towers/IceTower/Upgrade2.svg', '/towers/IceTower/Base2.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: false
	},

	// Poison Tower
	PoisonTowerBase0: {
		name: 'PoisonTowerBase0',
		frames: ['/towers/PoisonTower/Base0.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	PoisonTowerBase1: {
		name: 'PoisonTowerBase1',
		frames: ['/towers/PoisonTower/Base1.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	PoisonTowerBase2: {
		name: 'PoisonTowerBase2',
		frames: ['/towers/PoisonTower/Base2.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	PoisonTowerUpgrade0: {
		name: 'PoisonTowerUpgrade0',
		frames: ['/towers/Base.svg', '/towers/Upgrade0.svg', '/towers/PoisonTower/Base0.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: false
	},
	PoisonTowerUpgrade1: {
		name: 'PoisonTowerUpgrade1',
		frames: ['/towers/PoisonTower/Base0.svg', '/towers/PoisonTower/Upgrade1.svg', '/towers/PoisonTower/Base1.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: false
	},
	PoisonTowerUpgrade2: {
		name: 'PoisonTowerUpgrade2',
		frames: ['/towers/PoisonTower/Base1.svg', '/towers/PoisonTower/Upgrade2.svg', '/towers/PoisonTower/Base2.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: false
	},

	// Thunder Tower
	ThunderTowerBase0: {
		name: 'ThunderTowerBase0',
		frames: ['/towers/ThunderTower/Base0.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	ThunderTowerBase1: {
		name: 'ThunderTowerBase1',
		frames: ['/towers/ThunderTower/Base1.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	ThunderTowerBase2: {
		name: 'ThunderTowerBase2',
		frames: ['/towers/ThunderTower/Base2.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	ThunderTowerUpgrade0: {
		name: 'ThunderTowerUpgrade0',
		frames: ['/towers/Base.svg', '/towers/Upgrade0.svg', '/towers/ThunderTower/Base0.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: false
	},
	ThunderTowerUpgrade1: {
		name: 'ThunderTowerUpgrade1',
		frames: ['/towers/ThunderTower/Base0.svg', '/towers/ThunderTower/Upgrade1.svg', '/towers/ThunderTower/Base1.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: false
	},
	ThunderTowerUpgrade2: {
		name: 'ThunderTowerUpgrade2',
		frames: ['/towers/ThunderTower/Base1.svg', '/towers/ThunderTower/Upgrade2.svg', '/towers/ThunderTower/Base2.svg'],
		framesAmount: 3,
		frameRate: 10,
		loop: false
	},

	// Throne
	Throne: {
		name: 'Throne',
		frames: ['/castle/castle.png'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	ThroneDamaged1: {
		name: 'ThroneDamaged1',
		frames: ['/castle/castle-broken.png'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	ThroneDamaged2: {
		name: 'ThroneDamaged2',
		frames: ['/castle/castle-broken2.png'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	ThroneDamaged3: {
		name: 'ThroneDamaged3',
		frames: ['/castle/castle-broken3.png'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	},
	ThroneDestroyed: {
		name: 'ThroneDestroyed',
		frames: ['/castle/castle-destroyed.png'],
		framesAmount: 1,
		frameRate: 0,
		loop: false
	},

	// Loot
	Loot: {
		name: 'Loot',
		frames: ['/loot.svg'],
		framesAmount: 1,
		frameRate: 0,
		loop: true
	}
};

export const getAnimation = (name: string): AnimationDef => {
	const a = animations[name];
	if (!a) throw new Error(`Animation not found: ${name}`);
	return a;
};

export const findAnimationForEntity = (entityName: string): string | null => {
	if (animations[`${entityName}Follow`]) return `${entityName}Follow`;
	if (animations[entityName]) return entityName;
	if (animations[`${entityName}Die`]) return `${entityName}Die`;
	return null;
};

export default animations;
