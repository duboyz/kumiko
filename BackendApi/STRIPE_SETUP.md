# Stripe Subscription Setup Guide

## How to Set Up Stripe Price IDs

The subscription system is now configured to read Stripe price IDs from `appsettings.json`. This allows for easy configuration across different environments (development, staging, production).

### Step 1: Create Products in Stripe Dashboard

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add product**
3. Create three products:

#### Basic Plan
- **Name**: Kumiko Basic
- **Description**: 1 location, 3 menus per location
- **Pricing**:
  - Monthly: $29.99
  - Yearly: $299.99

#### Premium Plan
- **Name**: Kumiko Premium
- **Description**: 3 locations, 3 menus per location
- **Pricing**:
  - Monthly: $79.99
  - Yearly: $799.99

#### Enterprise Plan
- **Name**: Kumiko Enterprise
- **Description**: Unlimited locations and menus
- **Pricing**:
  - Monthly: $199.99
  - Yearly: $1,999.99

### Step 2: Copy the Price IDs

After creating each product:
1. Click on the product in Stripe Dashboard
2. Find the **Pricing** section
3. Copy the Price ID (starts with `price_`)
4. You'll have 6 price IDs total (2 for each plan)

### Step 3: Update appsettings.json

Add your Stripe price IDs to `appsettings.json`:

```json
"Stripe": {
    "SecretKey": "your_stripe_secret_key",
    "PublishableKey": "your_stripe_publishable_key",
    "WebhookSecret": "your_webhook_secret",
    "Prices": {
        "Basic": {
            "Monthly": "price_xxxxxxxxxxxxx",
            "Yearly": "price_xxxxxxxxxxxxx"
        },
        "Premium": {
            "Monthly": "price_xxxxxxxxxxxxx",
            "Yearly": "price_xxxxxxxxxxxxx"
        },
        "Enterprise": {
            "Monthly": "price_xxxxxxxxxxxxx",
            "Yearly": "price_xxxxxxxxxxxxx"
        }
    }
}
```

### Step 4: Environment-Specific Configuration

For production, use environment variables or Azure Key Vault:

```bash
# Environment variables example
export Stripe__Prices__Basic__Monthly="price_xxxxxxxxxxxxx"
export Stripe__Prices__Basic__Yearly="price_xxxxxxxxxxxxx"
export Stripe__Prices__Premium__Monthly="price_xxxxxxxxxxxxx"
export Stripe__Prices__Premium__Yearly="price_xxxxxxxxxxxxx"
export Stripe__Prices__Enterprise__Monthly="price_xxxxxxxxxxxxx"
export Stripe__Prices__Enterprise__Yearly="price_xxxxxxxxxxxxx"
```

### How It Works

1. On application startup, the `StripePriceSyncService` runs automatically
2. It reads the price IDs from configuration
3. It updates the database with these IDs if they're different or missing
4. This ensures your database always has the correct Stripe price IDs

### Verification

After starting the application, check the logs for:
```
Starting Stripe price synchronization service
Updating Basic monthly price ID from null to price_xxxxxxxxxxxxx
Stripe price synchronization completed successfully
```

### Troubleshooting

If checkout fails with "No such price" error:
1. Verify the price IDs exist in your Stripe Dashboard
2. Check that the price IDs are correctly added to appsettings.json
3. Restart the application to trigger the sync service
4. Check application logs for sync service messages

### Testing Different Environments

- **Development**: Use Stripe test mode price IDs
- **Production**: Use Stripe live mode price IDs
- **Staging**: Can use either, depending on your testing needs

The system automatically syncs on every application start, so deployment to new environments is seamless.