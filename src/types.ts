import React from 'react';

export interface Station {
  id: string;
  name: string;
  description: string;
  bikes: number;
  electricBikes: number;
  docks: number;
  status: 'available' | 'low-stock' | 'empty';
  distance: string;
  location: string;
  safetyScore: string;
  lat: number;
  lng: number;
}

export const STATIONS: Station[] = [
  {
    id: '1',
    name: 'KL Sentral',
    description: 'Main Transport Hub',
    bikes: 12,
    electricBikes: 4,
    docks: 14,
    status: 'available',
    distance: '0.4 km',
    location: 'Main Entrance, Level 1',
    safetyScore: 'Excellent (4.9/5.0)',
    lat: 3.1344,
    lng: 101.6861,
  },
  {
    id: '2',
    name: 'Pasar Seni',
    description: 'Cultural Hub',
    bikes: 8,
    electricBikes: 2,
    docks: 20,
    status: 'available',
    distance: '1.2 km',
    location: 'LRT Station Entrance',
    safetyScore: 'Good (4.5/5.0)',
    lat: 3.1425,
    lng: 101.6955,
  },
  {
    id: '3',
    name: 'Bukit Bintang',
    description: 'Shopping District',
    bikes: 2,
    electricBikes: 0,
    docks: 28,
    status: 'low-stock',
    distance: '2.1 km',
    location: 'Pavilion KL Side Entrance',
    safetyScore: 'Excellent (4.8/5.0)',
    lat: 3.1478,
    lng: 101.7137,
  },
  {
    id: '4',
    name: 'TRX',
    description: 'Financial Center',
    bikes: 0,
    electricBikes: 0,
    docks: 30,
    status: 'empty',
    distance: '2.8 km',
    location: 'Exchange 106 Plaza',
    safetyScore: 'Excellent (5.0/5.0)',
    lat: 3.1422,
    lng: 101.7185,
  },
  {
    id: '5',
    name: 'KLCC',
    description: 'Twin Towers',
    bikes: 15,
    electricBikes: 6,
    docks: 9,
    status: 'available',
    distance: '3.2 km',
    location: 'Suria KLCC Park Entrance',
    safetyScore: 'Excellent (4.9/5.0)',
    lat: 3.1579,
    lng: 101.7116,
  },
  {
    id: '6',
    name: 'Ampang Park',
    description: 'Business District',
    bikes: 10,
    electricBikes: 3,
    docks: 17,
    status: 'available',
    distance: '3.5 km',
    location: 'LRT Ampang Park Entrance',
    safetyScore: 'Excellent (4.7/5.0)',
    lat: 3.1598,
    lng: 101.7191,
  },
  {
    id: '7',
    name: 'Bangsar',
    description: 'Lifestyle Hub',
    bikes: 9,
    electricBikes: 3,
    docks: 18,
    status: 'available',
    distance: '3.8 km',
    location: 'LRT Bangsar Entrance',
    safetyScore: 'Excellent (4.7/5.0)',
    lat: 3.1274,
    lng: 101.6781,
  },
  {
    id: '8',
    name: 'Mid Valley',
    description: 'Mega Mall',
    bikes: 18,
    electricBikes: 6,
    docks: 6,
    status: 'available',
    distance: '4.0 km',
    location: 'KTM Mid Valley Entrance',
    safetyScore: 'Excellent (4.9/5.0)',
    lat: 3.1174,
    lng: 101.6771,
  },
  {
    id: '9',
    name: 'Abdullah Hukum',
    description: 'KL Eco City',
    bikes: 11,
    electricBikes: 4,
    docks: 15,
    status: 'available',
    distance: '4.1 km',
    location: 'LRT Abdullah Hukum Link Bridge',
    safetyScore: 'Excellent (4.8/5.0)',
    lat: 3.1184,
    lng: 101.6731,
  },
  {
    id: '10',
    name: 'Cochrane',
    description: 'IKEA & MyTOWN',
    bikes: 12,
    electricBikes: 4,
    docks: 14,
    status: 'available',
    distance: '4.5 km',
    location: 'MRT Cochrane Exit A',
    safetyScore: 'Excellent (4.8/5.0)',
    lat: 3.1328,
    lng: 101.7231,
  },
];

export interface Ride {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  duration: string;
  distance: string;
  cost: string;
  status: 'completed' | 'active';
  bikeType: 'standard' | 'electric';
  dockNumber?: string;
  passcode?: string;
}

export const RECENT_RIDES: Ride[] = [
  {
    id: 'KLR-88291',
    from: 'KLCC',
    to: 'Bukit Bintang',
    date: 'Oct 24, 2023',
    time: '14:20 PM',
    duration: '18 min',
    distance: '2.4 km',
    cost: 'RM 2.00',
    status: 'completed',
    bikeType: 'standard',
  },
  {
    id: 'KLR-88292',
    from: 'KL Sentral',
    to: 'Pasar Seni',
    date: 'Oct 22, 2023',
    time: '08:45 AM',
    duration: '25 min',
    distance: '3.8 km',
    cost: 'RM 3.00',
    status: 'completed',
    bikeType: 'electric',
  },
  {
    id: 'KLR-88293',
    from: 'TRX',
    to: 'Ampang Park',
    date: 'Oct 20, 2023',
    time: '18:10 PM',
    duration: '12 min',
    distance: '1.5 km',
    cost: 'RM 2.00',
    status: 'completed',
    bikeType: 'standard',
  },
];
