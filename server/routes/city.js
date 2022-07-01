const router = require('express').Router();
const City = require('../schema').city;
const Address = require('../schema').address;

router.get('/table-data', async (req, res) => {
    const cities = await City.find({}).populate({
        path: 'province',
        populate: {
            path: 'country',
        }
    });
    if (!cities) res.json({ data: [] });
    else res.json({ data: cities });
});

router.get('/table-data-auto', async (req, res) => {
    const cities = await City.find({});
    if (!cities) res.json({ data: [] });
    else res.json({ data: cities });
});

router.get('/get-cities', async (req, res) => {
    const cities = await City.find({}, { _id: 0 });
    if (!cities) res.json({ data: [] });
    else res.json({ data: cities });
});

router.get('/get-cities-search', async (req, res) => {
    const cityText = req.query.cityText;
    const province = JSON.parse(req.query.province);
    if (cityText.trim() !== '') {
        const cities = await City.find({ "name": { "$regex": cityText, "$options": "i" }, province: province[0] });
        res.json({ data: cities });
    } else res.json({ data: [] });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newCity = new City({
        name: data.name,
        province: data.province,
        active: data.active,
    });
    newCity.save();
    res.json({ data: newCity });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const city = await City.findOne({ _id: data._id });
    city.name = data.name;
    city.province = data.province;
    city.active = data.active;
    city.save();
    res.json({ data: city });
});

router.get('/get-by-ids', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const cities = await City.find({ _id: getIds }).populate({
        path: 'areas',
    });
    if (!cities) res.json({ data: [] });
    else res.json({ data: cities });
});

router.post('/delete', async (req, res) => {
    await City.deleteMany({ _id: { $in: req.body.data } });
    await Address.deleteMany({ city: { $in: req.body.data } });
    const cities = await City.find({}).populate({
        path: 'province',
        populate: {
            path: 'country',
        }
    });
    res.json({ success: true, data: cities });
});


router.post("/set-active", async (req, res) => {
    const { active, selected } = req.body;
    await City.updateMany({ _id: { $in: selected } }, { active: active });

    const cities = await City.find({}).populate({
        path: 'province',
        populate: {
            path: 'country',
        }
    });


    if (!cities) res.json({ data: [] });
    else res.json({ data: cities });

});

module.exports = router;