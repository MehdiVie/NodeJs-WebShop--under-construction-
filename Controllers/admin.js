const Product = require('../models/product');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
 
exports.getProducts = (req, res, next)=>{
    Product
        .find({ userId : req.user._id})
        //.select('title price -_id')
        //.populate('userId','name')
        .then((products) => {
            res.render('admin/products' , {
                prods:  products, 
                pageTitle: "Admin Products" , 
                path : '/admin/products' , 
                isAuthenticated : req.session.isLoggedIn ,
            });
        })
        .catch(err => console.log(err));
};

exports.getAddProduct = (req, res, next)=>{

    
    res.render('admin/edit-product' , {
        pageTitle : 'Add Product' , 
        path : '/admin/add-product' ,
        edit : false ,
        isAuthenticated : req.session.isLoggedIn ,
        hasError : false ,
        errorMessage : null , 
        validationErrors : []
    })

};

exports.postAddProduct = (req, res, next)=>{
    const title = req.body.title;
    const imageUrl = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product' , {
            pageTitle : 'Add Product' , 
            path : '/admin/edit-product' ,
            edit : false , 
            hasError : true ,
            errorMessage : errors.array()[0].msg ,
            validationErrors : errors.array()
            ,
            product : {
                title : title , 
                imageUrl : imageUrl , 
                price : price ,
                description : description
            }
        })
    }
    const product = new Product({
        //_id : new mongoose.Types.ObjectId('67bb921c87b1bfa751d9477d') ,
        title: title , 
        price: price , 
        imageUrl: imageUrl , 
        description: description , 
        userId : req.user._id
    }) 
    product
        .save()
        .then(result => {
            console.log('Created Product!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500 ;
            return next(error);
        });
};

exports.getEditProduct = (req, res, next)=>{
    const edit = req.query.edit;
    if (!(edit)) {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    Product
        .findById(productId)
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product' , {
                pageTitle : 'Eidt Product' , 
                path : '/admin/edit-product' ,
                product : product ,
                edit : true ,
                hasError : false,
                errorMessage : null , 
                validationErrors : []
            })
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next)=>{
    const prodId = req.body.editId;
    if (!ObjectId.isValid(prodId)) {
        console.log("Invalid ObjectId:", prodId);
        return res.status(400).send("Invalid Product ID");
    }
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product' , {
            pageTitle : 'Edit Product' , 
            path : '/admin/edit-product' ,
            edit : true , 
            hasError : true ,
            errorMessage : errors.array()[0].msg ,
            validationErrors : errors.array()
            ,
            product : {
                title : title , 
                imageUrl : imageUrl , 
                price : price ,
                description : description ,
                _id : prodId
            }
        })
    }

    Product.findById(prodId)
        .then(product => {
            if (!product) {
                req.flash('error','Product not found!')
                return res.redirect('/');
            }   
            if (product.userId.toString() !== req.user._id.toString()) {
                req.flash('error','Product not found!')
                return res.redirect('/');
            }
            product.title=title;
            product.imageUrl=imageUrl;
            product.price=price;
            product.description=description;
            return product.save()        
                .then(result => {
                    console.log("UPDATED SUCCESSFULLY!");
                    res.redirect('/admin/products');
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500 ;
            return next(error);
        });
};

exports.getDeleteProduct = (req, res, next)=>{
    const deleteing = req.query.deleteing;
    if (!(deleteing)) {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    Product
        .findById(productId)
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/delete-product' , {
                pageTitle : 'Delete Product' , 
                path : '/admin/delete-product' ,
                product : product ,
                deleteing : true
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500 ;
            return next(error);
        });
};

exports.postDeleteProduct = (req, res, next)=>{
    const id = req.body.deleteId;
    Product.deleteOne({_id : id , userId : req.user._id})
        .then((result) => {
            if (result.deletedCount === 1) {
                console.log("DELETED SUCCESSFULLY!");
            }
            res.redirect("/admin/products");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500 ;
            return next(error);
        });
};

