const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Surfsite = require('../models/surfsite');

mongoose.connect('mongodb://localhost:27017/surf-up', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Surfsite.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30);
        const Cities = cities[random1000];
        const site = new Surfsite({
            author : "60b54693b2934ab0fb0b4a49",
            location: `${Cities.city}, ${Cities.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel libero harum fugiat deleniti? Facere temporibus sequi est commodi ullam illo? Quasi illo, eum officia autem molestiae debitis odio. Pariatur, eum!",
            price: price,
            image : [
                {
                  url: 'https://res.cloudinary.com/dcjtxvmw2/image/upload/v1622571684/SurfUp/xvkuyjffjladzzudg15b.png',
                  filename: 'SurfUp/xvkuyjffjladzzudg15b'
                }
              ],
            geometry : {
                type : "Point",
                coordinates : [Cities.longitude, Cities.latitude]
            }  
        })
        await site.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})