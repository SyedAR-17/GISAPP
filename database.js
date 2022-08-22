const {Client} = require('pg')

const client = new Client(
    {
        host: "localhost",
        user: "postgres",
        port: "5433",
        password: "157",
        database: "Practice"
    }
)
var province = [];
client.connect();
client.query('select distinct name_1 from pak_adm2', (err,res)=>{
    if(!err){
        // console.log(res.rows);
        console.log(res.rows.values);
        let result = res.rows.map(names => names.name_1);
        console.log(result);
    }
    else{
        console.log(err.message);
    }
    client.end;
}
)
