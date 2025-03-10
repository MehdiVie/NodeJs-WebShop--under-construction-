const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title : {
        type : String , 
        require : true
    },
    price : {
        type : Number , 
        require : true
    },
    description : {
        type : String , 
        require : true
    },
    imageUrl : {
        type : String , 
        require : true
    },
    userId : {
        type : Schema.Types.ObjectId , 
        ref : 'User' , 
        require : true
    }
});

module.exports = mongoose.model('Product' , productSchema);


/* const getDb = require('../util/database').getDb;
const { ObjectId } = require('mongodb');

class Product {
    constructor(title , price , imageUrl , description , id , userId) {
        this.title = title,
        this.price = price,
        this.description = description ,
        this.imageUrl = imageUrl,
        this._id =id ? new ObjectId(String(id)) : null;
        this.userId =userId ? new ObjectId(String(userId)) : null;
    }

    save() {
        const db= getDb();
        let dbOp=db;
        if (this._id) {
            dbOp = db.collection('products').updateOne(
                { _id : new ObjectId(String(this._id))}, { $set : this});

        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
            .then(result => console.log(result))
            .catch(err=> console.log(err));
    }

    static fetchAll() {
        const db= getDb();
        return db
            .collection('products')
            .find()
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => {
                console.log(err);
            })
            ;
    }

    static findById(prodId) {
        const db= getDb();
        return db
        .collection('products')
        .find({ _id : new ObjectId(String(prodId)) })
        .next()
        .then(product => {
            console.log(product);
            return product;
        })
        .catch(err => {
            console.log(err);
        })
        ;
    }

    static deleteById(prodId) {
        const db = getDb();
        return db
            .collection('products')
            .deleteOne({ _id : new ObjectId(String(prodId))})
            .then(() => {
                console.log('DELETED!');
            })
            .catch(err => {
                console.log(err);
            })
            ;
    }
}


module.exports = Product; */