const { response } = require('express');
const Comment = require('../models/Comment');
const Response = require('../models/Response');

module.exports = {
    indexComments: (req,res) =>{
        const {review} = req.params;

        Comment.find({review}).populate('writer', 'name + avatar -_id').then((comments) =>{
            res.status(200).send(comments);
        }).catch((err) => {
            res.status(500).send({error: err});    
        })
    }, 
    indexResponses: (req,res) =>{
        const {respond} = req.params;

        Response.find({respond}).populate('writer', 'name + avatar -_id').then((responses) =>{
            res.status(200).send(responses);
        }).catch((err) => {
            res.status(500).send({error: err});    
        });
    },
    addComment: (req,res) => {
        const {review} = req.params;
        const {content,writer} = req.body;
        const payload = req.decoded;

        if(payload.userId || typeof payload.userId != undefined || payload.userId != null){
        
            const comment = new Comment({content,writer,review});
            comment.save().then(() => {
                res.sendStatus(201);
            }).catch((err) => {
                res.status(500).send({error:err});
            });

        }else{
            res.status(401).send({ error: 'You must be logged in with your account' });
        } 
    },
    removeComment: (req,res) => {
        const {comment_id} = req.params;
        const payload = req.decoded;

        
        if(payload.userId || typeof payload.userId != undefined || payload.userId != null){

            Comment.deleteOne({_id: comment_id,writer:payload.userId}).then((response) => {
                if(response.n === 0){
                    res.status(401).send({error: 'You must be logged in with your account'});
                    return;
                }
                Response.deleteOne({respond:comment_id}).then(() =>{
                    res.sendStatus(204);
                }).catch((err) =>{
                    res.status(500).send({error:err});
                })
            }).catch((err) => {
                res.status(500).send({error:err});
            });
        }else{
            res.status(401).send({ error: 'You must be logged in with your account' });
        }
    },
    updateComment: (req,res) => {
        const {comment_id} = req.params;
        const {content} = req.body;
        const payload = req.decoded;

        if(!content || typeof content === undefined || content === null){
            res.status(400).send({error: 'Empty content'});
            return;
        }

        if(payload.userId || typeof payload.userId != undefined || payload.userId != null){
            Comment.updateOne({_id:comment_id, writer: payload.userId},{content}).then(() => {
                res.sendStatus(200);
            }).catch((err) => {
                res.status(500).send({error:err});
            })
        }else{
            res.status(401).send({ error: 'You must be logged in with your account' });
        }
    },
    updateResponse: (req,res) => {
        const {response_id} = req.params;
        const {content} = req.body;
        const payload = req.decoded;

        if(!content || typeof content === undefined || content === null){
            res.status(400).send({error: 'Empty content'});
            return;
        }

        if(payload.userId || typeof payload.userId != undefined || payload.userId != null){
            Response.updateOne({_id:response_id, writer: payload.userId},{content}).then(() => {
                res.sendStatus(200);
            }).catch((err) => {
                res.status(500).send({error:err});
            })
        }else{
            res.status(401).send({ error: 'You must be logged in with your account' });
        }
    },
    removeResponse: (req,res) =>{
        const {response_id} = req.params;
        const payload = req.decoded;

        if(payload.userId || typeof payload.userId != undefined || payload.userId != null){
            Response.deleteOne({_id: response_id,writer:payload.userId}).then((response) => {
                if(response.n === 0){
                    res.status(401).send({ error: 'You must be logged in with your account' });
                    return;
                }
                /*Comment.remove({$pull:{"responses.responseId": response_id}}).then(() =>{
                    res.sendStatus(204);
                }).catch((err) =>{
                    res.status(500).send({error:err});
                })*/
                res.sendStatus(204);
            }).catch((err) => {
                res.status(500).send({error:err});
            });
        }else{
            res.status(401).send({ error: 'You must be logged in with your account' });
        }
    },
    addResponse:(req,res) => {
        const {content,writer,comment} = req.body;
        const payload = req.decoded;

        if(payload.userId || typeof payload.userId != undefined || payload.userId != null){
        
            const response = new Response({content,writer,respond:comment});
            
            response.save().then( async (response) => {
                //const result = await Comment.update({_id:comment},{$push:{responses: { responseId: response._id}}})
                res.sendStatus(201);
            }).catch((err) => {
                res.status(500).send({error:err});
            });

        }else{
            res.status(401).send({ error: 'You must be logged in with your account' });
        } 
    },
    addRemoveCommentLike: (req,res) =>{     
        const {user, comment} = req.body;
        const payload = req.decoded;

        if(payload.userId || typeof payload.userId != undefined || payload.userId != null){
            Comment.updateOne({_id:comment},{$addToSet: {likes: user}, $pull:{dislikes: user}}).then((response) => {
                if(response.n === 1 && response.nModified === 0 && response.ok === 1){
                    Comment.updateOne({_id:comment},{$pull:{"likes":user}}).then((response) => {
                        res.status(200).send({message: "like removed"})
                    }).catch((err) =>{
                        res.status(500).send({error:err});
                    });
                    return;
                }
                res.status(200).send({message:"liked"});
            }).catch((err) =>{
                res.status(500).send({error:err})
            });

        }else{
            res.status(401).send({ error: 'You must be logged in with your account' });
        } 
    },
    addRemoveCommentDislike: (req, res) => {
        const {user, comment} = req.body;
        const payload = req.decoded;

        if(payload.userId || typeof payload.userId != undefined || payload.userId != null){
            Comment.updateOne({_id:comment},{$addToSet: {dislikes: user}, $pull:{likes: user}}).then((response) => {
                if(response.n === 1 && response.nModified === 0 && response.ok === 1){
                    Comment.updateOne({_id:comment},{$pull:{"dislikes":user}}).then((response) => {
                        res.status(200).send({message: "dislike removed"})
                    }).catch((err) =>{
                        res.status(500).send({error:err});
                    });
                    return;
                }
                res.status(200).send({message:"disliked"});
            }).catch((err) =>{
                res.status(500).send({error:err})
            });

        }else{
            res.status(401).send({ error: 'You must be logged in with your account' });
        } 
    },
    addRemoveResponseLike: (req,res) =>{     
        const {user, response} = req.body;
        const payload = req.decoded;

        if(payload.userId || typeof payload.userId != undefined || payload.userId != null){
            Response.updateOne({_id:response},{$addToSet: {likes: user}, $pull:{dislikes: user}}).then((result) => {
                if(result.n === 1 && result.nModified === 0 && result.ok === 1){
                    Response.updateOne({_id:response},{$pull:{"likes":user}}).then(() => {
                        res.status(200).send({message: "like removed"})
                    }).catch((err) =>{
                        res.status(500).send({error:err});
                    });
                    return;
                }
                res.status(200).send({message:"liked"});
            }).catch((err) =>{
                res.status(500).send({error:err})
            });

        }else{
            res.status(401).send({ error: 'You must be logged in with your account' });
        } 
    },
    addRemoveResponseDislike: (req, res) => {
        const {user, response} = req.body;
        const payload = req.decoded;

        if(payload.userId || typeof payload.userId != undefined || payload.userId != null){
            Response.updateOne({_id:response},{$addToSet: {dislikes: user}, $pull:{likes: user}}).then((result) => {
                if(result.n === 1 && result.nModified === 0 && result.ok === 1){
                    Response.updateOne({_id:response},{$pull:{"dislikes":user}}).then(() => {
                        res.status(200).send({message: "dislike removed"})
                    }).catch((err) =>{
                        res.status(500).send({error:err});
                    });
                    return;
                }
                res.status(200).send({message:"disliked"});
            }).catch((err) =>{
                res.status(500).send({error:err})
            });

        }else{
            res.status(401).send({ error: 'You must be logged in with your account' });
        } 
    }
}