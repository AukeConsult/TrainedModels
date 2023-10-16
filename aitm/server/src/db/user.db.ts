import {Collection, Document, FindCursor, MongoClient, ObjectId} from "mongodb";

export default class UserDb {

    private mongoClient: MongoClient;
    constructor(url: string) {this.mongoClient = new MongoClient(url)}

    lastShort_Id(client: MongoClient) {
        return client.db().collection("users").aggregate([
            {
                $group: {
                    _id: null,
                    short_id: {$max: "$short_id"}
                }
            }
        ]).next()
    }

    async newNickname(collection: Collection<Document>, nickname: string, id?: any): Promise<string> {

        if(id) {
            if(await collection.countDocuments({_id: new ObjectId(id), nickname: nickname})>0) {
                return nickname
            }
        }

        let cnt = 0;
        let testnick= nickname
        while (await collection.countDocuments({nickname: testnick}) > 0) {
            cnt++
            testnick = nickname + cnt
            console.log(testnick)
        }
        return testnick

    }

    updateAuthProfile(authProfile: any) : Promise<any> {

        return new Promise((resolve, reject) => {
            this.mongoClient.connect().then(client => {
                const collection = client.db().collection("users");
                const filter = {authid: authProfile.email + "|" + authProfile.sub}
                collection.countDocuments(filter).then(cnt => {

                    if(cnt==0) {

                        this.lastShort_Id(client).then(doc => {

                            const short_id=doc==null?1000:parseInt(doc.short_id,10)+1;

                            this.newNickname(collection,authProfile.nickname).then(nickname => {

                                collection.findOneAndUpdate(
                                    filter,
                                    {
                                        $set:
                                            {
                                                active: true,
                                                newuser: true,
                                                short_id: short_id.toString(),
                                                nickname: nickname,
                                                authid: authProfile.email + "|" + authProfile.sub,
                                                email: authProfile.email,
                                                accessrole: "admin",
                                                profile: {
                                                    fullname: authProfile.name,
                                                    picture: authProfile.picture,
                                                    alt_email: "",
                                                    title: "",
                                                    intro: "",
                                                    interests: []
                                                },
                                                meta: {
                                                    authProfile: authProfile,
                                                    roles: [
                                                        "guest"
                                                    ],
                                                    tags: [
                                                        {parentid: "x", id: "healt", desc: "", search: ""},
                                                        {parentid: "x", id: "domain", desc: "", search: ""}
                                                    ],
                                                    docs: [
                                                        {docid: 1123123123123, type: "model", ingres: ""},
                                                        {docid: 1123123123123, type: "trainer", ingres: ""}
                                                    ]
                                                },
                                            }
                                    },
                                    {returnDocument: "after", upsert: true}

                                ).then(retUser => {
                                    resolve(retUser)
                                }).catch(err => {
                                    reject({err: err})
                                })

                            })

                        }).catch(err => {
                            console.log(err)
                        })


                    } else {
                        collection.findOneAndUpdate(
                            filter,
                            {
                                $set: {
                                    newuser: false,
                                    authProfile: authProfile
                                }
                            },
                            {returnDocument: "after", upsert: true}
                        ).then(retUser => {
                            resolve(retUser)
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

                // verify update and remove fixed metadata
                if(user.meta) delete user['meta']
                if(user.newuser) delete user['newuser']
                if(user.short_id) delete user['short_id']
                if(user.authid) delete user['authid']
                if(user.email) delete user['email']
                if(user.accessrole) delete user['accessrole']

                const collection = client.db().collection("users");
                const filter = {_id: new ObjectId(id)}
                this.newNickname(
                    collection,user.nickname, id
                ).then(nickname => {
                    user.nickname = nickname
                    return user
                }).then(user =>
                    collection.findOneAndUpdate(
                        filter,
                        { $set: user },
                        {returnDocument: "after", upsert: false}
                    ).then(retUser => {
                        resolve( retUser)
                    }).catch(err => {
                        reject({
                            err: err
                        });
                    })
                )
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

    readUser(id: any) {
        return new Promise((resolve, reject) => {
            this.mongoClient.connect().then(client => {

                client.db().collection("users").findOne(id.length==24 ? {
                    _id: new ObjectId(id)
                } : {
                    $or: [{short_id: id},{nickname: id}]
                })
                    .then(user => resolve(user))
                    .catch((reason: any) => reject({err: reason}))
            }).catch(err => {
                console.log(err)
                reject({err: err});
            })
        });
    }

    readUserlist() {
        return new Promise((resolve, reject) => {
            this.mongoClient.connect().then(client => {
                client.db().collection("users").find(
                    {},{projection: {
                            _id: 1,
                            nickname: 1,
                            active: 1,
                            short_id: 1,
                            picture: 1,
                            profile: 1
                        }}
                ).toArray()
                    .then(docs => resolve(docs))
            }).catch(err => {
                console.log(err)
                reject({err: err});
            })
        });
    }

}