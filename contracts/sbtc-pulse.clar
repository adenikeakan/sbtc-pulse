
;; title: sBTC Pulse - Track sBTC Price Data on Stacks
;; version: 1.0.0
;; description: Simple contract to store and retrieve sBTC price information over time

;; Contract owner (deployer) - only they can add price data
(define-constant contract-owner tx-sender)

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
  (is-eq tx-sender contract-owner)
)

;; Add new price data (admin only)
;; Price should be in microunits (e.g., $50.25 = 50250000)
(define-public (add-price-data (price uint) (timestamp uint))
  (begin
    ;; Check if caller is owner
    (asserts! (is-contract-owner) err-owner-only)
    ;; Check if price is valid (greater than 0)
    (asserts! (> price u0) err-invalid-price)
    ;; Check if timestamp is valid (greater than 0)
    (asserts! (> timestamp u0) err-invalid-price)
    
    ;; Get current entry count
    (let ((current-count (var-get price-entry-count)))
      ;; Increment entry count
      (var-set price-entry-count (+ current-count u1))
      ;; Store new price entry
      (map-set price-entries (+ current-count u1) {
        price: price,
        timestamp: timestamp
      })
      ;; Update latest price and timestamp for quick access
      (var-set latest-price price)
      (var-set latest-timestamp timestamp)
      ;; Return success with entry ID
      (ok (+ current-count u1))
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

;; Get contract owner (for transparency)
(define-read-only (get-contract-owner)
  (ok contract-owner)
)

;; Get contract info
(define-read-only (get-contract-info)
  (ok {
    name: "sBTC Pulse",
    version: "1.0",
    total-entries: (var-get price-entry-count),
    latest-price: (var-get latest-price),
    latest-timestamp: (var-get latest-timestamp),
    owner: contract-owner
  })
)
