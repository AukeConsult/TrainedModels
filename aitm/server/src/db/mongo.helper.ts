import {MongoClient} from "mongodb";

export default class MongoHelper {
    private mongoUrl = 'mongodb://0.0.0.0:27017/models'
    private mongoDb: MongoClient;
    constructor() {
        this.mongoDb = new MongoClient(this.mongoUrl)
    }

    findOneAndUpdate(
        document: string,
        filter: any,
        set: any,
        retResolve: (retObject: any) => any
    ) {
        return new Promise((resolve, reject) => {
            this.mongoDb.connect().then(client => {
                const doc = client.db().collection(document)
                doc.findOneAndUpdate(
                    filter,
                    { $set: set },
                    {returnDocument: "after", upsert: true, includeResultMetadata: true}
                ).then(retUser => {
                    resolve(retResolve(retUser))
                })
            }).catch(err => {
                reject({
                    err: err
                });
            })
        });
    }
}