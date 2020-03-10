var roundModel = require('../../models').rounds;
const fs = require('fs');

exports.getTrajNodeById = async(req, res, next) => {
    const node_id = req.params.node_id;
    console.log(`ID : ${node_id}`);
    
    try {
        let allRounds = await roundModel.findAll();
        //var jsonarray = [];
        let resultData = null;
        let result = null;

        for (var i = 0; i < allRounds.length; i++) {
            let path = allRounds[i].dataValues.geojson_path;

            let rawdata = fs.readFileSync(path);
            let geojsonData = JSON.parse(rawdata);
            
            // console.log({TmpFeatures:geojsonData.features})

            let featuresList = geojsonData.features;
            // for(var feature in featuresList){
            for(var idxFeature = 0; idxFeature < featuresList.length; idxFeature++){
                let feature = featuresList[idxFeature]
                // console.log({TmpFeature:feature})
                if(feature.properties.node_id == node_id){
                    resultData = feature.properties
                }
            }
            //jsonarray.push(resJson);
        }

        if(resultData === null){
            result = {
                "result":`error - information for given ID[${node_id}] not found`
            }
        }else{
            result = {
                "data":resultData,
                "result":`success`
            }
        }

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getAllTrajNodes = async(req, res, next) => {
    try {
        let result = await roundModel.findAll();
        //var jsonarray = [];

        for (var i = 0; i < result.length; i++) {
            let path = result[i].dataValues.geojson_path;

            let rawdata = fs.readFileSync(path);
            let resJson = JSON.parse(rawdata);
            result[i].dataValues.geojson = resJson;
            //jsonarray.push(resJson);
        }

        res.json(result);

    } catch (error) {
        console.error(error);
        next(error);
    }
}