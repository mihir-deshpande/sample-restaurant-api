# Sample Restaurant RESTful API
A RESTful API built with Express.js and Node.js and MongoDB using [Sample Restaurants Dataset](https://www.mongodb.com/docs/atlas/sample-data/sample-restaurants/) to manage a collection of restaurants.

https://breakable-ray-sweater.cyclic.app/

## Endpoints

- GET /api/restaurants
  - Accepts the numeric query parameters "page" and "perPage" as well as the string parameter "borough", i.e. /api/restaurants?page=1&perPage=5&borough=Bronx. It returns all "Restaurant" objects for a specific "page" to the client, optionally filtered by "borough", if provided.
  - https://breakable-ray-sweater.cyclic.app/api/restaurants?page=1&perPage=5

- GET /api/restaurants/:id
  - Accepts a route parameter that represents the _id of the desired restaurant object, i.e. /api/restaurants/5eb3d668b31de5d588f4292e. It returns a specific "Restaurant" object to the client.
  - https://breakable-ray-sweater.cyclic.app/api/restaurants/5eb3d668b31de5d588f4292e

- POST /api/restaurants
  - Adds a new "Restaurant" document to the collection and returns the created object/fail message to the client.
  - You need to log in and generate a JWT access token and send it in the header for this endpoint.


- PUT /api/restaurants/:id
  - Accepts a route parameter that represents the _id of the desired restaurant object, i.e. /api/restaurants/5eb3d668b31de5d588f4292e and reads the contents of the request body. It updates a specific "Restaurant" document in the collection and returns a success/fail message to the client.
  - You need to log in and generate a JWT access token and send it in the header for this endpoint.


- DELETE /api/restaurants/:id
  - Accepts a route parameter that represents the _id of the desired restaurant object, i.e. /api/restaurants/5eb3d668b31de5d588f4292e. It deletes a specific "Restaurant" document from the collection and returns a success/fail message to the client.
  - You need to log in and generate a JWT access token and send it in the header for this endpoint.
  

## GUI to filter and view all Restaurants 
- https://breakable-ray-sweater.cyclic.app/restaurants
