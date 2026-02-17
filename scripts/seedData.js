// Sample Data Seeder for Zpluse Security
// Run this file ONCE after Firebase is configured to populate initial data

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../src/config/firebase';

// ==================== SAMPLE DATA ====================

const sampleGuards = [
    {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@zplusesecurity.com',
        phone: '+91 98765 43210',
        assignedSite: 'Main Office Building',
        position: 'Main Gate',
        shift: 'Day Shift (6AM-2PM)',
        status: 'on-duty',
        licenseNumber: 'SEC-2024-001',
        joiningDate: '2024-01-15'
    },
    {
        name: 'Amit Singh',
        email: 'amit.singh@zplusesecurity.com',
        phone: '+91 98765 43211',
        assignedSite: 'Main Office Building',
        position: 'Lobby',
        shift: 'Day Shift (6AM-2PM)',
        status: 'on-duty',
        licenseNumber: 'SEC-2024-002',
        joiningDate: '2024-01-20'
    },
    {
        name: 'Suresh Patel',
        email: 'suresh.patel@zplusesecurity.com',
        phone: '+91 98765 43212',
        assignedSite: 'Warehouse Complex',
        position: 'Perimeter',
        shift: 'Day Shift (6AM-2PM)',
        status: 'on-duty',
        licenseNumber: 'SEC-2024-003',
        joiningDate: '2024-02-01'
    },
    {
        name: 'Vijay Sharma',
        email: 'vijay.sharma@zplusesecurity.com',
        phone: '+91 98765 43213',
        assignedSite: 'Residential Tower A',
        position: 'Main Entrance',
        shift: 'Day Shift (6AM-2PM)',
        status: 'on-break',
        licenseNumber: 'SEC-2024-004',
        joiningDate: '2024-02-05'
    },
    {
        name: 'Prakash Reddy',
        email: 'prakash.reddy@zplusesecurity.com',
        phone: '+91 98765 43214',
        assignedSite: 'Tech Park Campus',
        position: 'Reception',
        shift: 'Night Shift (10PM-6AM)',
        status: 'off-duty',
        licenseNumber: 'SEC-2024-005',
        joiningDate: '2024-01-10'
    }
];

const sampleClients = [
    {
        companyName: 'Tech Corp India',
        contactPerson: 'Mr. Rajiv Sharma',
        email: 'contact@techcorp.com',
        phone: '+91 11 2345 6789',
        location: 'Cyber City, Sector 5',
        address: 'Plot 123, Tech Park, Cyber City, Gurgaon - 122002',
        guardsAssigned: 8,
        contractStatus: 'active',
        contractStartDate: '2024-01-01',
        contractEndDate: '2024-12-31'
    },
    {
        companyName: 'Global Finance Solutions',
        contactPerson: 'Ms. Priya Gupta',
        email: 'security@globalfinance.com',
        phone: '+91 22 9876 5432',
        location: 'BKC, Mumbai',
        address: 'Tower B, Financial District, BKC, Mumbai - 400051',
        guardsAssigned: 12,
        contractStatus: 'active',
        contractStartDate: '2024-02-01',
        contractEndDate: '2025-01-31'
    },
    {
        companyName: 'Green Valley Residency',
        contactPerson: 'Mr. Arun Verma',
        email: 'admin@greenvalley.com',
        phone: '+91 80 1234 5678',
        location: 'Whitefield, Bangalore',
        address: 'Green Valley Complex, Whitefield Main Road, Bangalore - 560066',
        guardsAssigned: 6,
        contractStatus: 'active',
        contractStartDate: '2024-01-15',
        contractEndDate: '2024-07-14'
    },
    {
        companyName: 'Metro Hospital',
        contactPerson: 'Dr. Sunita Mehta',
        email: 'security@metrohospital.com',
        phone: '+91 11 4567 8901',
        location: 'South Delhi',
        address: 'Metro Hospital Campus, Lajpat Nagar, New Delhi - 110024',
        guardsAssigned: 10,
        contractStatus: 'active',
        contractStartDate: '2023-12-01',
        contractEndDate: '2024-11-30'
    }
];

const sampleIncidents = [
    {
        title: 'Unauthorized Vehicle Attempt',
        description: 'Unknown vehicle attempted entry without proper authorization. Driver did not have valid entry pass. Vehicle was stopped at main gate and turned away.',
        site: 'Main Office Building',
        reportedBy: 'Rajesh Kumar',
        severity: 'medium',
        status: 'resolved',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
    },
    {
        title: 'Suspicious Activity - Parking Area',
        description: 'Unidentified person loitering in restricted parking zone. Person was approached and asked to leave the premises. No incident occurred.',
        site: 'Warehouse Complex',
        reportedBy: 'Suresh Patel',
        severity: 'high',
        status: 'investigating',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    },
    {
        title: 'Equipment Malfunction',
        description: 'CCTV camera #3 temporarily offline due to power fluctuation. Maintenance team notified. Camera restored to working condition.',
        site: 'Residential Tower A',
        reportedBy: 'Vijay Sharma',
        severity: 'low',
        status: 'resolved',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        resolvedAt: new Date(Date.now() - 22 * 60 * 60 * 1000) // 22 hours ago
    }
];

const sampleActivities = [
    {
        message: 'Rajesh Kumar checked in at Main Gate',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
    },
    {
        message: 'New incident report submitted by Suresh Patel',
        type: 'warning',
        timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
    },
    {
        message: 'Shift change completed at Residential Tower A',
        type: 'info',
        timestamp: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
    },
    {
        message: 'Monthly security report generated',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
        message: 'Patrol round completed - Warehouse Complex',
        type: 'success',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    }
];

// ==================== SEEDING FUNCTIONS ====================

const seedGuards = async () => {
    console.log('🔄 Seeding guards...');
    const guardsRef = collection(db, 'guards');
    
    for (const guard of sampleGuards) {
        try {
            await addDoc(guardsRef, {
                ...guard,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            console.log(`✅ Added guard: ${guard.name}`);
        } catch (error) {
            console.error(`❌ Error adding guard ${guard.name}:`, error);
        }
    }
};

const seedClients = async () => {
    console.log('🔄 Seeding clients...');
    const clientsRef = collection(db, 'clients');
    
    for (const client of sampleClients) {
        try {
            await addDoc(clientsRef, {
                ...client,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            console.log(`✅ Added client: ${client.companyName}`);
        } catch (error) {
            console.error(`❌ Error adding client ${client.companyName}:`, error);
        }
    }
};

const seedIncidents = async () => {
    console.log('🔄 Seeding incidents...');
    const incidentsRef = collection(db, 'incidents');
    
    for (const incident of sampleIncidents) {
        try {
            await addDoc(incidentsRef, {
                ...incident,
                photos: [],
                updatedAt: serverTimestamp()
            });
            console.log(`✅ Added incident: ${incident.title}`);
        } catch (error) {
            console.error(`❌ Error adding incident ${incident.title}:`, error);
        }
    }
};

const seedActivities = async () => {
    console.log('🔄 Seeding activities...');
    const activitiesRef = collection(db, 'activities');
    
    for (const activity of sampleActivities) {
        try {
            await addDoc(activitiesRef, activity);
            console.log(`✅ Added activity: ${activity.message}`);
        } catch (error) {
            console.error(`❌ Error adding activity:`, error);
        }
    }
};

// ==================== MAIN SEEDING FUNCTION ====================

export const seedAllData = async () => {
    console.log('🌱 Starting data seeding process...\n');
    
    try {
        await seedGuards();
        console.log('\n');
        
        await seedClients();
        console.log('\n');
        
        await seedIncidents();
        console.log('\n');
        
        await seedActivities();
        console.log('\n');
        
        console.log('✅ Data seeding completed successfully!');
        console.log('📊 Check your Firebase Console → Firestore Database to verify.');
        
    } catch (error) {
        console.error('❌ Error during data seeding:', error);
    }
};

// ==================== USAGE INSTRUCTIONS ====================

/*
HOW TO USE THIS SEEDER:

1. Make sure Firebase is configured in src/config/firebase.js
2. Create a new file: src/utils/runSeeder.js with this content:

import { seedAllData } from './seedData';
seedAllData();

3. Temporarily add this to your main.jsx:
import './utils/runSeeder';

4. Run the app: npm run dev
5. Open browser console to see seeding progress
6. After seeding is done, remove the import from main.jsx
7. Refresh Firebase Console to see the data

IMPORTANT: Only run this ONCE to avoid duplicate data!
*/

export default seedAllData;
