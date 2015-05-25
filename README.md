# lipsyncly

In order to make things work locally follow these steps:
1. Get Iron worker credentials 
> setx IRON_WORKER_TOKEN 'token' /m
> setx IRON_WORKER_PROJECT_ID 'project id' /n

2. Create iron.json file in the worker folder with the credentials
{"token":"token","project_id":"project_id"}

3. Get AWS S3 credentials
> setx AWS_ACCESS_KEY 'AWS_ACCESS_KEY' /m
> setx AWS_SECRET_KEY 'AWS_SECRET_KEY' /m

4. Get transloadit credentials
> setx TRANSLOADIT_AUTH_KEY 'TRANSLOADIT_AUTH_KEY' /m
> setx TRANSLOADIT_AUTH_SECRET 'TRANSLOADIT_AUTH_SECRET' /m

