/**
 * Contract Configuration and ABI
 */

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

export const CONTRACT_ABI = [
  // Read functions
  'function owner() view returns (address)',
  'function museumManager() view returns (address)',
  'function totalExhibitions() view returns (uint32)',
  'function totalRegisteredVisitors() view returns (uint32)',
  'function exhibitions(uint32) view returns (string name, uint8 exhibitionType, uint32 startDate, uint32 endDate, bool isActive, uint256 privateVisitorCount, uint32 publicVisitorCount)',
  'function visitorProfiles(address) view returns (bool isRegistered, uint256 encryptedAge, uint256 encryptedAgeGroup, uint32 totalVisits, uint32 registrationDate)',
  'function visitRecords(address, uint32) view returns (uint32 exhibitionId, uint256 encryptedTimestamp, uint256 encryptedSatisfaction, uint256 encryptedDuration, uint256 encryptedInterestLevel, bool isRecorded)',

  // Write functions
  'function registerVisitor(bytes calldata encryptedAge, bytes calldata proof) external',
  'function createExhibition(string memory name, uint8 exhibitionType, uint32 startDate, uint32 endDate) external',
  'function recordPrivateVisit(uint32 exhibitionId, bytes calldata encryptedData, bytes calldata proof) external',
  'function setExhibitionStatus(uint32 exhibitionId, bool isActive) external',
  'function setMuseumManager(address _manager) external',

  // Events
  'event ExhibitionCreated(uint32 indexed exhibitionId, string name, uint8 exhibitionType)',
  'event VisitorRegistered(address indexed visitor, uint32 timestamp)',
  'event PrivateVisitRecorded(address indexed visitor, uint32 indexed exhibitionId)',
  'event SatisfactionRecorded(uint32 indexed exhibitionId, address indexed visitor)',
];

export enum ExhibitionType {
  History = 0,
  Art = 1,
  Science = 2,
  Culture = 3,
  Technology = 4,
  Nature = 5,
}

export const EXHIBITION_TYPE_NAMES: Record<ExhibitionType, string> = {
  [ExhibitionType.History]: 'History',
  [ExhibitionType.Art]: 'Art',
  [ExhibitionType.Science]: 'Science',
  [ExhibitionType.Culture]: 'Culture',
  [ExhibitionType.Technology]: 'Technology',
  [ExhibitionType.Nature]: 'Nature',
};

export const EXHIBITION_TYPE_COLORS: Record<ExhibitionType, string> = {
  [ExhibitionType.History]: '#8B4513',
  [ExhibitionType.Art]: '#FF6B9D',
  [ExhibitionType.Science]: '#4A90E2',
  [ExhibitionType.Culture]: '#F39C12',
  [ExhibitionType.Technology]: '#9B59B6',
  [ExhibitionType.Nature]: '#27AE60',
};
