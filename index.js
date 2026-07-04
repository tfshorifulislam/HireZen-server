    const express = require('express')
    const app = express()
    const dotenv = require('dotenv')
    const cors = require('cors')

    dotenv.config()
    app.use(cors())
    app.use(express.json())

    const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

    app.get('/', (req, res) => {
        res.send('Hello World! Server is running successfully');
    });


    const port = process.env.PORT
    const uri = process.env.MONGODB_CONNECTION;


    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });


    const verifyToken = async (req, res, next) => {
        const token = req?.headers?.authorization;
        console.log('token with headers', token);
    
        if (!token) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
    
        const tokenParts = token?.split(' ')[1];
        console.log('token parts', tokenParts);
    
        if (!tokenParts) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
    
    
        try {
            const { payload } = await jwtVerify(tokenParts, JWKS)
            req.user = payload;
            console.log('payload', payload);
            next();
        }
        catch (error) {
            console.log('token is not verify', error);
            return res.status(401).send({ message: 'Unauthorized' });
        }
    }
      



    async function run() {
        try {
            await client.connect();

            const database = client.db("hire_Zen");
            const companyInfoCollection = database.collection('company_info');

            // this is for the recruiter data collection or Api's;
            app.post('/companyInfo', verifyToken, async (req, res) => {
                const companyInfo = req.body;
                const result = await companyInfoCollection.insertOne(companyInfo);
                res.send(result);
            });

            app.get('/companyInfo', async (req, res) => {
                const result = await companyInfoCollection.find().toArray();
                res.send(result);
            });

            app.put('/companyInfo/:id', async (req, res) => {
                const id = req.params.id;
                const companyInfo = req.body;
                const result = await companyInfoCollection.updateOne({ _id: new ObjectId(id) }, { $set: companyInfo });
                res.send(result);
            });

            app.delete('/companyInfo/:id', async (req, res) => {
                const id = req.params.id;
                const result = await companyInfoCollection.deleteOne({ _id: new ObjectId(id) });
                res.send(result);
            });

            app.get('/companyInfo/:id', async (req, res) => {
                const id = req.params.id;
                const result = await companyInfoCollection.findOne({ _id: new ObjectId(id) });
                res.send(result);
            });



        } finally {
            // await client.close();
        }
    }
    run().catch(console.dir);

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });