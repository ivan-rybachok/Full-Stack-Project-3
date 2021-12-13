let express = require("express");
let cors = require('cors');
let path = require('path');
let MongoClient = require("mongodb").MongoClient;
let sanitizer = require('express-sanitizer');
let ObjectId = require('mongodb').ObjectId;

// MongoDB constants
const URL = "mongodb://mongo:27017/";
const DB_NAME = "dbTechs";

// construct application object via express
let app = express();
// add cors as middleware to handle CORs errors while developing
app.use(cors());

// add middleware to work with incoming JSON
app.use(express.json());
app.use(sanitizer());

// get absolute path to /build folder (production build of react web app)
const CLIENT_BUILD_PATH = path.join(__dirname, "./../../client/build");
// adding middleware to define static files location
app.use("/", express.static(CLIENT_BUILD_PATH));

app.get("/get", async (request, response) => {
    // construct a MongoClient object, passing in additional options
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });

    try {
        await mongoClient.connect();
        // get reference to database via name
        let db = mongoClient.db(DB_NAME);
        let techArray = await db.collection("technologies").find().collation( { locale: 'en', strength: 1 } ).sort("name",1).toArray();
        let courseArray = await db.collection("courses").find().collation( { locale: 'en', strength: 1 } ).sort("code",1).toArray();
        let json = { "technologies": techArray, "courses": courseArray};
        // serializes sampleJSON to string format
        response.status(200);
        response.send(json);
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;    
    } finally {
        mongoClient.close();
    }
});

app.post("/post/course", async (request, response) => {
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    // Use connect method to connect to the server
    try {
        await mongoClient.connect(); 
        // get reference to desired collection in DB
        // let courseCollection = mongoClient.db(DB_NAME).collection("courses");

        // sanitize form input
        request.body.code = request.sanitize(request.body.code);
        request.body.name = request.sanitize(request.body.name);

        // add new document into DB collection
        let result = await mongoClient.db(DB_NAME).collection("courses").insertOne(request.body);

        // status code for created
        response.status(200);
        response.send(result);
        
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});

app.post("/post/tech", async (request, response) => {
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    // Use connect method to connect to the server
    try {
        await mongoClient.connect(); 
        // get reference to desired collection in DB
        // let techCollection = mongoClient.db(DB_NAME).collection("technologies");

        // sanitize form input
        
        request.body.name = request.sanitize(request.body.name);
        // let name = request.body.name;
        request.body.description = request.sanitize(request.body.description);
        // let description = request.body.description;
        request.body.difficulty = parseInt(request.body.difficulty);
        // let difficulty = parseInt(request.body.difficulty);
        request.body.courses.forEach(course => {
            course.code = request.sanitize(course.code);
            course.name = request.sanitize(course.name);
        });

        // add new document into DB collection
        let result = await mongoClient.db(DB_NAME).collection("technologies").insertOne(request.body);

        // status code for created
        response.status(200);
        response.send(result);
        
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});


app.post("/post/edit/tech", async (request, response) => {
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    // Use connect method to connect to the server
    try {
        await mongoClient.connect(); 
        // get reference to desired collection in DB
        let techCollection = mongoClient.db(DB_NAME).collection("technologies");

        // isolating route parameter
        let id = new ObjectId(request.sanitize(request.body._id));

        // sanitize form input
        request.body.name = request.sanitize(request.body.name);
        request.body.description = request.sanitize(request.body.description);
        request.body.difficulty = parseInt(request.body.difficulty);
        request.body.courses.forEach(course => {
            course.code = request.sanitize(course.code);
            course.name = request.sanitize(course.name);
        });
        // request.body.code = request.sanitize(request.body.code);
        // request.body.name = request.sanitize(request.body.name);

        // add new document into DB collection
        let selector = { "_id": id };
        let newValues = { $set: {"name": request.body.name , "description": request.body.description, "difficulty" : request.body.difficulty,  "courses": request.body.courses} };
        let result = await techCollection.updateOne(selector, newValues);

        if (result.matchedCount <= 0) {
            response.status(404);
            response.send({error: "No technology documents found with ID"});
            mongoClient.close();
            return;
        }
        
        response.status(200);
        response.send(result);
        
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});

app.post("/post/edit/course", async (request, response) => {
    // construct a MongoClient object, passing in additional options
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });

    try {
        await mongoClient.connect();

        // sanitize form input
        let id = new ObjectId(request.sanitize(request.body._id));
        request.body.name = request.sanitize(request.body.name);

        // get reference to collection
        let coursesCollection = mongoClient.db(DB_NAME).collection("courses");
        // setup the update query
        let selector = {"_id" : id};
        
        let newValues = { $set : { "name": request.body.name } };

        // make it happen
        let result = await coursesCollection.updateOne(selector, newValues);

        // status code
        response.status(200);
        response.send(result);

    } catch (error) {
        console.log(`>>> ERROR : ${error.message}`);
        response.status(500);
        response.send({error: error.message});
    } finally {
        mongoClient.close();
    }
});

app.delete("/delete/course", async (request, response) => {
    // construct a MongoClient object, passing in additional options
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });

    let id = new ObjectId(request.sanitize(request.body._id));

    try {
        await mongoClient.connect();
    
        // get reference to collection
        let courseCollection = mongoClient.db(DB_NAME).collection("courses");
        // let techCollection = mongoClient.db(DB_NAME).collection("technologies");

        let selector = {"_id" : id};

        // make it happen
        let result = await courseCollection.deleteOne(selector);
        // let result1 = await techCollection.deleteOne(selector);
        
        if (result.deletedCount <= 0) {
            response.status(404);
            response.send({error: "No technology documents found with ID"});
            mongoClient.close();
            return;
        }

        // status code
        response.status(200);
        response.send(result);

    } catch (error) {
        console.log(`>>> ERROR : ${error.message}`);
        response.status(500);
        response.send({error: error.message});
    } finally {
        mongoClient.close();
    }
});
app.delete("/delete/tech", async (request, response) => {
    // construct a MongoClient object, passing in additional options
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });

    let id = new ObjectId(request.sanitize(request.body._id));

    try {
        await mongoClient.connect();
    
        // get reference to collection
        let techCollection = mongoClient.db(DB_NAME).collection("technologies");

        let selector = {"_id" : id};

        // make it happen
        let result = await techCollection.deleteOne(selector);
        
        if (result.deletedCount <= 0) {
            response.status(404);
            response.send({error: "No technology documents found with ID"});
            mongoClient.close();
            return;
        }

        // status code
        response.status(200);
        response.send(result);

    } catch (error) {
        console.log(`>>> ERROR : ${error.message}`);
        response.status(500);
        response.send({error: error.message});
    } finally {
        mongoClient.close();
    }
});

// wildcard to handle all other non-api URL routings and point to index.html
app.use((request, response) => {
    response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(8080, () => console.log("Listening on port 8080"));