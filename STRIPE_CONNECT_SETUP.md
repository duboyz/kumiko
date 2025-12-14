# Stripe Connect Integration - Quick Overview

## What We Built

We've integrated Stripe Connect Standard Accounts so restaurants can:
- Connect their Stripe accounts (during onboarding or in settings)
- Accept online payments from customers
- Platform automatically takes a 3% fee on each transaction

## What Was Added

### Backend
- **Database**: Added Stripe Connect fields to Restaurant table, payment fields to Order table
- **API Endpoints**:
  - `POST /api/restaurant/{restaurantId}/stripe-connect/onboarding-link` - Create Stripe onboarding link
  - `GET /api/restaurant/{restaurantId}/stripe-connect/status` - Get connection status
  - `POST /api/webhooks/stripe-connect` - Handle Stripe webhooks
- **Payment Processing**: Orders automatically process payments if restaurant has Stripe connected

### Frontend
- **Onboarding**: Optional "Payment Setup" step in restaurant onboarding
- **Settings**: New "Payment Processing" section in restaurant settings
- **Checkout**: Shows payment notice if restaurant accepts online payments

## Stripe Dashboard Setup

### 1. Enable Stripe Connect
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Settings** → **Connect**
3. Click **Get started** or **Activate Connect** if not already enabled
4. Choose **Standard accounts** (we're using Standard accounts)

### 2. Configure Webhook Endpoint
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/stripe-connect`
   - For local testing: Use Stripe CLI (see Testing section below)
4. Select events to listen for:
   - `account.updated` (required - updates restaurant connection status)
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to `appsettings.json` under `Stripe:WebhookSecret`

### 3. Test Mode vs Live Mode
- **Test Mode**: Use test API keys and test webhook endpoint
- **Live Mode**: Use live API keys and production webhook endpoint
- Make sure your `appsettings.json` matches the mode you're testing in

## Testing

### Prerequisites
1. Run the database migration:
   ```bash
   cd BackendApi
   dotnet ef database update
   ```

2. Make sure your Stripe API keys are in `appsettings.json`:
   ```json
   "Stripe": {
     "SecretKey": "sk_test_...",
     "PublishableKey": "pk_test_...",
     "WebhookSecret": "whsec_...",
     "Connect": {
       "PlatformFeePercentage": "0.03",
       "ReturnUrl": "http://localhost:3004/onboarding?stripe_return=true",
       "RefreshUrl": "http://localhost:3004/onboarding?stripe_refresh=true"
     }
   }
   ```

### Test Flow

#### 1. Test Restaurant Onboarding with Stripe
1. Start your backend and frontend
2. Go through restaurant onboarding
3. When you reach the "Payment Setup" step:
   - Click "Connect Stripe Account"
   - You'll be redirected to Stripe's onboarding page
   - Complete the Stripe onboarding (use test data)
   - You'll be redirected back to your app
4. Verify the restaurant shows as "Connected" in settings

#### 2. Test Stripe Connect in Settings
1. Go to Settings → Restaurant tab
2. You should see the "Payment Processing" card
3. If not connected: Click "Connect Stripe Account"
4. If connected: Should show green badge and connection status

#### 3. Test Payment Processing (Local Testing)
For local webhook testing, use Stripe CLI:

```bash
# Install Stripe CLI if you haven't
# macOS: brew install stripe/stripe-cli/stripe
# Then login: stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:5000/api/webhooks/stripe-connect

# This will give you a webhook signing secret (whsec_...)
# Add it to your appsettings.Development.json
```

#### 4. Test Order with Payment
1. Create a restaurant and connect Stripe
2. Add items to cart on the public website
3. Go to checkout
4. You should see a payment notice if Stripe is connected
5. Place order (payment will be processed if paymentMethodId is provided)
   - **Note**: Full Stripe Elements integration for card collection is a future enhancement
   - Currently, orders can be created without payment (payment is optional)

### Test Stripe Connect Account Creation
1. Use Stripe test mode
2. When creating onboarding link, Stripe will create a test connected account
3. Complete onboarding with test business info
4. Check Stripe Dashboard → **Connect** → **Accounts** to see the connected account

## Configuration Files

### appsettings.json
```json
{
  "Stripe": {
    "SecretKey": "sk_test_...",
    "PublishableKey": "pk_test_...",
    "WebhookSecret": "whsec_...",
    "Connect": {
      "PlatformFeePercentage": "0.03",  // 3% platform fee
      "ReturnUrl": "http://localhost:3004/settings?tab=restaurant&stripe_return=true",
      "RefreshUrl": "http://localhost:3004/settings?tab=restaurant&stripe_refresh=true"
    }
  }
}
```

## Important Notes

1. **Platform Fee**: Currently set to 3% (0.03). Change in `appsettings.json` if needed.

2. **Payment Processing**: 
   - Orders are created with `PaymentStatus.NotRequired` by default
   - If restaurant has Stripe connected AND `paymentMethodId` is provided, payment is processed
   - Full Stripe Elements integration (card collection UI) is a future enhancement

3. **Webhooks**: 
   - The `account.updated` event updates restaurant connection status
   - Make sure webhook endpoint is accessible and properly configured

4. **Test vs Production**:
   - Use test mode keys for development
   - Use live mode keys for production
   - Update webhook URLs for production environment

## Troubleshooting

### "Failed to create onboarding link"
- Check Stripe API key is correct
- Verify Stripe Connect is enabled in dashboard
- Check backend logs for detailed error

### "Webhook not received"
- Verify webhook URL is correct
- Check webhook signing secret matches
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:5000/api/webhooks/stripe-connect`

### "Payment not processing"
- Verify restaurant has `StripeConnectChargesEnabled = true`
- Check restaurant has `StripeConnectAccountId` set
- Ensure `paymentMethodId` is provided in order creation (currently optional)

## Next Steps (Future Enhancements)

1. **Stripe Elements Integration**: Add card collection UI in checkout page
2. **Payment Status Tracking**: Show payment status in order management
3. **Refund Functionality**: Add refund capability in admin UI
4. **Payment Retry**: Allow customers to retry failed payments

