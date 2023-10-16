import {Collection, Document, FindCursor, MongoClient, ObjectId} from "mongodb";

export default class TagsDb {

    private mongoClient: MongoClient;
    constructor(url: string) {this.mongoClient = new MongoClient(url)}

    async updateTags(tagType: string, tagValues:any) {
        try {
            const client = await this.mongoClient.connect()
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

    findTag(tagType: string) {
        return new Promise((resolve, reject) => {
            this.mongoClient.connect().then(client => {
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

    findAllTags() {
        return new Promise((resolve, reject) => {
            this.mongoClient.connect().then(async client => {
                resolve(client.db().collection("tagtypes").find({},{
                    sort: {type: 1},
                    projection: {_id: 0, type: 1, descr: 1, tags: 1},
                }).toArray())
            }).catch(err => {
                reject({err: err});
            })
        });
    }

}