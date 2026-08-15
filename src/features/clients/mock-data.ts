import type { ExtendedClient } from './types';

const CLIENTS = [
  'Telecom Plus DZ', 'Mobilis Store Algiers', 'Optimum Telecom', 'Djezzy Distribution',
  'Ooredoo Partner', 'Algérie Télécom', 'Batna Mobile Center', 'Oran Digital Shop',
  'Constantine Connect', 'Sétif Wireless', 'Tlemcen Tech', 'Annaba Mobile',
  'Biskra Telecom', 'Blida Digital', 'Tizi Ouzou Connect',
];

const DELEGATES = [
  'Yacine B.', 'Amine K.', 'Sofiane M.', 'Rachid T.', 'Karim A.',
  'Mohamed S.', 'Omar F.', 'Ali B.', 'Youcef H.', 'Abdelkader D.',
];

const REGIONS = [
  'Algiers', 'Oran', 'Constantine', 'Annaba', 'Batna',
  'Sétif', 'Blida', 'Tizi Ouzou', 'Biskra', 'Tlemcen',
];

const WILAYAS = [
  'Alger', 'Oran', 'Constantine', 'Annaba', 'Batna',
  'Sétif', 'Blida', 'Tizi Ouzou', 'Biskra', 'Tlemcen',
  'Béjaïa', 'Chlef', 'Djelfa', "M'sila", 'Mascara',
];

const CLIENT_TYPES: ExtendedClient['clientType'][] = ['retail', 'wholesale', 'corporate', 'government'];
const STATUSES: ExtendedClient['status'][] = ['active', 'inactive', 'pending', 'blocked'];

function generateClientCode(index: number): string {
  return `CLI-${String(1000 + index).padStart(6, '0')}`;
}

function generateClientEmail(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 12);
  return `contact@${slug}.dz`;
}

function generateClientPhone(index: number): string {
  return `0550${String(100000 + index * 11111).slice(-6)}`;
}

function generateAddress(index: number, wilaya: string): string {
  return `${(index % 50) + 1} Rue ${(index % 20) + 1}, ${wilaya}`;
}

export function generateExtendedClients(count: number): ExtendedClient[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const name = CLIENTS[i % CLIENTS.length];
    const delegateIdx = i % DELEGATES.length;
    const regionIdx = i % REGIONS.length;
    const wilayaIdx = i % WILAYAS.length;
    const clientType = CLIENT_TYPES[i % CLIENT_TYPES.length];
    const status = i % 7 === 0 ? 'inactive' : i % 13 === 0 ? 'blocked' : i % 11 === 0 ? 'pending' : 'active';
    const creditLimit = [500000, 1000000, 2500000, 5000000][i % 4];
    const totalSpent = 150000 + i * 45000;
    const outstandingBalance = status === 'active' ? Math.floor(totalSpent * 0.15) : 0;

    const daysAgo = i % 30;
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - (90 + i * 2));
    const lastOrderDate = new Date(now);
    lastOrderDate.setDate(lastOrderDate.getDate() - daysAgo);

    return {
      id: `client-${i + 1}`,
      clientCode: generateClientCode(i),
      name,
      email: generateClientEmail(name),
      phone: generateClientPhone(i),
      address: generateAddress(i, WILAYAS[wilayaIdx]),
      region: REGIONS[regionIdx],
      wilaya: WILAYAS[wilayaIdx],
      delegateId: `delegate-${delegateIdx + 1}`,
      delegateName: DELEGATES[delegateIdx],
      totalOrders: 15 + i * 3,
      totalSpent,
      clientType,
      creditLimit,
      outstandingBalance,
      status: status as ExtendedClient['status'],
      lastOrderDate: lastOrderDate.toISOString(),
      createdAt: createdAt.toISOString(),
    };
  });
}

export const mockClients = generateExtendedClients(60);
