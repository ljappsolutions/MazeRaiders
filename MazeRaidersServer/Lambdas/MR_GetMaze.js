var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    var tableName = "Dev.MazeRaider.Maze";
    dynamodb.scan({
        TableName : tableName
    }, function(err, data) {
        if (err) {
            callback('reading dynamodb failed: '+err);
        }
        var items = data.Items;
        var mazes = getRandom(items, 5);
        callback(null, mazes);
    });
};

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        return arr;
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}