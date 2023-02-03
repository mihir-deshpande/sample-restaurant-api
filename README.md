# Sample Restaurant RESTful API
A RESTful API built with Express.js, Node.js and MongoDB using <a href="https://www.mongodb.com/docs/atlas/sample-data/sample-restaurants/" target="_blank">Sample Restaurant Database</a> to manage a collection of restaurants.

<a href="https://breakable-ray-sweater.cyclic.app/" target="_blank">https://breakable-ray-sweater.cyclic.app/</a>

## Endpoints

- GET /api/restaurants
  - Accepts the numeric query parameters "page" and "perPage" as well as the string parameter "borough", i.e. /api/restaurants?page=1&perPage=5&borough=Bronx. It returns all "Restaurant" objects for a specific "page" to the client, optionally filtered by "borough", if provided.
  - <a href="https://breakable-ray-sweater.cyclic.app/api/restaurants?page=1&perPage=5" target="_blank">https://breakable-ray-sweater.cyclic.app/api/restaurants?page=1&perPage=5</a>


- GET /api/restaurants/:id
  - Accepts a route parameter that represents the _id of the desired restaurant object, i.e. /api/restaurants/5eb3d668b31de5d588f4292e. It returns a specific "Restaurant" object to the client.
  - <a href="https://breakable-ray-sweater.cyclic.app/api/restaurants/5eb3d668b31de5d588f4292e" target="_blank">https://breakable-ray-sweater.cyclic.app/api/restaurants/5eb3d668b31de5d588f4292e</a>

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
- <a href="https://breakable-ray-sweater.cyclic.app/restaurants" target="_blank">https://breakable-ray-sweater.cyclic.app/restaurants</a>
