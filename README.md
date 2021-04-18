# App Engine version cleaner

🧹 Keep your App Engine versions clean and tidy. 

This service deployable on Cloud Run allows you to automatically delete previous `App Engine` versions, it only keeps the new version you deploy and the last one.

## Setup

1. Click the deploy button:

[![Run on Google Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run/?git_repo=https://github.com/SantiMA10/app-engine-version-cleaner.git)

2. Give the Cloud Run service the `App Engine Admin` role.
3. Create a new `google.appengine.v1.Versions.CreateVersion` trigger for the Cloud Run service.

    During this configuration you can choose which `App Engine` services you want to be affected by this "Cleaner".