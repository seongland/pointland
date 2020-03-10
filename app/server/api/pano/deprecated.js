const path = require("path")
var Syno = require('syno')
var xml = require('xml')

// var syno = new Syno({
//     // Requests protocol : 'http' or 'https' (default: http)
//     protocol: 'http',
//     // DSM host : ip, domain name (default: localhost)
//     host: '10.0.0.148',
//     // DSM port : port number (default: 5000)
//     port: '5000',
//     // DSM User account (required)
//     account: 'yujeong',
//     // DSM User password (required)
//     passwd: 'tmxmfltm',
//     // DSM API version (optional, default: 6.0.2)
//     apiVersion: '6.0.2'
// });




        //res.send(fs.readFileSync('./test.xml', { encoding: 'utf-8' }))

        //  \\10.0.0.148\smms_output\0_smms_twizy\6_7\20190607_153220\tiles\00000_Panorama\pano.xml
        // syno.fs.list({ 'folder_path': '/smms_output/0_smms_twizy/6_7/20190607_153220/tiles/' + node_id + '_Panorama' }, function(err, data) {
        //     var file_name = null;
        //     var file_path = null;
        //     // console.log(data);
        //     //console.log(data.files[1]);
        //     file_name = data.files[1].name;
        //     console.log(data);
        //     //console.log(data.files[1].name);
        //     //callback(err, data);
        //     file_path = data.files[1].path;
        //     //console.log(file_path);
        //     //항상 images폴더와 pano.xml만 있다는 가정을 할수잇으면 fix index로가고
        //     //아님 for문돌려야함 for문돌려서 name이 pano.xml인

        //     //file_path = "http://10.0.0.148:5000" + file_path;
        //     //console.log("path : " + file_path);
        //     //res.set(xml(name_of_restaurants));
        //     // res.send(xml(name_of_restaurants));
        //     //res.send();
        //     //res.contentType('application/xml');
        //     //res.sendFile(path.join(file_path, 'pano.xml'));
        // });
        ///webapi/FileStation/file_download.cgi?api=SYNO.FileStation.Download&version=1&method=download&path=%2Ftest%2FITEMA_20445972-0.mp3&mode=open
        // var downloadUrl = '/smms_output/0_smms_twizy/6_7/20190607_153220/tiles/00000_Panorama/pano.xml';
        // syno.fs.download({ 'data': { 'path': downloadUrl } }, function(err, data) {
        //     console.log("downLoad");
        //     console.log("console data");
        //     console.log(data);
        //     console.log("console error");
        //     console.log(err);
        // });
        // syno.dl.createTask({ 'username': 'yujeong', 'password': 'tmxmfltm', 'uri': 'https://10.0.0.148/smms_output/0_smms_twizy/6_7/20190607_153220/tiles/00000_Panorama/test2.txt' }, function(err, data) {
        //     console.log("downLoad");
        //     console.log(data);
        //     console.log(err);
        // });