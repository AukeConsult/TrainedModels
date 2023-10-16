import {Collection, Document, FindCursor, MongoClient, ObjectId} from "mongodb";

export default class UserDb {

    private mongoClient: MongoClient;
    constructor(url: string) {this.mongoClient = new MongoClient(url)}

    async getNickname(collection: Collection<Document>, nickname: string): Promise<string> {
        let cnt = 0;
        while (await collection.countDocuments({nickname: nickname}) > 0) {
            cnt++
            nickname += cnt
            console.log(nickname)
        }
        return nickname
    }

    updateAuthProfile(authProfile: any) : Promise<any> {

        return new Promise((resolve, reject) => {

            this.mongoClient.connect().then(client => {

                const filter = {$and: [{user_email: authProfile.email },{sub: authProfile.sub}]}
                const collection = client.db().collection("users");

                collection.countDocuments(filter).then(cnt => {

                    if(cnt==0) {

                        this.getNickname(collection,authProfile.nickname).then(nickname => {

                            collection.findOneAndUpdate(
                                filter,
                                {
                                    $set:
                                        {
                                            nickname: nickname,
                                            user_email: authProfile.email,
                                            sub: authProfile.sub,
                                            profile: {
                                                fullname: authProfile.name,
                                                picture: authProfile.picture,
                                                email: authProfile.email,
                                                title: "",
                                                intro: "",
                                            },
                                            interests: [
                                                "training",
                                                "development",
                                                "sales",
                                                "consultancy"
                                            ],
                                            tags: [
                                                {parentid: "x", id: "healt", desc: "", search: ""},
                                                {parentid: "x", id: "domain", desc: "", search: ""}
                                            ],
                                            docs: [
                                                {docid: 1123123123123, type: "model", ingres: ""},
                                                {docid: 1123123123123, type: "trainer", ingres: ""}
                                            ],
                                            authProfile: authProfile,

                                        }
                                },
                                {returnDocument: "after", upsert: true}

                            ).then(retUser => {
                                resolve( {
                                    newuser: true,
                                    user: retUser
                                })
                            }).catch(err => {
                                reject({err: err})
                            })

                        })

                    } else {

                        collection.findOneAndUpdate(
                            filter,
                            {
                                $set: {authProfile: authProfile}
                            },
                            {returnDocument: "after", upsert: true}
                        ).then(retUser => {
                            resolve( {
                                user: retUser
                            })
                        }).catch(err => {
                            reject({err: err})
                        })
                    }

                })

            }).catch(err => {
                reject({
                    err: err
                });
            })
        });
    }

    updateUser(id: any, user: any): Promise<any> {

        return new Promise((resolve, reject) => {

            this.mongoClient.connect().then(client => {

                const collection = client.db().collection("users");
                const filter = {_id: new ObjectId(id)}
                this.getNickname(collection,user.nickname).then(nickname => {

                    user.nickname = nickname
                    collection.findOneAndUpdate(
                        filter,
                        { $set: user },
                        {returnDocument: "after", upsert: true}
                    ).then(retUser => {
                        resolve( {
                            user: retUser
                        })
                    }).catch(err => {
                        reject({
                            err: err
                        });
                    })
                })

            }).catch(err => {
                reject({
                    err: err
                });
            })
        });

    }

    updateAndGet(
        document: string,
        filter: any,
        set: any,
        retResolve: (retObject: any) => any
    ) {
        return new Promise((resolve, reject) => {
            this.mongoClient.connect().then(client => {
                client.db().collection(document).findOneAndUpdate(
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

    async findTag(tagType: string) {
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

    async findAllTags() {
        return new Promise((resolve, reject) => {
            this.mongoClient.connect().then(async client => {

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

    async getUser(id: any) {
        return new Promise((resolve, reject) => {
            this.mongoClient.connect().then(client => {
                client.db().collection("users").findOne(
                    {_id: id}
                ).then(user => {
                    resolve(user)
                }).catch((reason: any) => console.log(reason))
            }).catch(err => {
                reject({err: err});
            })
        });
    }

}