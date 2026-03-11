require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User'); // if needed
const Manufacturer = require('./src/models/Manufacturer');
const Weapon = require('./src/models/Weapon');
const Fighter = require('./src/models/Fighter');

const manufacturers = [
  { name: 'Lockheed Martin', country: 'USA' },
  { name: 'Boeing', country: 'USA' },
  { name: 'Sukhoi', country: 'Russia' },
  { name: 'Mikoyan', country: 'Russia' },
  { name: 'Eurofighter', country: 'UK' },
  { name: 'Dassault', country: 'France' },
  { name: 'Chengdu', country: 'China' },
];

const weapons = [
  { name: 'AIM-120 AMRAAM', type: 'air-to-air', range: 180 },
  { name: 'AIM-9X Sidewinder', type: 'air-to-air', range: 35 },
  { name: 'R-77 (AA-12)', type: 'air-to-air', range: 110 },
  { name: 'R-73 (AA-11)', type: 'air-to-air', range: 30 },
  { name: 'AGM-158 JASSM', type: 'air-to-ground', range: 370 },
  { name: 'Kh-101', type: 'air-to-ground', range: 4500 },
  { name: 'GBU-31 JDAM', type: 'air-to-ground', range: 24 },
  { name: 'Meteor', type: 'air-to-air', range: 200 },
  { name: 'PL-15', type: 'air-to-air', range: 200 },
  { name: 'PL-10', type: 'air-to-air', range: 20 },
  { name: 'Kh-102', type: 'air-to-ground', range: 4800 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional)
    await Manufacturer.deleteMany({});
    await Weapon.deleteMany({});
    await Fighter.deleteMany({});
    console.log('Cleared existing data');

    // Insert manufacturers
    const createdManufacturers = await Manufacturer.insertMany(manufacturers);
    console.log('Manufacturers added');

    // Insert weapons
    const createdWeapons = await Weapon.insertMany(weapons);
    console.log('Weapons added');

    // Map names to IDs for easy reference
    const manuMap = {};
    createdManufacturers.forEach(m => manuMap[m.name] = m._id);
    const weaponMap = {};
    createdWeapons.forEach(w => weaponMap[w.name] = w._id);

    const fighters = [
      {
        name: 'F-22 Raptor',
        type: 'fighter',
        manufacturer: manuMap['Lockheed Martin'],
        topSpeed: 2.25,
        maneuverability: 'extremely high',
        stability: 9,
        defense: 'stealth',
        airToAirCapability: 'excellent',
        airToGroundCapability: 'fair',
        weapons: [weaponMap['AIM-120 AMRAAM'], weaponMap['AIM-9X Sidewinder']],
      },
      {
        name: 'Su-57',
        type: 'fighter',
        manufacturer: manuMap['Sukhoi'],
        topSpeed: 2.0,
        maneuverability: 'extremely high',
        stability: 8,
        defense: 'stealth',
        airToAirCapability: 'excellent',
        airToGroundCapability: 'good',
        weapons: [weaponMap['R-77 (AA-12)'], weaponMap['R-73 (AA-11)'], weaponMap['Kh-101']],
      },
      {
        name: 'F-35 Lightning II',
        type: 'multirole',
        manufacturer: manuMap['Lockheed Martin'],
        topSpeed: 1.6,
        maneuverability: 'high',
        stability: 8,
        defense: 'stealth',
        airToAirCapability: 'good',
        airToGroundCapability: 'excellent',
        weapons: [weaponMap['AIM-120 AMRAAM'], weaponMap['AIM-9X Sidewinder'], weaponMap['GBU-31 JDAM']],
      },
      {
        name: 'Su-35',
        type: 'fighter',
        manufacturer: manuMap['Sukhoi'],
        topSpeed: 2.25,
        maneuverability: 'high',
        stability: 8,
        defense: 'chaff',
        airToAirCapability: 'excellent',
        airToGroundCapability: 'good',
        weapons: [weaponMap['R-77 (AA-12)'], weaponMap['R-73 (AA-11)']],
      },
      {
        name: 'MiG-35',
        type: 'fighter',
        manufacturer: manuMap['Mikoyan'],
        topSpeed: 2.0,
        maneuverability: 'high',
        stability: 7,
        defense: 'chaff',
        airToAirCapability: 'good',
        airToGroundCapability: 'good',
        weapons: [weaponMap['R-77 (AA-12)'], weaponMap['R-73 (AA-11)']],
      },
      {
        name: 'F-15EX',
        type: 'fighter',
        manufacturer: manuMap['Boeing'],
        topSpeed: 2.5,
        maneuverability: 'medium',
        stability: 9,
        defense: 'chaff',
        airToAirCapability: 'excellent',
        airToGroundCapability: 'excellent',
        weapons: [weaponMap['AIM-120 AMRAAM'], weaponMap['AIM-9X Sidewinder'], weaponMap['AGM-158 JASSM']],
      },
      {
        name: 'Eurofighter Typhoon',
        type: 'multirole',
        manufacturer: manuMap['Eurofighter'],
        topSpeed: 2.0,
        maneuverability: 'high',
        stability: 8,
        defense: 'chaff',
        airToAirCapability: 'excellent',
        airToGroundCapability: 'good',
        weapons: [weaponMap['Meteor'], weaponMap['AIM-9X Sidewinder'], weaponMap['GBU-31 JDAM']],
      },
      {
        name: 'Rafale',
        type: 'multirole',
        manufacturer: manuMap['Dassault'],
        topSpeed: 1.8,
        maneuverability: 'high',
        stability: 8,
        defense: 'chaff',
        airToAirCapability: 'excellent',
        airToGroundCapability: 'excellent',
        weapons: [weaponMap['Meteor'], weaponMap['AIM-9X Sidewinder'], weaponMap['AGM-158 JASSM']],
      },
      {
        name: 'J-20',
        type: 'fighter',
        manufacturer: manuMap['Chengdu'],
        topSpeed: 2.0,
        maneuverability: 'high',
        stability: 7,
        defense: 'stealth',
        airToAirCapability: 'good',
        airToGroundCapability: 'fair',
        weapons: [weaponMap['PL-15'], weaponMap['PL-10']],
      },
      {
        name: 'B-2 Spirit',
        type: 'bomber',
        manufacturer: manuMap['Boeing'],
        topSpeed: 0.95,
        maneuverability: 'low',
        stability: 10,
        defense: 'stealth',
        airToAirCapability: 'poor',
        airToGroundCapability: 'excellent',
        weapons: [weaponMap['GBU-31 JDAM'], weaponMap['AGM-158 JASSM']],
      },
      {
        name: 'B-1B Lancer',
        type: 'bomber',
        manufacturer: manuMap['Boeing'],
        topSpeed: 1.2,
        maneuverability: 'low',
        stability: 9,
        defense: 'chaff',
        airToAirCapability: 'poor',
        airToGroundCapability: 'excellent',
        weapons: [weaponMap['AGM-158 JASSM'], weaponMap['GBU-31 JDAM']],
      },
      {
        name: 'Tu-160',
        type: 'bomber',
        manufacturer: manuMap['Mikoyan'],
        topSpeed: 2.0,
        maneuverability: 'low',
        stability: 8,
        defense: 'chaff',
        airToAirCapability: 'poor',
        airToGroundCapability: 'excellent',
        weapons: [weaponMap['Kh-101'], weaponMap['Kh-102']],
      },
    ];

    await Fighter.insertMany(fighters);
    console.log('Fighters added');

    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.connection.close();
  }
}

seed();