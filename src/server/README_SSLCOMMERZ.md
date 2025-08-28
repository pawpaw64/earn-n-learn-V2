# SSLCommerz Integration Setup

This application now uses SSLCommerz as the primary payment gateway for wallet top-ups and escrow payments.

## Environment Variables Required

Add the following to your `.env` file:

```env
# SSLCommerz Configuration
SSLCOMMERZ_STORE_ID=your_store_id_here
SSLCOMMERZ_STORE_PASSWORD=your_store_password_here
SSLCOMMERZ_IS_LIVE=false
BASE_URL=http://localhost:8080
```

## How to Get SSLCommerz Credentials

1. Visit [SSLCommerz](https://www.sslcommerz.com)
2. Register for an account
3. Get your sandbox credentials for testing:
   - Store ID
   - Store Password
4. For production, set `SSLCOMMERZ_IS_LIVE=true`

## Features Implemented

### 1. Wallet Top-Up
- Users can add money to their wallet through SSLCommerz
- Supports all SSLCommerz payment methods:
  - Credit/Debit Cards (Visa, Mastercard, AMEX)
  - Mobile Banking (bKash, Nagad, Rocket)
  - Internet Banking (All major banks)

### 2. Escrow Payments
- Secure escrow payments for jobs, skills, and materials
- Funds are held safely until work completion
- Client can release funds or dispute if needed

### 3. Payment Flow
1. User initiates payment (top-up or escrow)
2. System creates transaction record with 'pending' status
3. User is redirected to SSLCommerz payment gateway
4. After successful payment, callback updates transaction to 'completed'
5. Wallet balance is updated accordingly

## API Endpoints

### Top-Up Wallet
```
POST /api/wallet/topup
Body: { amount: number }
Response: { success: true, gatewayUrl: string, transactionId: string }
```

### Create Escrow with Payment
```
POST /api/wallet/escrow/payment
Body: { 
  providerId: number,
  jobId?: number,
  skillId?: number, 
  materialId?: number,
  amount: number,
  description: string 
}
Response: { success: true, gatewayUrl: string, transactionId: string }
```

### SSLCommerz Callbacks
- Success: `POST /api/wallet/sslcommerz/success`
- Fail: `POST /api/wallet/sslcommerz/fail`
- Cancel: `POST /api/wallet/sslcommerz/cancel`
- IPN: `POST /api/wallet/sslcommerz/ipn`

## Database Schema Updates

Run the following SQL to update your database:

```sql
-- Run the sslcommerz_schema.sql file
source src/server/database/sslcommerz_schema.sql;
```

## Testing

1. Set up sandbox credentials from SSLCommerz
2. Use test card numbers provided by SSLCommerz
3. Monitor transaction status in your database
4. Check callback handling in server logs

## Security Features

- Transaction validation with SSLCommerz
- Secure callback handling
- Escrow protection for buyers
- Automatic rollback on failed payments