# API Documentation - Museum Visit Tracker

## Contract Interface

Complete API reference for the Privacy-Preserving Museum Visit Tracking System.

---

## Core Functions

### Exhibition Management

#### `createExhibition`

Create a new museum exhibition.

```solidity
function createExhibition(
    string memory _name,
    ExhibitionType _type,
    uint32 _startDate,
    uint32 _endDate
) external onlyMuseumManager
```

**Parameters:**
- `_name` (string): Exhibition name (1-256 characters)
- `_type` (ExhibitionType): Exhibition type (History, Art, Science, Culture, Technology, Nature)
- `_startDate` (uint32): Start timestamp (Unix time)
- `_endDate` (uint32): End timestamp (Unix time)

**Requirements:**
- Caller must be museum manager or owner
- Name length: 1-256 characters
- End date must be after start date
- No overflow: totalExhibitions < uint32.max

**Events:**
- `ExhibitionCreated(exhibitionId, name, type)`

**Example:**
```javascript
await contract.createExhibition(
    "Ancient Egypt",
    0, // History
    1735689600, // Jan 1, 2025
    1767225600  // Jan 1, 2026
);
```

---

#### `setExhibitionStatus`

Activate or deactivate an exhibition.

```solidity
function setExhibitionStatus(
    uint32 _exhibitionId,
    bool _isActive
) external onlyMuseumManager validExhibition(_exhibitionId)
```

**Parameters:**
- `_exhibitionId` (uint32): Exhibition ID
- `_isActive` (bool): Active status

**Requirements:**
- Caller must be museum manager or owner
- Exhibition must exist

---

### Visitor Management

#### `registerVisitor`

Register as a visitor with encrypted age.

```solidity
function registerVisitor(uint8 _age) external
```

**Parameters:**
- `_age` (uint8): Visitor age (1-119 years)

**Requirements:**
- Visitor not already registered
- Age between 1 and 119
- No overflow: totalRegisteredVisitors < uint32.max

**Privacy:**
- Age encrypted before storage
- Age group derived and encrypted
- Only aggregate age group statistics visible

**Events:**
- `VisitorRegistered(visitor, timestamp)`

**Example:**
```javascript
await contract.registerVisitor(28); // Age 28, classified as Adult
```

---

#### `recordPrivateVisit`

Record a private visit to an exhibition.

```solidity
function recordPrivateVisit(
    uint32 _exhibitionId,
    uint8 _satisfaction,
    uint32 _duration,
    uint8 _interestLevel
) external onlyRegisteredVisitor validExhibition(_exhibitionId)
```

**Parameters:**
- `_exhibitionId` (uint32): Exhibition ID
- `_satisfaction` (uint8): Satisfaction rating (1-10)
- `_duration` (uint32): Visit duration in minutes (1-1440)
- `_interestLevel` (uint8): Interest level (1-5)

**Requirements:**
- Caller must be registered visitor
- Exhibition must exist and be active
- Satisfaction: 1-10
- Interest: 1-5
- Duration: 1-1440 minutes (max 24 hours)
- Visit not already recorded

**Privacy:**
- All parameters encrypted before storage
- Individual data never revealed
- Only aggregate statistics computable

**Events:**
- `PrivateVisitRecorded(visitor, exhibitionId)`
- `SatisfactionRecorded(exhibitionId, visitor)`

**Example:**
```javascript
await contract.recordPrivateVisit(
    1,    // Exhibition ID
    9,    // Very satisfied
    120,  // 2 hours
    5     // Very interested
);
```

---

## Gateway Callback Functions

### `requestExhibitionStats`

Request decryption of exhibition statistics via Gateway.

```solidity
function requestExhibitionStats(uint32 _exhibitionId)
    external
    onlyMuseumManager
    validExhibition(_exhibitionId)
```

**Parameters:**
- `_exhibitionId` (uint32): Exhibition ID

**Requirements:**
- Caller must be museum manager or owner
- Exhibition must exist
- No pending decryption for this exhibition
- At least one visitor recorded

**Process:**
1. Prepares encrypted visitor count and satisfaction sum
2. Calls Gateway via `FHE.requestDecryption()`
3. Creates tracking request with unique ID
4. Sets exhibition status to "decryption pending"

**Events:**
- `StatisticsRequested(exhibitionId, requester, requestId)`

**Returns:** Transaction hash (request ID retrievable from event)

**Example:**
```javascript
const tx = await contract.requestExhibitionStats(1);
const receipt = await tx.wait();
const event = receipt.events.find(e => e.event === 'StatisticsRequested');
const requestId = event.args.requestId;
console.log(`Request ID: ${requestId}`);
```

---

### `processStatsReveal`

**[Gateway Callback]** Process decrypted statistics from Gateway.

```solidity
function processStatsReveal(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external nonReentrant
```

**Parameters:**
- `requestId` (uint256): Decryption request ID
- `cleartexts` (bytes): ABI-encoded decrypted values
- `decryptionProof` (bytes): Cryptographic proof from Gateway

**Requirements:**
- Request must exist and be pending
- Callback not already called
- Valid decryption proof

**Process:**
1. Verifies Gateway proof via `FHE.checkSignatures()`
2. Decodes cleartext values (visitorCount, satisfactionSum)
3. Stores revealed data in contract state
4. Updates request status to Completed
5. Resets decryption pending flag

**Events:**
- On Success:
  - `StatisticsRevealed(exhibitionId, visitorCount, satisfactionSum)`
  - `CallbackExecuted(requestId, exhibitionId)`
- On Failure:
  - `DecryptionFailed(requestId, exhibitionId)`

**Note:** This function is called automatically by Gateway. Frontend should monitor events, not call directly.

---

## Timeout Protection Functions

### `checkDecryptionTimeout`

Check if a decryption request has timed out.

```solidity
function checkDecryptionTimeout(uint256 requestId)
    public
    view
    returns (bool isTimedOut)
```

**Parameters:**
- `requestId` (uint256): Decryption request ID

**Returns:**
- `isTimedOut` (bool): True if timed out (24 hours elapsed)

**Example:**
```javascript
const requestId = 12345;
const isTimedOut = await contract.checkDecryptionTimeout(requestId);
if (isTimedOut) {
    console.log("Request has timed out");
}
```

---

### `markDecryptionTimeout`

Mark a timed out decryption request.

```solidity
function markDecryptionTimeout(uint256 requestId) external
```

**Parameters:**
- `requestId` (uint256): Decryption request ID

**Requirements:**
- Request must have timed out (24 hours elapsed)
- Request status must be Pending

**Process:**
1. Validates timeout occurred
2. Changes status to TimedOut
3. Resets decryption pending flag

**Events:**
- `DecryptionTimedOut(requestId, exhibitionId)`

**Note:** Anyone can call this function after timeout period. This enables community-driven timeout enforcement.

**Example:**
```javascript
await contract.markDecryptionTimeout(12345);
```

---

## Refund Functions

### `claimDecryptionRefund`

Claim refund for failed or timed out decryption.

```solidity
function claimDecryptionRefund(uint32 _exhibitionId)
    external
    onlyMuseumManager
    validExhibition(_exhibitionId)
    nonReentrant
```

**Parameters:**
- `_exhibitionId` (uint32): Exhibition ID

**Requirements:**
- Caller must be museum manager or owner
- Decryption request must exist
- Refund not already claimed
- Request status is Failed, TimedOut, or timeout elapsed
- Within refund window (48 hours from request)

**Eligibility Conditions:**
- Request status is `RequestStatus.Failed` OR
- Request status is `RequestStatus.TimedOut` OR
- `checkDecryptionTimeout()` returns true

**Time Windows:**
- Decryption timeout: 24 hours
- Refund window: 48 hours from request timestamp

**Events:**
- `RefundClaimed(exhibitionId, claimer)`

**Example:**
```javascript
// After decryption fails or times out
await contract.claimDecryptionRefund(1);
```

---

## Query Functions

### `getRevealedStats`

Get revealed exhibition statistics with privacy protection.

```solidity
function getRevealedStats(uint32 _exhibitionId)
    external
    view
    validExhibition(_exhibitionId)
    returns (uint256 avgSatisfaction, uint32 visitorCount)
```

**Parameters:**
- `_exhibitionId` (uint32): Exhibition ID

**Returns:**
- `avgSatisfaction` (uint256): Average satisfaction × 1000 (for precision)
- `visitorCount` (uint32): Total visitor count

**Requirements:**
- Exhibition must exist
- Statistics must be revealed (decryption completed)

**Privacy Protection:**
1. **Division Multiplier**: Result multiplied by 1000 for precision
2. **Small Sample Noise**: For < 5 visitors, adds deterministic noise

**Calculating Actual Average:**
```javascript
const { avgSatisfaction, visitorCount } = await contract.getRevealedStats(1);
const actualAverage = avgSatisfaction / 1000; // Divide by PRIVACY_MULTIPLIER
console.log(`Average: ${actualAverage}, Visitors: ${visitorCount}`);
```

**Example Output:**
```
avgSatisfaction = 8500  // Represents 8.5
visitorCount = 10
Actual average = 8.5 out of 10
```

---

### `getExhibitionInfo`

Get basic exhibition information (non-sensitive).

```solidity
function getExhibitionInfo(uint32 _exhibitionId)
    external
    view
    validExhibition(_exhibitionId)
    returns (
        string memory name,
        ExhibitionType exhibitionType,
        uint32 startDate,
        uint32 endDate,
        bool isActive,
        uint32 publicVisitorCount
    )
```

**Parameters:**
- `_exhibitionId` (uint32): Exhibition ID

**Returns:**
- `name` (string): Exhibition name
- `exhibitionType` (ExhibitionType): Type (0-5)
- `startDate` (uint32): Start timestamp
- `endDate` (uint32): End timestamp
- `isActive` (bool): Active status
- `publicVisitorCount` (uint32): Total visitors (public counter)

**Note:** This function does NOT reveal encrypted statistics.

---

### `getRequestStatus`

Get comprehensive status of a decryption request.

```solidity
function getRequestStatus(uint256 requestId)
    external
    view
    returns (
        uint32 exhibitionId,
        address requester,
        uint256 timestamp,
        RequestStatus status,
        bool callbackCalled,
        bool isTimedOut
    )
```

**Parameters:**
- `requestId` (uint256): Request ID

**Returns:**
- `exhibitionId` (uint32): Associated exhibition
- `requester` (address): Who requested decryption
- `timestamp` (uint256): Request timestamp
- `status` (RequestStatus): Current status (Pending/Completed/Failed/TimedOut)
- `callbackCalled` (bool): Whether callback was executed
- `isTimedOut` (bool): Whether timeout period elapsed

**Request Status Enum:**
```solidity
enum RequestStatus {
    Pending,    // 0: Awaiting Gateway callback
    Completed,  // 1: Successfully decrypted
    Failed,     // 2: Decryption failed
    TimedOut    // 3: Timeout period elapsed
}
```

**Example:**
```javascript
const status = await contract.getRequestStatus(12345);
console.log(`Status: ${['Pending', 'Completed', 'Failed', 'TimedOut'][status.status]}`);
console.log(`Timed Out: ${status.isTimedOut}`);
```

---

### `getMyVisitRecord`

Check if current user visited an exhibition.

```solidity
function getMyVisitRecord(uint32 _exhibitionId)
    external
    view
    returns (bool hasVisited)
```

**Parameters:**
- `_exhibitionId` (uint32): Exhibition ID

**Returns:**
- `hasVisited` (bool): True if user recorded visit

---

### `getMyStats`

Get current user's registration status.

```solidity
function getMyStats()
    external
    view
    returns (
        bool isRegistered,
        uint32 registrationDate
    )
```

**Returns:**
- `isRegistered` (bool): Registration status
- `registrationDate` (uint32): Registration timestamp (0 if not registered)

---

### `getPublicStats`

Get overall public statistics.

```solidity
function getPublicStats()
    external
    view
    returns (
        uint32 totalExhibitionsCount,
        uint32 totalRegisteredVisitorsCount
    )
```

**Returns:**
- `totalExhibitionsCount` (uint32): Total exhibitions created
- `totalRegisteredVisitorsCount` (uint32): Total registered visitors

---

### `getExhibitionVisitorCount`

Get total visitors for an exhibition (public count).

```solidity
function getExhibitionVisitorCount(uint32 _exhibitionId)
    external
    view
    validExhibition(_exhibitionId)
    returns (uint32)
```

**Parameters:**
- `_exhibitionId` (uint32): Exhibition ID

**Returns:**
- (uint32): Total visitor count

**Note:** This returns the public counter, not encrypted statistics.

---

## Admin Functions

### `setMuseumManager`

Set museum manager address.

```solidity
function setMuseumManager(address _manager) external onlyOwner
```

**Parameters:**
- `_manager` (address): New manager address

**Requirements:**
- Caller must be owner
- Manager address cannot be zero address

---

### `incrementNonce`

Increment privacy obfuscation nonce.

```solidity
function incrementNonce() external onlyOwner
```

**Requirements:**
- Caller must be owner

**Purpose:** Changes the deterministic noise added to small sample statistics for enhanced privacy over time.

---

## Constants

### Timeout Constants

```solidity
uint256 public constant DECRYPTION_TIMEOUT = 24 hours;
uint256 public constant MAX_REFUND_WINDOW = 48 hours;
```

- `DECRYPTION_TIMEOUT`: Time before request can be marked as timed out
- `MAX_REFUND_WINDOW`: Maximum time to claim refund after request

### Privacy Constants

```solidity
uint256 private constant PRIVACY_MULTIPLIER = 1000;
```

- Used for division precision in statistics calculations
- Results must be divided by 1000 to get actual values

---

## Enums

### AgeGroup

```solidity
enum AgeGroup {
    Child,   // 0: Age < 13
    Teen,    // 1: Age 13-19
    Adult,   // 2: Age 20-59
    Senior   // 3: Age 60+
}
```

### ExhibitionType

```solidity
enum ExhibitionType {
    History,     // 0
    Art,         // 1
    Science,     // 2
    Culture,     // 3
    Technology,  // 4
    Nature       // 5
}
```

### RequestStatus

```solidity
enum RequestStatus {
    Pending,    // 0: Awaiting callback
    Completed,  // 1: Successfully processed
    Failed,     // 2: Decryption failed
    TimedOut    // 3: Timeout occurred
}
```

---

## Events

### Exhibition Events

```solidity
event ExhibitionCreated(
    uint32 indexed exhibitionId,
    string name,
    ExhibitionType exhibitionType
);
```

### Visitor Events

```solidity
event VisitorRegistered(
    address indexed visitor,
    uint32 timestamp
);

event PrivateVisitRecorded(
    address indexed visitor,
    uint32 indexed exhibitionId
);

event SatisfactionRecorded(
    uint32 indexed exhibitionId,
    address indexed visitor
);
```

### Decryption Events

```solidity
event StatisticsRequested(
    uint32 indexed exhibitionId,
    address requester,
    uint256 requestId
);

event StatisticsRevealed(
    uint32 indexed exhibitionId,
    uint32 visitorCount,
    uint32 satisfactionSum
);

event CallbackExecuted(
    uint256 indexed requestId,
    uint32 exhibitionId
);
```

### Error Events

```solidity
event DecryptionFailed(
    uint256 indexed requestId,
    uint32 exhibitionId
);

event DecryptionTimedOut(
    uint256 indexed requestId,
    uint32 exhibitionId
);

event RefundClaimed(
    uint32 indexed exhibitionId,
    address indexed claimer
);
```

---

## Error Handling

### Common Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Not authorized" | Caller is not owner | Use owner account |
| "Not museum manager" | Caller is not manager/owner | Use manager account |
| "Visitor not registered" | Trying to visit without registration | Call `registerVisitor()` first |
| "Invalid exhibition" | Exhibition ID doesn't exist | Check `totalExhibitions` |
| "Already registered" | Visitor already registered | Cannot register twice |
| "Exhibition not active" | Exhibition is inactive | Manager should activate |
| "Decryption pending" | Previous request still processing | Wait or mark timeout |
| "Not revealed" | Statistics not yet decrypted | Wait for Gateway callback |
| "Not eligible" | Cannot claim refund | Check eligibility conditions |
| "Already claimed" | Refund already claimed | One refund per exhibition |

---

## Usage Examples

### Complete Workflow Example

```javascript
// 1. Manager creates exhibition
await contract.createExhibition(
    "Van Gogh Exhibition",
    1, // Art
    Math.floor(Date.now() / 1000),
    Math.floor(Date.now() / 1000) + 365*24*60*60
);

// 2. Visitor registers
await contract.connect(visitor).registerVisitor(28);

// 3. Visitor records visit
await contract.connect(visitor).recordPrivateVisit(
    1,   // Exhibition ID
    9,   // Satisfaction
    90,  // Duration (minutes)
    5    // Interest
);

// 4. Manager requests statistics
const tx = await contract.requestExhibitionStats(1);
const receipt = await tx.wait();

// 5. Wait for Gateway callback (monitor events)
contract.on("StatisticsRevealed", async (exhibitionId, visitorCount, satisfactionSum) => {
    console.log(`Revealed: ${visitorCount} visitors, ${satisfactionSum} total satisfaction`);

    // 6. Query revealed stats
    const stats = await contract.getRevealedStats(exhibitionId);
    const avgSatisfaction = stats.avgSatisfaction / 1000;
    console.log(`Average Satisfaction: ${avgSatisfaction}/10`);
});

// 7. Handle timeout if needed
setTimeout(async () => {
    const status = await contract.getRequestStatus(requestId);
    if (status.status === 0 && status.isTimedOut) { // Still pending + timed out
        await contract.markDecryptionTimeout(requestId);
        await contract.claimDecryptionRefund(1);
    }
}, 24 * 60 * 60 * 1000); // Check after 24 hours
```

---

## Integration Tips

### Frontend Integration

1. **Monitor Events**: Use event listeners for real-time updates
2. **Check Status**: Poll `getRequestStatus()` for pending requests
3. **Handle Timeouts**: Implement UI for timeout detection and refund claims
4. **Privacy Notes**: Display explanation of privacy protection techniques
5. **Error Handling**: Provide clear error messages and recovery options

### Backend Integration

1. **Event Logging**: Store all events for audit trail
2. **Automated Timeout**: Run cron jobs to mark timed out requests
3. **Analytics**: Aggregate revealed statistics for reports
4. **Monitoring**: Track success/failure rates of decryptions
5. **Notifications**: Alert users of completed or failed decryptions

---

## Security Considerations

### Best Practices

1. **Always Validate**: Check return values and transaction receipts
2. **Handle Failures**: Implement retry logic for failed transactions
3. **Monitor Gas**: FHE operations consume significant gas/HCU
4. **Secure Keys**: Never expose private keys in frontend code
5. **Test Thoroughly**: Test timeout and refund scenarios
6. **Audit Smart Contracts**: Professional audit recommended before mainnet

### Known Limitations

1. **FHE Performance**: Encrypted operations slower than plaintext
2. **Decryption Delay**: Gateway callbacks may take time
3. **Privacy vs Utility**: Strong privacy limits some statistical operations
4. **Gas Costs**: Higher than traditional contracts due to FHE

---

## Contract Addresses

### Testnet (Sepolia)

```
Contract: 0xe4432488D78fd8CF32b096c385Ca251230427458
Network: Sepolia (ChainID: 11155111)
Explorer: https://sepolia.etherscan.io/address/0xe4432488D78fd8CF32b096c385Ca251230427458
```

### Mainnet

**TBD** - Deploy after thorough testing and audit

---

## Support

For issues or questions:
- GitHub Issues: [Report bugs or request features]
- Documentation: See ARCHITECTURE.md for detailed architecture
- Examples: Check frontend/ directory for integration examples

---

## Changelog

### v2.0.0 - Enhanced Version

**Added:**
- Gateway callback pattern for decryption
- Refund mechanism for failed decryptions
- Timeout protection (24 hours)
- Privacy protection techniques
- Comprehensive input validation
- Reentrancy protection
- Request status tracking

**Improved:**
- Gas optimization
- HCU efficiency
- Error handling
- Event system
- Access control

**Fixed:**
- Division precision in statistics
- Small sample privacy leakage
- Missing overflow checks
