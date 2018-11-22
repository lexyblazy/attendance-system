# attendance-system

## Some worthy notes.
* I am using a 24hr timestamp
* You can check-in and checkout at any time,
* Because I am in  development mode. I made it such that you can check-in again in the next 5 seconds after the previous checkin (Ideally this should be set to 24hrs. depending on the how the work place is run. It could be a day job, or a job with morning and night shifts. the code can suit any purpose with a bit of modification)
* If an employee does not checkout for a certain day . the number of work hours is not computed for that day and it will not be added to the total number of work hours of that employee.


## Some stuff that I will add later
* Ability for the employees to search for their names
* Some administrative work route. for the manager
* Data visualizations using d3.js (bar, charts, heat maps, nodes) etc. d3.js remains the best in-browser data visualization library.


## Requirements

- Node.js
- Mongo (You can follow this guide to get mongo with docker https://gist.github.com/jrichardsz/3f5ab6cffb2a4393fda331315469ad83)

## Getting started

- start a mongo database process

- expose environment variables
```
export DATABASE=localhost
export port=9000
export SECRET=1e1df736
```
- install libraries
```
npm install
```
- start in dev mode
```
npm run dev
```

- You must see this log:

```
Server is up and running
Connection to database was succesful
```

Other logs could be indicate an error.


## Home Page

Point your browser at http://localhost:9000 and you will be see something like:

![demo](https://image.ibb.co/jK6WaA/demo.gif)
