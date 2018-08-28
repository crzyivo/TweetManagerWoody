var mongoose = require('mongoose');
const UrlShorten = require('../models/urlShorten');
const validUrl = require("valid-url");
const shortid = require("shortid");
const errorUrl='https://mighty-depths-30160.herokuapp.com/index';

const urlGet = async (req,res) => {
    const urlCode = req.params.code;
    const item = await UrlShorten.findOne({ urlCode: urlCode });
    if (item) {
      res.redirect(item.originalUrl);
    } else {
        console.log("fail")
      res.redirect(errorUrl);
    }
  };

  const urlGetAll = async (req,res) => {
    const item = await UrlShorten.find({},function(err, data){
        if(err){
            response = {"error" : true,"message" : "Error al obtener datos"};
        }else{
            response = {"error" : false,"message" : data};
        }
        res.json(response);
    })
  };

  const urlPost = async (req,res) => {
    const { originalUrl, shortBaseUrl } = req.body;
    if (validUrl.isUri(shortBaseUrl)) {
    } else {
      return res
        .status(401)
        .json(
          "Invalid Base Url"
        );
    }
    const urlCode = shortid.generate();
    const updatedAt = new Date();
    if (validUrl.isUri(originalUrl)) {
      try {
        const item = await UrlShorten.findOne({ originalUrl: originalUrl });
        if (item) {
          res.status(200).json(item);
        } else {
          shortUrl = shortBaseUrl + "/" + urlCode;
          const item = new UrlShorten({
            originalUrl,
            shortUrl,
            urlCode,
            updatedAt
          });
          await item.save();
          console.log(item)
          res.status(200).json(item);
        }
      } catch (err) {
          console.log(err)
        res.status(401).json("Invalid User Id");
      }
    } else {
      return res
        .status(401)
        .json(
          "Invalid Original Url"
        );
    }
  };

module.exports = {
    urlGet,urlPost,urlGetAll
};