# gcloud-secret-inject

Inject gcloud secrets into config files.  Works with any text file.

## Install

Install globally so you can use it anywhere. Can install only within a single package too.
```
npm install -g gcloud-secret-inject
```

## Usage

```
gcloud-secret-inject -i some.env.template -o some.env
```

Example Input File: `some.env.template`
```
host="sm://projects/xxxx/secrets/SomeSecret"
ingestionToken="sm://projects/xxxx/secrets/SomeOtherSecret"
```

Output File: `some.env`
```
host="https://google.com"
ingestionToken="ABCDEG"
```

Note: quotes are unnecessary.  The example file works without quotes.

## Thanks

Inspired by `op inject` by 1Password.
