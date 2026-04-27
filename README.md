# Environmental Job Alert

A personal job alert app that monitors careers pages at civic/climate tech companies and sends push notifications to your browser when new roles are posted.

**Stack:** Vue 3 (CDN) · GitHub Pages · AWS Lambda · AWS S3 · Web Push API

---

## Project Structure

```
environmental-job-alert/
├── index.html     ← Vue frontend (GitHub Pages)
├── sw.js          ← Service worker (push notifications)
├── config.js      ← Your API URL + VAPID key (fill this in)
├── lambda/
│   ├── index.js   ← Lambda function (scraper + API)
│   └── package.json
└── README.md
```

---

## Setup (one-time, ~30 mins)

### Step 1: Generate VAPID Keys

VAPID keys authenticate your push notifications. Run once:

```bash
npx web-push generate-vapid-keys
```

Save both keys somewhere safe. You'll use them in Steps 2 and 4.

---

### Step 2: Create S3 Bucket

```bash
aws s3 mb s3://jobwatch-data-YOUR_NAME --region us-east-1
```

---

### Step 3: Deploy the Lambda

```bash
cd lambda
npm install

# Zip it
zip -r ../jobwatch-lambda.zip .

# Create Lambda
aws lambda create-function \
  --function-name jobwatch \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-basic-execution \
  --handler index.handler \
  --zip-file fileb://../jobwatch-lambda.zip \
  --timeout 60

# Set environment variables
aws lambda update-function-configuration \
  --function-name jobwatch \
  --environment "Variables={
    S3_BUCKET=jobwatch-data-YOUR_NAME,
    VAPID_PUBLIC_KEY=YOUR_VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY=YOUR_VAPID_PRIVATE_KEY,
    VAPID_EMAIL=your@email.com
  }"
```

**Note:** The Lambda IAM role needs `s3:GetObject` and `s3:PutObject` on your bucket.

---

### Step 4: Add API Gateway

In the AWS Console:
1. Go to **API Gateway** → Create API → HTTP API
2. Add integration: Lambda → `jobwatch`
3. Add routes:
   - `GET /jobs`
   - `POST /subscribe`
   - `POST /unsubscribe`
   - `POST /scrape`
4. Deploy to stage `prod`
5. Copy the **Invoke URL** — looks like `https://abc123.execute-api.us-east-1.amazonaws.com/prod`

---

### Step 5: Schedule Daily Scraping

```bash
# Create EventBridge rule to run every day at 8am UTC
aws events put-rule \
  --name jobwatch-daily \
  --schedule-expression "cron(0 8 * * ? *)" \
  --state ENABLED

aws events put-targets \
  --rule jobwatch-daily \
  --targets "Id=1,Arn=arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:jobwatch"
```

---

### Step 6: Configure the Frontend

Edit `config.js`:

```js
const JOBWATCH_CONFIG = {
  apiUrl: 'https://abc123.execute-api.us-east-1.amazonaws.com/prod',
  vapidPublicKey: 'YOUR_VAPID_PUBLIC_KEY',
};
```

---

### Step 7: Deploy to GitHub Pages

```bash
# Create a new GitHub repo called 'jobwatch'
git init
git remote add origin https://github.com/YOUR_USERNAME/jobwatch.git
git add index.html sw.js config.js README.md
git commit -m "initial deploy"
git push -u origin main

# Enable GitHub Pages in repo settings → Pages → Source: main branch
```

Your app will be live at: `https://YOUR_USERNAME.github.io/jobwatch`

---

## Adding Companies

Edit the `COMPANIES` array in `lambda/index.js`:

```js
// Greenhouse.io companies (most common):
{ id: 'mycompany', name: 'My Company', type: 'greenhouse', slug: 'mycompany-slug', sector: 'climate', orgType: 'nonprofit' },

// Lever companies:
{ id: 'mycompany', name: 'My Company', type: 'lever', slug: 'mycompany-slug', sector: 'civic', orgType: 'b-corp' },
```

**To find the slug:**
- Greenhouse: look at `https://boards.greenhouse.io/SLUG` on their careers page
- Lever: look at `https://jobs.lever.co/SLUG` on their careers page

Re-zip and redeploy Lambda after changes:
```bash
cd lambda && npm install
zip -r ../jobwatch-lambda.zip .
aws lambda update-function-code --function-name jobwatch --zip-file fileb://../jobwatch-lambda.zip
```

---

## Triggering a Manual Scrape

```bash
curl -X POST https://YOUR_API_GATEWAY_URL/scrape
```

Or use the AWS console to send a test event to the Lambda.

---

## Cost

Essentially free:
- **Lambda**: 1M free invocations/month. Daily scrape = 365/year.
- **S3**: ~$0.001/month for tiny JSON files.
- **API Gateway**: 1M free calls/month.
- **GitHub Pages**: Free.
- **Web Push**: Free (no third party).

---

## Companies Currently Tracked

| Company | Type | Sector |
|---|---|---|
| Planet Labs | Greenhouse | Climate |
| Tomorrow.io | Greenhouse | Climate |
| Pachama | Greenhouse | Climate |
| Watershed | Greenhouse | Climate |
| Arcadia | Greenhouse | Climate |
| Persefoni | Greenhouse | Climate |
| First Street Foundation | Greenhouse | Climate |
| Code for America | Greenhouse | Civic |
| Nava PBC | Greenhouse | Civic |
| Ad Hoc | Greenhouse | Civic |
| Recidiviz | Greenhouse | Civic |
| Open Climate Fix | Lever | Climate |

Add more from `civic_climate_companies_and_oss.md` as you go.
