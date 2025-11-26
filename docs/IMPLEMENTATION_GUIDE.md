# Implementation Guide - Enhanced Features

## Overview

This guide walks you through implementing the enhanced features in the Museum Visit Tracker contract: Gateway callback pattern, refund mechanism, timeout protection, and privacy techniques.

---

## 1. Gateway Callback Pattern

### Step 1: Understanding the Pattern

The Gateway callback pattern enables asynchronous decryption of FHE-encrypted data:

```
Contract → Gateway Request → Gateway Decrypts → Gateway Callback → Contract Processes
```

### Step 2: Implementation Components

#### A. Request Function

```solidity
function requestExhibitionStats(uint32 _exhibitionId)
    external
    onlyMuseumManager
    validExhibition(_exhibitionId)
{
    Exhibition storage exhibition = exhibitions[_exhibitionId];

    // Prevent duplicate requests
    require(!exhibition.isDecryptionPending, "Decryption pending");

    // Prepare ciphertexts
    bytes32[] memory cts = new bytes32[](2);
    cts[0] = FHE.toBytes32(exhibition.privateVisitorCount);
    cts[1] = FHE.toBytes32(exhibition.privateSatisfactionSum);

    // Request Gateway decryption with callback selector
    uint256 requestId = FHE.requestDecryption(
        cts,
        this.processStatsReveal.selector
    );

    // Track request
    exhibition.decryptionRequestId = requestId;
    exhibition.requestTimestamp = block.timestamp;
    exhibition.isDecryptionPending = true;

    // Store request details
    requestIdToExhibitionId[requestId] = _exhibitionId;
    decryptionRequests[requestId] = DecryptionRequest({
        exhibitionId: _exhibitionId,
        requester: msg.sender,
        timestamp: block.timestamp,
        status: RequestStatus.Pending,
        callbackCalled: false
    });

    emit StatisticsRequested(_exhibitionId, msg.sender, requestId);
}
```

#### B. Callback Function

```solidity
function processStatsReveal(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external nonReentrant {
    DecryptionRequest storage request = decryptionRequests[requestId];

    // Validate request
    require(request.timestamp > 0, "Invalid request");
    require(!request.callbackCalled, "Already called");
    require(request.status == RequestStatus.Pending, "Not pending");

    // Try to verify and process
    try this.verifyDecryption(requestId, cleartexts, decryptionProof) {
        // Decode decrypted values
        (uint32 visitorCount, uint32 satisfactionSum) =
            abi.decode(cleartexts, (uint32, uint32));

        uint32 exhibitionId = request.exhibitionId;

        // Store revealed data
        revealedVisitorCount[exhibitionId] = visitorCount;
        revealedSatisfactionSum[exhibitionId] = satisfactionSum;

        // Update status
        exhibitions[exhibitionId].isDecryptionPending = false;
        request.status = RequestStatus.Completed;
        request.callbackCalled = true;

        emit StatisticsRevealed(exhibitionId, visitorCount, satisfactionSum);
    } catch {
        // Handle failure
        exhibitions[request.exhibitionId].isDecryptionPending = false;
        request.status = RequestStatus.Failed;
        request.callbackCalled = true;

        emit DecryptionFailed(requestId, request.exhibitionId);
    }
}
```

#### C. Proof Verification

```solidity
function verifyDecryption(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external view {
    // Only callable internally
    require(msg.sender == address(this), "Internal only");

    // Use FHE library to verify Gateway signature
    FHE.checkSignatures(requestId, cleartexts, decryptionProof);
}
```

### Step 3: Integration Tips

1. **Request Tracking**: Always store requestId for later reference
2. **Event Monitoring**: Frontend should listen to StatisticsRequested and StatisticsRevealed
3. **Error Handling**: Implement retry logic for failed requests
4. **Status Checking**: Poll getRequestStatus() while pending

---

## 2. Refund Mechanism

### Step 1: Understanding Eligibility

Refunds available when:
- Decryption fails (status = Failed)
- Request times out (status = TimedOut or 24h elapsed)
- Within 48-hour refund window

### Step 2: Implementation

```solidity
function claimDecryptionRefund(uint32 _exhibitionId)
    external
    onlyMuseumManager
    validExhibition(_exhibitionId)
    nonReentrant
{
    Exhibition storage exhibition = exhibitions[_exhibitionId];

    // Validation
    require(exhibition.decryptionRequestId != 0, "No request");
    require(!hasClaimedRefund[_exhibitionId], "Already claimed");

    DecryptionRequest storage request =
        decryptionRequests[exhibition.decryptionRequestId];

    // Check eligibility
    bool isEligible = (
        request.status == RequestStatus.Failed ||
        request.status == RequestStatus.TimedOut ||
        checkDecryptionTimeout(exhibition.decryptionRequestId)
    );

    require(isEligible, "Not eligible");
    require(
        block.timestamp <= request.timestamp + MAX_REFUND_WINDOW,
        "Refund window expired"
    );

    // Process refund
    hasClaimedRefund[_exhibitionId] = true;
    exhibition.isDecryptionPending = false;

    if (request.status == RequestStatus.Pending) {
        request.status = RequestStatus.TimedOut;
    }

    emit RefundClaimed(_exhibitionId, msg.sender);
}
```

### Step 3: Frontend Implementation

```javascript
async function handleRefund(exhibitionId) {
    try {
        // Check eligibility
        const requestId = await getRequestIdForExhibition(exhibitionId);
        const status = await contract.getRequestStatus(requestId);

        if (!status.isTimedOut && status.status !== 2 && status.status !== 3) {
            throw new Error("Not eligible for refund");
        }

        // Claim refund
        const tx = await contract.claimDecryptionRefund(exhibitionId);
        await tx.wait();

        console.log("Refund claimed successfully");
    } catch (error) {
        console.error("Refund failed:", error.message);
    }
}
```

---

## 3. Timeout Protection

### Step 1: Timeout Checking

```solidity
function checkDecryptionTimeout(uint256 requestId)
    public
    view
    returns (bool isTimedOut)
{
    DecryptionRequest storage request = decryptionRequests[requestId];

    if (request.timestamp == 0) return false;
    if (request.status != RequestStatus.Pending) return false;

    // Check if 24 hours have elapsed
    return (block.timestamp >= request.timestamp + DECRYPTION_TIMEOUT);
}
```

### Step 2: Timeout Marking

```solidity
function markDecryptionTimeout(uint256 requestId) external {
    // Anyone can call after timeout
    require(checkDecryptionTimeout(requestId), "Not timed out");

    DecryptionRequest storage request = decryptionRequests[requestId];
    uint32 exhibitionId = request.exhibitionId;

    // Update status
    request.status = RequestStatus.TimedOut;
    exhibitions[exhibitionId].isDecryptionPending = false;

    emit DecryptionTimedOut(requestId, exhibitionId);
}
```

### Step 3: Automated Monitoring (Backend)

```javascript
// Run periodically (e.g., every hour)
async function monitorTimeouts() {
    // Get all pending requests
    const pendingRequests = await getPendingRequests();

    for (const request of pendingRequests) {
        // Check if timed out
        const isTimedOut = await contract.checkDecryptionTimeout(request.id);

        if (isTimedOut) {
            try {
                // Mark as timed out
                const tx = await contract.markDecryptionTimeout(request.id);
                await tx.wait();

                console.log(`Marked request ${request.id} as timed out`);

                // Notify requester
                notifyUser(request.requester, {
                    type: 'timeout',
                    requestId: request.id,
                    exhibitionId: request.exhibitionId
                });
            } catch (error) {
                console.error(`Failed to mark timeout: ${error.message}`);
            }
        }
    }
}

// Schedule monitoring
setInterval(monitorTimeouts, 60 * 60 * 1000); // Every hour
```

---

## 4. Privacy Protection Techniques

### A. Division Problem Solution

**Problem**: Solidity integer division loses precision, and FHE can't divide encrypted values.

**Solution**: Multiply before dividing

```solidity
uint256 private constant PRIVACY_MULTIPLIER = 1000;

function getRevealedStats(uint32 _exhibitionId)
    external
    view
    returns (uint256 avgSatisfaction, uint32 visitorCount)
{
    visitorCount = revealedVisitorCount[_exhibitionId];
    uint32 satisfactionSum = revealedSatisfactionSum[_exhibitionId];

    if (visitorCount == 0) return (0, 0);

    // Multiply first to preserve precision
    uint256 obfuscatedSum = uint256(satisfactionSum) * PRIVACY_MULTIPLIER;
    avgSatisfaction = obfuscatedSum / uint256(visitorCount);

    return (avgSatisfaction, visitorCount);
}
```

**Usage in Frontend**:
```javascript
const { avgSatisfaction, visitorCount } = await contract.getRevealedStats(exhibitionId);

// Divide by PRIVACY_MULTIPLIER to get actual value
const actualAverage = avgSatisfaction / 1000;

console.log(`Average: ${actualAverage} out of 10`);
console.log(`Based on ${visitorCount} visitors`);
```

### B. Small Sample Protection

**Problem**: Small groups can leak individual information.

**Solution**: Add deterministic noise for small samples

```solidity
// Add noise for samples < 5
if (visitorCount < 5) {
    uint256 noise = uint256(
        keccak256(abi.encodePacked(_exhibitionId, nonce))
    ) % 100;

    avgSatisfaction = (avgSatisfaction + noise) % (10 * PRIVACY_MULTIPLIER);
}
```

**Controlling Noise** (Owner only):
```solidity
function incrementNonce() external onlyOwner {
    nonce++;
}
```

---

## 5. Security Best Practices

### A. Input Validation

```solidity
modifier validExhibition(uint32 _exhibitionId) {
    require(
        _exhibitionId > 0 && _exhibitionId <= totalExhibitions,
        "Invalid exhibition"
    );
    _;
}

function recordPrivateVisit(...) external {
    require(_satisfaction >= 1 && _satisfaction <= 10, "Invalid satisfaction");
    require(_interestLevel >= 1 && _interestLevel <= 5, "Invalid interest");
    require(_duration > 0 && _duration <= 1440, "Invalid duration");
    // ...
}
```

### B. Access Control

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
}

modifier onlyMuseumManager() {
    require(
        msg.sender == museumManager || msg.sender == owner,
        "Not museum manager"
    );
    _;
}
```

### C. Reentrancy Protection

```solidity
bool private _locked;

modifier nonReentrant() {
    require(!_locked, "Reentrant call");
    _locked = true;
    _;
    _locked = false;
}

// Apply to sensitive functions
function processStatsReveal(...) external nonReentrant { }
function claimDecryptionRefund(...) external nonReentrant { }
```

### D. Overflow Protection

```solidity
function registerVisitor(...) external {
    require(
        totalRegisteredVisitors < type(uint32).max,
        "Overflow protection"
    );
    // ...
}
```

---

## 6. Gas Optimization

### A. Batch Permission Settings

**Before** (expensive):
```solidity
FHE.allowThis(encryptedAge);
FHE.allow(encryptedAge, msg.sender);
FHE.allowThis(encryptedAgeGroup);
FHE.allow(encryptedAgeGroup, msg.sender);
```

**After** (optimized):
```solidity
// Group similar operations
FHE.allowThis(encryptedAge);
FHE.allowThis(encryptedAgeGroup);
FHE.allow(encryptedAge, msg.sender);
FHE.allow(encryptedAgeGroup, msg.sender);
```

### B. Use Public Counters When Possible

```solidity
// Public counter (cheap) - use when privacy not needed
exhibition.publicVisitorCount++;

// Encrypted counter (expensive) - use for privacy-sensitive metrics
exhibition.privateVisitorCount = FHE.add(
    exhibition.privateVisitorCount,
    FHE.asEuint32(1)
);
```

### C. Minimize Encrypted Operations

```solidity
// Store common encrypted values
euint32 one = FHE.asEuint32(1);

// Reuse instead of re-encrypting
exhibition.privateVisitorCount = FHE.add(
    exhibition.privateVisitorCount,
    one
);
```

---

## 7. Testing Strategy

### Unit Tests

```javascript
describe("Gateway Callback Pattern", function() {
    it("Should request decryption successfully", async function() {
        await contract.requestExhibitionStats(1);
        const exhibition = await contract.exhibitions(1);
        expect(exhibition.isDecryptionPending).to.be.true;
    });

    it("Should process callback with valid proof", async function() {
        // Simulate Gateway callback
        const cleartexts = ethers.AbiCoder.defaultAbiCoder().encode(
            ["uint32", "uint32"],
            [10, 85]
        );

        await contract.processStatsReveal(requestId, cleartexts, proof);

        const stats = await contract.getRevealedStats(1);
        expect(stats.visitorCount).to.equal(10);
    });
});
```

### Integration Tests

```javascript
describe("Complete Workflow", function() {
    it("Should handle full decryption lifecycle", async function() {
        // 1. Request
        await contract.requestExhibitionStats(1);

        // 2. Wait for callback (simulated)
        await simulateGatewayCallback();

        // 3. Verify results
        const stats = await contract.getRevealedStats(1);
        expect(stats.visitorCount).to.be.gt(0);
    });

    it("Should handle timeout and refund", async function() {
        await contract.requestExhibitionStats(1);

        // Fast forward 24 hours
        await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);

        // Mark timeout
        await contract.markDecryptionTimeout(requestId);

        // Claim refund
        await contract.claimDecryptionRefund(1);

        expect(await contract.hasClaimedRefund(1)).to.be.true;
    });
});
```

---

## 8. Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Gas optimization reviewed
- [ ] Documentation updated
- [ ] Environment variables configured

### Deployment Steps

1. **Compile Contract**
   ```bash
   npm run compile
   ```

2. **Run Tests**
   ```bash
   npm test
   ```

3. **Deploy to Testnet**
   ```bash
   npm run deploy -- --network sepolia
   ```

4. **Verify Contract**
   ```bash
   npm run verify -- --network sepolia
   ```

5. **Test Integration**
   - Request decryption
   - Monitor callback
   - Test timeout
   - Test refund

### Post-Deployment

- [ ] Contract verified on Etherscan
- [ ] Frontend updated with contract address
- [ ] Monitor Gateway callbacks
- [ ] Set up timeout monitoring
- [ ] Configure alerting

---

## 9. Monitoring & Maintenance

### Event Monitoring

```javascript
// Monitor all decryption events
contract.on("StatisticsRequested", (exhibitionId, requester, requestId) => {
    logEvent("decryption_requested", { exhibitionId, requester, requestId });
});

contract.on("StatisticsRevealed", (exhibitionId, visitorCount, satisfactionSum) => {
    logEvent("decryption_completed", { exhibitionId, visitorCount });
});

contract.on("DecryptionFailed", (requestId, exhibitionId) => {
    alertAdmin("decryption_failed", { requestId, exhibitionId });
});

contract.on("DecryptionTimedOut", (requestId, exhibitionId) => {
    alertAdmin("decryption_timeout", { requestId, exhibitionId });
});
```

### Health Checks

```javascript
async function healthCheck() {
    // Check pending requests
    const pending = await getPendingRequests();
    console.log(`Pending requests: ${pending.length}`);

    // Check for old pending requests
    const oldRequests = pending.filter(r => {
        const age = Date.now() - r.timestamp * 1000;
        return age > 12 * 60 * 60 * 1000; // > 12 hours
    });

    if (oldRequests.length > 0) {
        alertAdmin("old_pending_requests", { count: oldRequests.length });
    }
}
```

---

## 10. Troubleshooting

### Common Issues

#### 1. Callback Not Executing

**Symptoms**: Request pending for > 1 hour

**Checks**:
- Verify Gateway is online
- Check network connectivity
- Review Gateway logs
- Verify contract has correct callback selector

**Solution**: Wait or mark as timed out after 24 hours

#### 2. Proof Verification Failing

**Symptoms**: DecryptionFailed event emitted

**Checks**:
- Verify Gateway proof format
- Check FHE library version compatibility
- Review signature verification logs

**Solution**: Claim refund and retry request

#### 3. Refund Not Available

**Symptoms**: "Not eligible" error

**Checks**:
- Verify request status (should be Failed or TimedOut)
- Check time elapsed (must be < 48 hours)
- Confirm not already claimed

**Solution**: Wait for timeout or correct status

---

## Conclusion

This implementation guide covers all enhanced features of the Museum Visit Tracker. For more details:

- **Architecture**: See ARCHITECTURE.md
- **API Reference**: See API.md
- **Security**: See SECURITY.md
- **Testing**: See TESTING.md

Happy building! 🚀
