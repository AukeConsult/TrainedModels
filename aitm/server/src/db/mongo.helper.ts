import {FindCursor, FindOptions, MongoClient} from "mongodb";

export default class MongoHelper {

    private mongoDb: MongoClient;
    constructor(mongoUrl: string) {
        this.mongoDb = new MongoClient(mongoUrl)
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

    async updateTags(tagType: string, tagValues:any) {
        try {
            const client = await this.mongoDb.connect()
            const tags = client.db().collection("tagtypes")
            const ret = await tags.findOneAndUpdate(
                {type: tagType},
                { $set: tagValues },
                {returnDocument: "after", upsert: true, includeResultMetadata: true}
            )
        } catch (err) {
            console.log(err)
        }
    }

    async findTag(tagType: string) {
        return new Promise((resolve, reject) => {
            this.mongoDb.connect().then(client => {
                client.db().collection("tagtypes").findOne(
                    {type: tagType},
                    {
                        projection: {_id: 0, type: 1, descr: 1, tags: 1},
                    }
                ).then(tags => {
                    resolve(tags)
                }).catch((reason: any) => console.log(reason))
            }).catch(err => {
                reject({err: err});
            })
        });
    }

    async findAllTags() {
        return new Promise((resolve, reject) => {
            this.mongoDb.connect().then(async client => {

                const tags = client.db().collection("tagtypes");
                const docs: FindCursor<any> = tags.find({},{
                    sort: {type: 1},
                    projection: {_id: 0, type: 1, descr: 1, tags: 1},
                })
                const ret = []
                for await (const doc of docs) {
                    ret.push(doc)
                }
                resolve(ret)

            }).catch(err => {
                reject({err: err});
            })
        });
    }

}