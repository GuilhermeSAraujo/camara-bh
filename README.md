# DX

> Meteor template by [Quave](https://www.quave.dev)

## What is it?

DX is a internal project to help tech leads focus on their teams with metrics and insights.

## How to run

### Steps to Run the Code

1. Install Node.js (LTS version recommended)

2. Install Meteor by running:

```bash
curl https://install.meteor.com/ | sh
```

### Setup steps

1. **Clone the repository and install dependencies**

```bash
git clone <repository-url>
cd dx
meteor npm install
```

2. **Configure GitHub OAuth**

   - Go to GitHub Developer Settings (https://github.com/settings/developers)
   - Create a new OAuth App
   - Copy the Client ID and Client Secret

3. **Set up the settings.json file**

Edit `private/env/dev/settings.json`:

```json
{
  "services": {
    "github": {
      "loginStyle": "popup",
      "clientId": "<your-client-id>",
      "secret": "<your-client-secret>"
    }
  }
}
```

4. **Run the application**

```bash
meteor npm run start
```
