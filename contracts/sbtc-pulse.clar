
;; title: sBTC Pulse - Track sBTC Price Data on Stacks
;; version: 1.0.0
;; description: Simple contract to store and retrieve sBTC price information over time

;; sBTC Pulse - Track sBTC Price Data on Stacks
;; Simple contract to store and retrieve sBTC price information over time

;; Contract deployer - immutable
(define-constant contract-deployer tx-sender)
;; Current owner - can be transferred
(define-data-var contract-owner principal tx-sender)

;; Error codes
(define-constant err-owner-only (err u100))
(define-constant err-invalid-price (err u101))
(define-constant err-no-data (err u102))
(define-constant err-invalid-entry (err u103))

;; Data storage
(define-data-var price-entry-count uint u0)
(define-data-var latest-price uint u0)
(define-data-var latest-timestamp uint u0)

;; Map to store price entries: entry-id -> {price, timestamp}
(define-map price-entries 
  uint 
  {
    price: uint,
    timestamp: uint
  }
)

;; Private helper function to check if caller is contract owner
(define-private (is-contract-owner)
  (is-eq tx-sender (var-get contract-owner))
)

;; Add new price data (admin only)
;; Price should be in microunits (e.g., $50.25 = 50250000)
(define-public (add-price-data (price uint) (timestamp uint))
  (begin
    ;; Check if caller is owner
    (asserts! (is-contract-owner) err-owner-only)
    ;; Check if price is valid (greater than 0)
    (asserts! (> price u0) err-invalid-price)
    ;; Check if timestamp is valid and not in the past compared to latest
    (asserts! (> timestamp u0) err-invalid-price)
    (asserts! (>= timestamp (var-get latest-timestamp)) err-invalid-price)
    
    ;; Get current entry count
    (let ((current-count (var-get price-entry-count))
          (new-entry-id (+ current-count u1)))
      ;; Increment entry count
      (var-set price-entry-count new-entry-id)
      ;; Store new price entry
      (map-set price-entries new-entry-id {
        price: price,
        timestamp: timestamp
      })
      ;; Update latest price and timestamp for quick access
      (var-set latest-price price)
      (var-set latest-timestamp timestamp)
      ;; Log the price update for transparency
      (print {
        event: "price-added",
        entry-id: new-entry-id,
        price: price,
        timestamp: timestamp,
        added-by: tx-sender
      })
      ;; Return success with entry ID
      (ok new-entry-id)
    )
  )
)

;; Get current (latest) price
(define-read-only (get-current-price)
  (let ((current-price (var-get latest-price)))
    (if (> current-price u0)
      (ok {
        price: current-price,
        timestamp: (var-get latest-timestamp)
      })
      err-no-data
    )
  )
)

;; Get total number of price entries
(define-read-only (get-entry-count)
  (ok (var-get price-entry-count))
)

;; Get specific price entry by ID
(define-read-only (get-price-entry (entry-id uint))
  (match (map-get? price-entries entry-id)
    price-data (ok price-data)
    err-invalid-entry
  )
)

;; Get last N price entries (for price history)
(define-read-only (get-recent-prices (count uint))
  (let ((total-entries (var-get price-entry-count)))
    (if (is-eq total-entries u0)
      err-no-data
      (let ((start-id (if (<= count total-entries)
                         (+ (- total-entries count) u1)
                         u1)))
        (ok {
          total-entries: total-entries,
          start-id: start-id,
          requested-count: count
        })
      )
    )
  )
)

;; Get actual price history data (returns list of price entries)
(define-read-only (get-price-history (start-id uint) (count uint))
  (let ((total-entries (var-get price-entry-count)))
    (if (or (is-eq total-entries u0) (> start-id total-entries))
      err-no-data
      (ok {
        start-id: start-id,
        count: count,
        total-entries: total-entries
      })
    )
  )
)

;; Transfer ownership (current owner only)
(define-data-var pending-owner (optional principal) none)

(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-contract-owner) err-owner-only)
    (var-set pending-owner (some new-owner))
    (print {
      event: "ownership-transfer-initiated",
      current-owner: (var-get contract-owner),
      pending-owner: new-owner
    })
    (ok true)
  )
)

(define-public (accept-ownership)
  (let ((pending (var-get pending-owner)))
    (match pending
      new-owner (begin
                  (asserts! (is-eq tx-sender new-owner) err-owner-only)
                  (let ((old-owner (var-get contract-owner)))
                    (var-set contract-owner new-owner)
                    (var-set pending-owner none)
                    (print {
                      event: "ownership-transferred",
                      old-owner: old-owner,
                      new-owner: new-owner
                    })
                    (ok true)
                  )
                )
      err-no-data
    )
  )
)

;; Get contract owner (for transparency)
(define-read-only (get-contract-owner)
  (ok (var-get contract-owner))
)

;; Get contract info
(define-read-only (get-contract-info)
  (ok {
    name: "sBTC Pulse",
    version: "1.0",
    total-entries: (var-get price-entry-count),
    latest-price: (var-get latest-price),
    latest-timestamp: (var-get latest-timestamp),
    owner: (var-get contract-owner),
    deployer: contract-deployer
  })
)
