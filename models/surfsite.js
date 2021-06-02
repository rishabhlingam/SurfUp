const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({ url : String, filename : String });
ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

const SurfsiteSchema = new Schema({
    title : String,
    image : [ImageSchema],
    price : Number,
    description : String,
    location : String,
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    }],
    author : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
}, { toJSON : { virtuals : true } });

SurfsiteSchema.virtual("properties.popUpMarkup").get(function (params) {
    return `<a href="/surfsites/${this._id}">${this.title}</a>`;
});

SurfsiteSchema.post("findOneAndDelete", async function(doc) {
    if(doc) {
        await Review.deleteMany({ _id : { $in : doc.reviews }});
    }
});

module.exports = mongoose.model("Surfsite", SurfsiteSchema);