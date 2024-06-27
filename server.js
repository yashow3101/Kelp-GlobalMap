const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const bodyparser = require('body-parser')
const cors = require('cors')

app.use(bodyparser.json());
app.use(cors());

    const initializeData = () => {
        fs.readFile('data.json', (err, data) => {
            let locations = { live: [], inProgress: [], demo: [] };
    
            if (!err) {
                try {
                    locations = JSON.parse(data);
                } catch (parseErr) {
                    console.error('Error parsing data file:', parseErr);
                }
            }
    
            locations.live = locations.live || [];
            locations.inProgress = locations.inProgress || [];
            locations.demo = locations.demo || [];
    
            const updatedData = JSON.stringify(locations, null, 2);
            fs.writeFile('data.json', updatedData, err => {
                if (err) throw err;
                console.log('Initial data added successfully');
            });
        });
    };

initializeData();

app.post('/addLocation', (req, res) => {
    const newLocations = req.body;
    console.log(req.body)

    fs.readFile('data.json', (err, data) => {
        if (err) throw err;

        let locations={}
        try {
            locations = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing data file:', parseErr);
            return res.status(500).send('Internal Server Error');
        }

        // req.body.forEach(newLocation=>{
        //         locations.live = locations.live.filter(x => x.id !== newLocation.id);
        //         locations.inProgress = locations.inProgress.filter(x => x.id !== newLocation.id);
        //         locations.demo = locations.demo.filter(x => x.id !== newLocation.id);

        //         switch (newLocation.type) {
        //             case 'live':
        //                 locations.live.push(newLocation);
        //                 break;
        //             case 'inProgress':
        //                 locations.inProgress.push(newLocation);
        //                 break;
        //             case 'demo':
        //                 locations.demo.push(newLocation);
        //                 break;
        //             default:
        //                 return res.status(400).send('Invalid location type');
        //             }
        //         })

        newLocations.live.forEach(newLocation => {
            locations.live = locations.live.filter(x => x.id !== newLocation.id);
            locations.live.push(newLocation);
        });

        newLocations.inProgress.forEach(newLocation => {
            locations.inProgress = locations.inProgress.filter(x => x.id !== newLocation.id);
            locations.inProgress.push(newLocation);
        });

        newLocations.demo.forEach(newLocation => {
            locations.demo = locations.demo.filter(x => x.id !== newLocation.id);
            locations.demo.push(newLocation);
        });
                fs.writeFile('data.json', JSON.stringify(locations, null, 2), (err) => {
                    if (err) throw err;
                    console.log("UPDATED")
            })
        });
    })


app.get('/locations', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        res.status(200).json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});