const Surfsite = require("../models/surfsite");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxAccessToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken : mapBoxAccessToken});
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
    const surfsites = await Surfsite.find({});
    const vals = { surfsites };
    res.render("surfsites/index", vals);
};

module.exports.renderNewForm = async (req, res) => {
    res.render("surfsites/new");
};

module.exports.showSurfsite = async (req, res) => {
    const id = req.params.id;
    const surfsite = await Surfsite.findById(id).populate({
        path : "reviews",
        populate : {
            path : "author"
        }}).populate("author");
    if(!surfsite) {
        req.flash("error", "Surfsite not found :(");
        res.redirect("/surfsites");
    }
    const vals = { surfsite };
    res.render("surfsites/show", vals);
};

module.exports.renderEditForm = async (req, res) => {
    const id = req.params.id;
    const surfsite = await Surfsite.findById(id);
    if(!surfsite) {
        req.flash("error", "Surfsite not found :(");
        res.redirect("/surfsites");
    }
    const vals = { surfsite };
    res.render("surfsites/edit", vals);
};

module.exports.createNewSurfsite = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query : req.body.surfsite.location,
        limit : 1
    }).send();
    const newSurfsite = new Surfsite(req.body.surfsite);
    newSurfsite.geometry = geoData.body.features[0].geometry;
    newSurfsite.image = req.files.map(f => ({url : f.path, filename : f.filename}));
    newSurfsite.author = req.user._id;
    await newSurfsite.save();
    req.flash("success", "Successfully added Surfsite!");
    res.redirect(`/surfsites/${newSurfsite._id}`);
};

module.exports.updateSurfsite = async (req, res) => {
    const { id } = req.params;
    const surfsite = await Surfsite.findByIdAndUpdate(id,{...req.body.surfsite});
    const imgs = req.files.map(f => ({url : f.path, filename : f.filename}));
    surfsite.image.push(...imgs);
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
           cloudinary.uploader.destroy(filename);
        } 
        await surfsite.updateOne({ $pull  :  { image : { filename : req.body.deleteImages }  }});
    }
    await surfsite.save();
    req.flash("success", "Successfully updated Surfsite!");
    res.redirect(`/surfsites/${surfsite._id}`);
};

module.exports.deletesSurfsite = async (req, res) => {
    const { id } = req.params;
    const surfsite = await Surfsite.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Surfsite!");
    res.redirect(`/surfsites`);
};